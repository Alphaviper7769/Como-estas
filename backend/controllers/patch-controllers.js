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

// PATCH
const updatePost = async (req, res, next) => {
    // check the format of the request body
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid input', 422)
        );
    }

    const { postID, name, vacancy, skills, eligibility, questions, dueDate, salary, location, experience, userID } = req.body;
    // check if post exists
    let post;
    try {
        post = await Post.findById(postID);
    } catch (err) {
        return next(
            new HttpError('Server error', 500)
        );
    }

    if(!post) {
        return next(
            new HttpError("No such post found", 404)
        );
    }
    // check if user has permission to edit
    let companyID = post.companyID.toString();
    if(userID != companyID) {
        // Main company account is not requesting, find the employee
        let user;
        try {
            user = await Employee.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
        if(!user) {
            return next(
                new HttpError("No Employee found with that ID", 404)
            );
        }

        if(!user.permissions.find(p => p == postID)) {
            return next(
                new HttpError('Employee does not have permission to edit', 401)
            );
        }
    }
    // edit post
    post.name = name;
    post.vacancy = vacancy;
    post.skills = skills;
    post.eligibility = eligibility;
    post.questions = questions;
    post.dueDate = dueDate;
    post.salary = salary;
    post.location = location;
    post.experience = experience;

    // update database
    try {
        await post.save();
    } catch (err) {
        return next(
            new HttpError('Could not connect to database', 500)
        );
    }

    res.status(201).json({ post: post.toObject({ getters: true }) });
};

const updateApplication = async (req, res, next) => {
    const error = validationResult(req);
    // check for body format
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid input', 422)
        );
    }

    const { userID, applicationID, answers } = req.body;
    // check if it is the same user updating
    let user;
    try {
        user = await User.findById(userID);
    } catch (err) {
        return next('Could not connect to server', 500)
    }

    if(!user.applications.find(a => a == applicationID)) {
        return next(
            new HttpError('User does not have permission', 404)
        );
    }
    // find the application
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
            new HttpError('No such application found', 404)
        );
    }
    // mkae changes
    application.answers = answers;
    // updating changes
    try {
        await application.save();
    } catch (err) {
        return next(
            new HttpError('Could not connect to database', 500)
        );
    }

    res.status(201).json({ application: application.toObject({ getters: true }) });
};

const updatePermission = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid input', 422)
        );
    }

    const { employeeID, permissions, userID } = req.body;
    let employee;
    // find employee
    try {
        employee = await Employee.findById(employeeID);
    } catch (err) {
        return next(
            new HttpError('Connecting to server failed', 500)
        );
    }
    // check if userID matches companyID
    if(!employee) {
        return next(
            new HttpError('Could not find requested employee', 404)
        );
    }
    if(employee.companyID != userID) {
        return next(
            new HttpError('Company does not match', 401)
        );
    }

    let permission = [];
    permissions.length > 0 && permissions.map(async (perm) => {
        let postof;
        try {
            postof = await Post.findById(perm);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
        permission.push(postof);
    });

    // set permissions
    employee.permissions = permission;

    // send message to notify
    const inbox = {
        sender: "Como-estas",
        senderID: "0",
        message: "Your permissions has been updated, please check"
    };

    let empInbox;
    try {
        empInbox = await Inbox.findOne({ id: employeeID });
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    // push changes to database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await employee.save({ session: sess });
        empInbox.inbox.push(inbox);
        await empInbox.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(
            new HttpError('Could not connect to database', 500)
        );
    }

    res.status(201).json({ employee: employee.toObject({ getters: true }) });
};

const updateProfile = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid input format', 422)
        );
    }
    const isEmployer = req.params.admin;
    const userID = req.params.uid;
    if(isEmployer === '1') {
        // change company profile
        const { name, phone, email, website } = req.body;
        let company;
        try {
            company = await Company.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
        if(!company) {
            return next(
                new HttpError('Could not find the requested company', 404)
            );
        }
        // hashing password
        // let hashed;
        // try {
        //     hashed = await hash(password, 12);
        // } catch (err) {
        //     return next(
        //         new HttpError('Could not hash password', 500)
        //     );
        // }

        // updating values
        company.name = name;
        company.phone = phone;
        company.email = email;
        // company.password = hashed;
        company.website = website;
        // company.posts = posts;
        // company.employees = employees;

        // push changes to database
        try {
            await company.save();
        } catch (err) {
            return next(
                new HttpError('Could not connect to database', 500)
            );
        }
        
        res.status(201).json({ company: company.toObject({ getters: true }) });
    } else {
        // user profile
        const { name, dob, sex, phone, about, post, email, resume, skills } = req.body;
        // get user from database
        let user;
        try {
            user = await User.findById(userID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }

        if(!user) {
            return next(
                new HttpError('No such user found', 404)
            );
        }
        // hash the password
        // let hashed;
        // try {
        //     hashed = await hash(password, 12);
        // } catch (err) {
        //     return next(
        //         new HttpError('Could not hash password', 500)
        //     );
        // }
        // change the user
        user.name = name;
        user.dob = dob;
        user.sex = sex;
        user.phone = phone;
        user.about = about;
        user.post = post;
        user.email = email;
        // user.password = hashed;
        user.resume = resume;
        user.skills = skills;
        // user.applications = applications;

        // push changes to database
        try {
            await user.save();
        } catch (err) {
            return next(
                new HttpError('Could not connect to database', 500)
            );
        }

        res.status(201).json({ user: user.toObject({ getters: true }) });
    }
};

const sendMessage = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            new HttpError('Invalid input format', 422)
        );
    }
    const { email, senderID, message } = req.body;
    console.log(senderID);
    // finding the sender
    let sender;
    try {
        sender = await Company.findById(senderID);
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }
    if(!sender) {
        // could be an employee
        try {
            sender = await Employee.findById(senderID);
        } catch (err) {
            return next(
                new HttpError('Could not connect to server', 500)
            );
        }
    }

    if(!sender) {
        return next(
            new HttpError('No such sender', 404)
        );
    }

    // get userID from email id
    let user;
    try {
        user = await User.findOne({ email: email }, { password: 0 });
        if(!user) {
            // could be in employee
            user = await Employee.findOne({ email: email }, { password: 0 });
        }
    } catch (err) {
        return next(
            new HttpError('Could not connect to server', 500)
        );
    }

    const inbox = {
        sender: sender.name,
        senderID: senderID,
        message: message
    };

    let userInbox, empInbox;
    try {
        userInbox = await Inbox.findOne({ _id: user._id.toString() });
        empInbox = await Inbox.findOne({ _id: senderID });
    } catch (err) {
        return next(
            new HttpError('Could not connect to database', 500)
        );
    }

    // push to Inbox database
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        userInbox.inbox.push(inbox);
        await userInbox.save({ session: sess });
        empInbox.inbox.push(inbox);
        await empInbox.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(
            new HttpError('Could not connect to database', 500)
        );
    }
};

exports.updatePost = updatePost;
exports.updateApplication = updateApplication;
exports.updatePermission = updatePermission;
exports.updateProfile = updateProfile;
exports.sendMessage = sendMessage;