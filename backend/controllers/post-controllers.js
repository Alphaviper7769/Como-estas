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
        const { name, email, password } = req.body;
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
            phone: '',
            email,
            password: hashed,
            website: '',
            posts: [],
            employees: []
        });

        try {
            // save the instance to database
            await created.save();
        } catch (err) {
            console.log(err);
            return next(
                new HttpError('Sign up failed', 500)
            );
        }
    } else {
        // Register an User
        const { name, email, password } = req.body;
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
            dob: '',
            sex: '',
            phone: '',
            about: '',
            post: '',
            email,
            password: hashed,
            resume: '',
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
    // send a message saying Welcome
    const inbox = new Inbox({
        _id: created._id.toString(),
        inbox: [{
            sender: "Como Estas",
            senderID: "0",
            message: "Welcome, complete your Profile to make full use of the site. Happy searching"
        }]
    });

    // push to Inbox database;
    try {
        await inbox.save();
    } catch (err) {
        console.log(err);
        return next(
            new HttpError('Could not connect to the database', 500)
        );
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
    let permit = (userID == companyID); // if the company account s requesting, allow it
    if(!permit) {
        try {
            // find employee with their employee
            const employee = await Employee.findById(userID);
            permit = employee._id.toString() == userID;
        } catch (err) {
            console.log(err);
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
    let e = true;
    try {
        user = await User.findById(userID);
        post = await Post.findById(postID);
    } catch (err) {
        e = false;
    }
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
            post.applications.push(created);
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

    // send message to Employee
    const inbox = new Inbox({
        _id: created._id.toString(),
        inbox: {
            sender: "Como-estas",
            senderID: "0",
            message: `You have been added to ${company.name} suite. Contact your manager to know your permissions`
        }
    });
    // push inbox
    try {
        await inbox.save();
    } catch (err) {
        return next(
            new HttpError('Could not connect to the database', 500)
        );
    }

    res.status(200).json({ employee: created.toObject({ getters: true }) });
};

exports.auth = auth;
exports.signup = signup;
exports.postNewJob = postNewJob;
exports.applyForJob = applyForJob;
exports.addEmployee = addEmployee;