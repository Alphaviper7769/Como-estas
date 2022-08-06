const mongoose = require('mongoose');
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

// DELETE
const deletePost = async (req, res, next) => {
    const postID = req.params.pid;
    const userID = req.params.uid;
    let post;
    try {
        post = await Post.findById(postID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server')
        );
    }
    if(!post) {
        return next(
            new HttpError('Could not find the post')
        );
    }
    // true if permission
    let allowed = false;
    // find the user that requested deletion in Company first
    let user;
    try {
        user = await Company.findByID(userID);
    } catch (err) {
        return next(
            new HttpError('Internal Server Error')
        );
    }

    if(!user) {
        // find it in Employee
        try {
            user = await Employee.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to the server')
            );
        }
        // loop through the permissions array and see if the employee is allowed
        if(user) {
            allowed = user.permissions.find((permission) => {
                return permission.toString() == postID;
            });
        }
    } else {
        allowed = true;
    }

    if(!user) {
        return next(
            new HttpError('No user with that ID')
        );
    }
    // if the user is not allowed to make changes
    if(!allowed) {
        return next(
            new HttpError('You are not allowed to make changes', 401)
        );
    }

    // find the company that posted it
    let company;
    try {
        company = await Company.findById(postID);
    } catch (err) {
        return next(
            new HttpError('Server error', 500)
        );
    }

    if(!company) {
        return next(
            new HttpError('Could not find the company that posted it', 404)
        );
    }

    // inbox message to be sent to the applicants
    let inbox = {
        sender: `${company.name}`,
        senderID: company._id.toString(),
        message: `Job for the Post of ${post.name} offered by ${company.name} dated ${post.date} has been deleted by the Company. Please contact us if it is an error.`
    };
    // deleting from all applicants
    post.applications.map(async (applicationID) => {
        let applicantID;
        let applicant;
        let userInbox;;
        try {
            // start mongoose session
            const sess = await mongoose.startSession();
            sess.startTransaction();
            applicantID = await Application.findById(applicationID).userID;
            applicant = await User.findById(applicantID);
            applicant.applications.pull({ _id: applicationID });
            await applicant.save({ session: sess });
            userInbox = await Inbox.findOne({ id: applicantID });
            userInbox.inbox.push(inbox);
            // push and save inbox
            await userInbox.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {}
    });

    // send message to company and it's employees
    inbox = [{
        sender: 'Como-estas',
        senderID: '0',
        message: `Job for the post of ${post.name} dated ${post.date} has been deleted. Contact us if it is an error`
    }];
    // find company inbox and send
    let companyInbox;
    try {
        companyInbox = await Inbox.findOne({ id: company._id.toString() });
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    // also send message to user that requested if it's not from company account
    if(userID != company._id.toString()) {
        let employeeInbox;
        try {
            employeeInbox = await Inbox.findOne({ id: userID });
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }

        // push to Inbox
        try {
            employeeInbox.inbox.push(inbox);
            await employeeInbox.save();
        } catch (err) {
            return next(
                new HttpError('Could not connect to database')
            );
        }
    }

    // deleting from the database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await post.remove({ session: sess });
        company.posts.pull({ _id: postID });
        await company.save({ session: sess });
        companyInbox.inbox.push(inbox);
        await companyInbox.save();
        await sess.commitTransaction();
    } catch(err) {
        return next(
            new HttpError('Could not delete from database', 500)
        );
    }

    res.status(201).json({ message: "Deleted Successfully" });
};

const deleteApplication = async (req, res, next) => {
    const applicationID = req.params.aid;
    const userID = req.params.uid;
    let application;
    try {
        application = await Application.findById(applicationID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    if(!application) {
        return next(
            new HttpError('Could not find the Application', 404)
        );
    }
    let post;
    // find the post that has that particular application
    try {
        post = await Post.findById(application.postID);
    } catch (err) {
        return next(
            new HttpError('Internal Server error', 500)
        );
    }

    if(!post) {
        return next(
            new HttpError('Could not find the post', 404)
        );
    }

    if(userID != application.userID && userID != post.companyID) {
        return next(
            new HttpError('Not Authorized', 401)
        );
    }

    // deleting from user
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
            new HttpError('No such user', 404)
        );
    }

    // delete from  database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        // pull application ID from Pist and User database
        post.applications.pull({ _id: applicationID });
        user.applications.pull({ _id: applicationID });
        await user.save({ session: sess });
        await post.save({ session: sess });
        // removing the application from Application database
        await application.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(
            new HttpError('Could not delete', 500)
        );
    }

    res.statu(201).json({ message: "Deleted Successfully" });
};

exports.deletePost = deletePost;
exports.deleteApplication = deleteApplication;