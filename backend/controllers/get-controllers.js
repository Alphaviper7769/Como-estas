const mongoose = require('mongoose');
const express=require('express');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const HttpError = require('../utils/http-error');

const User = require('../models/user');
const Post = require('../models/post');
const Company = require('../models/company');
const Application = require('../models/application');
const Employee = require('../models/employee');
const Inbox = require('../models/inbox');
const { json } = require('body-parser');

// GET
const loadDashboard = async (req, res, next) => {
    // getting userID from URL
    const isEmployer = req.params.admin;
    const userID = req.params.uid;
    if(isEmployer == 1) {
        // check whether it's an employee or the main company account
        let existingUser;
        let isMain = true;
        try {
            // Main company account
            existingUser = await Company.findById(userID);
            if(!existingUser) {
                // Employee Account... Restrict permissions
                existingUser = await Employee.findById(userID);
                isMain = false;
            }
        } catch (err) {
            return next(
                new HttpError('Could not connect to the server', 500)
            );
        }
        if(!existingUser) {
            return next(
                new HttpError('Invalid credentials', 422)
            );
        }
        // load company details, posted jobs and employees
        let posts = [];
        let permissions = [];
        let team = [];
        if(isMain) {
            // for Main Account -> All permissions
            try {
                posts = await existingUser.populate('posts');
                team = await existingUser.populate('employees');
            } catch (err) {
                return next(
                    new HttpError('Could not fetch details', 500)
                );
            }
            // permissions set to all posts
            posts = posts.posts;
            team = team.employees;
            permissions = existingUser.posts;
        } else {
            let company;
            // for Employees -> specific permissions
            try {
                company = await Company.findById(existingUser.companyID);
            } catch (err) {
                return next(
                    new HttpError('Could not fetch details', 500)
                );
            }
            
            if(!company) {
                return next(
                    new HttpError('No such company found', 422)
                );
            }

            // getting all posts and employees
            try {
                posts = await company.populate('posts');
                team = await company.populate('employees');
            } catch (err) {
                return next(
                    new HttpError('Could not fetch details', 500)
                );
            }
            // limited permissions
            permissions = existingUser.permissions;
        }
        res
            .status(200)
            .json({ 
                isMain: isMain,
                posts: posts.map(post => post.toObject({ getters: true })), 
                team: team.map(employee => employee.toObject({ getters: true })), 
                permissions: permissions.map(permission => permission.toObject({ getters: true })),
                user: existingUser
            });
    } else {
        // get profile, jobs, applied for the user
        let existingUser;
        try {
            existingUser = await User.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to database', 500)
            );
        }
        // if userID was not found
        if(!existingUser) {
            return next(
                new HttpError('No user found', 422)
            );
        }
        // all applications submitted by the user
        let applications = [];
        // all jobs posted by all companies
        let jobs = [];
        try {
            applications = await existingUser.populate('applications');
            jobs = await Post.find();
        } catch(err) {
            return next(
                new HttpError('Database connection error', 500)
            );
        }
        // console.log(applications, jobs);
        // get corresponding company names
        for(let i=0;i<jobs.length;i++) {
            try {
                const cname = await Company.findById(jobs[i].companyID);
                jobs[i]._doc = { ...jobs[i]._doc, company: cname.name };
            } catch (err) {
                return next(
                    new HttpError('Could not connect to server', 500)
                );
            }
        }
        applications = applications.applications;
        let applied = [];
        for(let i=0;i<applications.length;i++) {
            let postname, companyname;
            try {
                postname = await Post.findById(applications[i].postID);    
            } catch (err) {
                return next(
                    new HttpError('Could not connect to server', 500)
                );
            }
            try {
                companyname = await Company.findById(postname.companyID);
            } catch (err) {
                return next(
                    new HttpError('Could not connect to server', 500)
                );
            }
            const dateApplied = applications[i].date.toString().split(' ');
            applied.push({
                _id: applications[i]._id.toString(),
                post: postname.name,
                company: companyname.name,  
                date: dateApplied[1] + " " + dateApplied[2] + " " + dateApplied[3]
            });
        }
        res
            .status(201)
            .json({ 
                user: existingUser.toObject({ getters: true }), 
                applications: applied.map(application => application), 
                jobs: jobs.map(job => job.toObject({ getters: true }))
            });
    }
};

const getPostByID = async (req, res, next) => {
    const postID = req.params.pid;
    let post;
    try {
        // find post with postID
        post = await Post.findById(postID);
    } catch (err) {
        return next(
            new HttpError('Connection to server failed', 500)
        );
    }
    // if no such post exist
    if(!post) {
        return next(
            new HttpError('No post found', 404)
        );
    }

    // also get company details
    let company;
    try {
        company = await Company.findById(post.companyID, { password: 0 });
    } catch (err) {
        return next(
            new HttpError('Could not connect to the server', 500)
        );
    }

    if(!company) {
        return next(
            new HttpError('Could not find the company', 404)
        );
    }

    res.status(201).json({ post: post.toObject({ getters: true }), company: company.toObject({ getters: true }) });
};

const getApplicationByID = async (req, res, next) => {
    const postID = req.params.aid;
    // get the post
    let post;
    try {
        post = await Post.findById(postID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    if(!post) {
        return next(
            new HttpError('No such post', 404)
        );
    }

    // get all applicants with their details
    let app = [];
    for(let i=0;i<post.applications.length;i++) {
        let appli;
        try {
            appli = await Application.findById(post.applications[i]);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
        let appliUser;
        try {
            appliUser = await User.findById(appli.userID, { password: 0 });
        } catch (err) {
            return next(
                new HttpError('Could not connect to server')
            );
        }

        if(!appli || !appliUser) {
            return next(
                new HttpError('No data matched', 404)
            );
        }
        app.push({
            application: appli,
            user: appliUser
        });
    }

    res.status(201).json({ application: app });
};

const getApplication = async (req, res, next) => {
    const appID = req.params.aid;
    let application;
    try {
        application = await Application.findById(appID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    if(!application) {
        return next(
            new HttpError('No application found', 404)
        );
    }

    let user;
    try {
        user = await User.findById(application.userID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    if(!user) {
        return next(
            new HttpError('Could not find the user', 404)
        );
    }

    let post;
    try {
        post = await Post.findById(application.postID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    if(!post) {
        return next(
            new HttpError('Could not find post', 404)
        );
    }

    res.status(201).json({ application: application.toObject({ getters: true }), user: user.toObject({ getters: true }), post: post.toObject({ getters: true }) });
};

const getProfile = async (req, res, next) => {
    const userID = req.params.uid;
    const admin = req.params.admin;
    let user;
    if(admin == 0) {
        try {
            user = await User.findById(userID, { password: 0 });
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
    } else {
        try {
            user = await Company.findById(userID, { password: 0 });
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
        if(!user) {
            // check in employee
            try {
                user = await Employee.findById(userID, { password: 0 });
            } catch (err) {
                return next(
                    new HttpError('Could not connect to server', 500)
                );
            }
        }
    }
    // if no user found, display error
    if(!user) {
        return next(
            new HttpError('No User/Company found')
        );
    }

    res.status(201).json({ user: user.toObject({ getters: true }) });
};

const getInbox = async (req, res, next) => {
    const userID = req.params.uid;
    // console.log(userID);
    let inbox;
    try {
        inbox = await Inbox.findOne({ _id: userID });
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }
    console.log(inbox);
    res.status(201).json({ inbox: inbox.toObject({ getters: true }) });
};

// const fetchParameters=async(req,res,next) => {
//     // getting user parameters from the body
//     const minSalary= req.body;
//     const maxSalary= req.body;
//     const location=  req.body.;
//     const talent=    req.body.;
//     const expirence= req.body.;
//     //errors while inputting user parameters


//     //getting backend data from MONGODB
//     let dataArray;
//     let rank;
//     Application.find({},{projection: {id=1,}}).toArray(function(err,result){
//         if (err) throw err;
//         dataArray=result;
//     });

//     for(i=0,i<dataArray.length,i++)
//     {
//         rank[0][i]=dataArray[i].id; 
//         rank[1][i]=dataArray[i].Salary*1.5+dataArray[i].location*1.1 + dataArray[i].talent*1.3 +dataArray[i].expirence*1.2
//         //sort the rank           //     look into this ^
//     }

//     //rank
//     //salary*  +location*   +talent*     +exp* =array
//     rank[1].sort();
//     //sort array

//     //print jobs accordingly

// }

exports.loadDashboard = loadDashboard;
exports.getPostByID = getPostByID;
exports.getApplicationByID = getApplicationByID;
exports.getProfile = getProfile;
exports.getInbox = getInbox;
exports.getApplication = getApplication;