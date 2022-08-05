const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const HttpError = require('./utils/http-error');

const User = require('./models/user');
const Post = require('./models/post');
const Company = require('./models/company');
const Application = require('./models/application');
const Employee = require('./models/employee');

// POST
const auth = async (req, res, next) => {
    // extract email and password from body
    const { email, password } = req.body;
    let admin;
    let existingUser;
    try {
        // check in User database
        existingUser = await User.findOne({ email: email });
        admin = 0;
        if(!existingUser) {
            // if not found in User, find in Company
            existingUser = await Company.findOne({ email: email });
            admin = 1;
        }
        if(!existingUser) {
            // check in Employees
            existingUser = await Employee.findOne({ email: email });
            admin = 2;
        }
    } catch (err) {
        const error = new HttpError('Could not Log in', 500);
        return next(error);
    }

    // if user not found, throw an error
    if(!existingUser) {
        const error = new HttpError('No user with that credential', 403);
        return next(error);
    }

    // matching hashed password from database and password from frontend
    let correctPassword = false;
    try {
        correctPassword = await compare(password, existingUser.password)
    } catch (err) {
        return next(
            new HttpError('Could not Log in', 500)
        );
    }
    // if passwords don't match
    if(!correctPassword) {
        return next(
            new HttpError('Invalid Password', 403)
        );
    }

    // respond with userID (MongoDB _id)
    res.status(200).json({ userId: existingUser._id.toString(), admin: admin });
};

const signup = async (req, res, next) => {
    // check if request is of the right format
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid Inputs passed', 422)
        );
    }

    let created;
    if(req.body.employer) {
        // Register a Company
        const { name, phone, email, password, website } = req.body;
        let existingUser;
        try {
            // Look for existing User
            existingUser = await Company.findOne({ email: email });
        } catch (err) {
            return next(
                new HttpError('Signing up failed', 500)
            );
        }
        if(existingUser) {
            // user already exists
            return next(
                new HttpError('User already Exists', 422)
            );
        }

        // Hash the password before saving it
        let hashed;
        try {
            hashed = await hash(password, 12);
        } catch (err) {
            new HttpError('Could not signup', 500)
        }
        // Creating an instance of Company
        created = new Company({
            name,
            phone,
            email,
            password: hashed,
            website,
            posts: [],
            employees: []
        });
        try {
            // save the instance to database
            await created.save();
        } catch (err) {
            return next(
                new HttpError('Sign up failed', 500)
            );
        }
    } else {
        // Register an User
        const { name, dob, sex, phone, about, post, email, password, resume } = req.body;
        let existingUser;
        try {
            // Look for existing User
            existingUser = await User.findOne({ email: email });
        } catch (err) {
            return next(
                new HttpError('Signing up failed', 500)
            );
        }
        if(existingUser) {
            // user already exists
            return next(
                new HttpError('User already Exists', 422)
            );
        }

        // Hash the password before saving it
        let hashed;
        try {
            hashed = await hash(password, 12);
        } catch (err) {
            new HttpError('Could not signup', 500)
        }
        // Creating an instance of User
        created = new User({
            name,
            dob,
            sex,
            phone,
            about,
            post,
            email,
            password: hashed,
            resume: resume || '',
            applications: []
        });
        try {
            // save the instance to database
            await created.save();
        } catch (err) {
            return next(
                new HttpError('Sign up failed', 500)
            );
        }
    }

    // responding with MongoDb _id
    res.status(200).json({ userID: created._id, admin: req.body.employer });
};

const postNewJob = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid inputs', 422)
        );
    }
    const { name, vacancy, date, companyID, skills, eligibility, questions, dueDate, salary, location, userID } = req.body;
    
    // check whether user is allowed to post a job
    let permit = userID == companyID; // if the company account s requesting, allow it
    if(!permit) {
        try {
            // find employee with their employee
            const employee = await Employee.findById(userID);
            permit = employee._id.toString() == userID;
        } catch (err) {
            return next(
                new HttpError('Could not add post', 500)
            );
        }
    }
    if(!permit) {
        return next(
            new HttpError('User does not have permission', 401)
        );
    }
    // new post instance
    const created = new Post({
        name,
        vacancy,
        applications: [],
        date,
        companyID,
        skills: skills || [],
        eligibility: eligibility || [],
        questions: questions || [],
        dueDate,
        salary,
        location
    });
    // push to database
    try {
        await created.save();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError('Server side error', 500)
        );
    }

    // add post to Company
    let company;
    let success = true;
    try {
        company = await Company.findById(companyID);
    } catch (err) {
        success = false;
    }

    if(success) {
        try {
            // adding post to Company
            company.posts.push(created);
            await company.save();
        } catch (err) {
            success = false;
        }
    }

    if(!success) {
        // delete created from the database due to the error
        try {
            await created.remove();
        } catch (err) {
            return next(
                new HttpError('Could not remove post, manual required', 500)
            );
        }
        return next(
            new HttpError('Could not find the Company', 404)
        );
    }

    res.status(200).json({ post: created.toObject({ getters: true }) });
};

const applyForJob = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid Inputs', 422)
        );
    }

    const { userID, postID, answers, date } = req.body;
    const created = new Application({
        userID,
        postID,
        answers: answers || [],
        date
    });
    // save to database
    try {
        await created.save();
    } catch (err) {
        return next(
            new HttpError('Could not connect database')
        );
    }

    // find user and post using IDs
    let user, post;
    let e = false;
    try {
        user = await User.findById(userID);
        post = await Post.findById(postID);
        e = true;
    } catch (err) {}
    // if could not find user or post or ran into a problem, delete the created Application and throw error
    if(!user || !post || !e) {
        try {
            // removing the created Application
            await created.remove();
        } catch (err) {
            return next(
                new HttpError('Could not connect to database, manual deletion is required', 500)
            );
        }
    } else {
        try {
            // pushing applications to User and Post databases
            user.applications.push(created);
            post.applicantions.push(created);
            // starting a mongoose session to puh multiple changes to database
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await user.save({ session: sess });
            await post.save({ session: sess });
            // commit changes
            await sess.commitTransaction();
        } catch (err) {
            return next(
                new HttpError('Could not connect to the database', 500)
            );
        }
    }

    res.status(200).json({ application: created.toObject({ getters: true }) });
};

const addEmployee = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid inputs', 422)
        );
    }

    const { name, email, password, permissions, companyID } = req.body;
    // check if company exists and save it's instance to add employee id
    let company;
    try {
        company = await Company.findById(companyID);
    } catch (err) {
        return next(
            new HttpError('Could not add Employee', 500)
        );
    }
    // if company not found
    if(!company) {
        return next(
            new HttpError('Could not find the company', 404)
        );
    }

    // hashing password
    let hashed;
    try {
        hashed = await hash(password, 12);
    } catch (err) {
        return next(
            new HttpError('Could not generate Hash', 500)
        );
    }

    // create a Employee instance
    const created = new Employee({
        name,
        email,
        password: hashed,
        permission: permissions || [],
        companyID
    });
    // push changes to mongoose by starting session
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await created.save({ session: sess });
        company.employees.push(created._id.toString());
        await company.save({ session: sess });
        sess.commitTransaction();
    } catch (err) {
        return next(
            new HttpError('Could not connect to database', 500)
        );
    }

    res.status(200).json({ employee: created.toObject({ getters: true }) });
};

// GET
const loadDashboard = async (req, res, next) => {
    // getting userID from URL
    const isEmployer = req.params.admin;
    const userID = req.params.uid;
    if(isEmployer) {
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
        let posts;
        let permissions;
        let team;
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
                posts: posts.toObject({ getters: true }), 
                team: team.toObject({ getters: true }), 
                permissions: permissions.toObject({ getters: true }),
                user: existingUser.toObject({ getters: true })
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
        let applications;
        // all jobs posted by all companies
        let jobs;
        try {
            applications = await existingUser.populate('applications');
            jobs = await Post.find();
        } catch(err) {
            return next(
                new HttpError('Database connection error', 500)
            );
        }

        res
            .status(200)
            .json({ 
                user: existingUser.toObject({ getters: true }), 
                applications: applications.toObject({ getters: true }), 
                jobs: jobs.toObject({ getters: true }) 
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
    // if no uch post exist
    if(!post) {
        return next(
            new HttpError('No post found', 404)
        );
    }
    res.status(201).json({ post: post.toObject({ getters: true }) });
};

const getApplicationByID = async (req, res, next) => {
    const applicationID = req.params.aid;
    // get application
    let application;
    try {
        application = Application.findById(applicationID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server')
        );
    }
    // if no application found
    if(!application) {
        return next(
            new HttpError('No such application found', 404)
        );
    }

    res.status(201).json({ application: application.toObject({ getters: true }) });
};

const getProfile = async (req, res, next) => {
    const userID = req.params.uid;
    const admin = req.params.admin;
    let user;
    if(!admin) {
        try {
            user = await User.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
    } else {
        try {
            user = await Company.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
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

    // deleting from all applicants
    post.applications.map(async (applicationID) => {
        let applicantID;
        let applicant;
        try {
            applicantID = await Application.findById(applicationID).userID;
            applicant = await User.findById(applicantID);
            applicant.applications.pull({ _id: applicationID });
            applicant.save();
        } catch (err) {}
    });

    // deleting from the database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await post.remove({ session: sess });
        company.posts.pull({ _id: postID });
        await company.save({ session: sess });
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

    // delete from  database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        post.applications.pull({ _id: applicationID });
        await post.save({ session: sess });
        await application.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(
            new HttpError('Could not delete', 500)
        );
    }

    res.statu(201).json({ message: "Deleted Successfully" });
};

// POST
exports.auth = auth;
exports.signup = signup;
exports.postNewJob = postNewJob;
exports.applyForJob = applyForJob;
exports.addEmployee = addEmployee;

// GET
exports.loadDashboard = loadDashboard;
exports.getPostByID = getPostByID;
exports.getApplicationByID = getApplicationByID;
exports.getProfile = getProfile;

// DELETE
exports.deletePost = deletePost;
exports.deleteApplication = deleteApplication;