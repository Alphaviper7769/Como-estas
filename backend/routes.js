const express = require('express');
const { check } = require('express-validator');
const auth = require('./utils/jwt-authentication');
const getcontrollers = require('./controllers/get-controllers');
const postcontrollers = require('./controllers/post-controllers');
const patchcontrollers = require('./controllers/patch-controllers');
const deletecontrollers = require('./controllers/delete-controllers');

const router = express.Router();

// Add all the routes here

// router.get('/', (req, res, next) => {});

// GET
router.get("/dashboard/post/:pid", getcontrollers.getPostByID);
router.get("/dashboard/apply/one/:aid", getcontrollers.getApplication);
router.get("/dashboard/apply/:aid", getcontrollers.getApplicationByID);
router.get("/dashboard/inbox/:uid", getcontrollers.getInbox);
router.get("/dashboard/profile/:admin/:uid", getcontrollers.getProfile);
router.get("/dashboard/:admin/:uid", getcontrollers.loadDashboard);

// router.use(auth);

// POST
router.post("/dashboard/post", postcontrollers.postNewJob);
router.post("/dashboard/apply", postcontrollers.applyForJob);
router.post("/dashboard/team", postcontrollers.addEmployee);
router.post("/dashboard/filter", postcontrollers.filter);
router.post('/signup', postcontrollers.signup);
router.post('/', postcontrollers.auth);

// PATCH
router.patch("/dashboard/post", patchcontrollers.updatePost);
router.patch("/dashboard/apply", patchcontrollers.updateApplication);
router.patch("/dashboard/permission", patchcontrollers.updatePermission);
router.patch("/dashboard/profile/:admin/:uid", patchcontrollers.updateProfile);
router.patch("/dashboard/inbox", patchcontrollers.sendMessage);

// DELETE
router.delete("/dashboard/post/:pid/:uid", deletecontrollers.deletePost);
router.delete("/dashboard/apply/:aid/:uid", deletecontrollers.deleteApplication);
router.delete("/dashboard/employee/:eid/:uid", deletecontrollers.deleteEmployee);

module.exports = router;