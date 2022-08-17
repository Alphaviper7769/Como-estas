const express = require('express');
const { check } = require('express-validator');
const auth = require('./utils/jwt-authentication');
const getcontrollers = require('./controllers/get-controllers');
const postcontrollers = require('./controllers/post-controllers');
const patchcontrollers = require('./controllers/patch-controllers');
const deletecontrollers = require('./controllers/delete-controllers');

const router = express.Router();

// Add all the routes here

// POST
router.post('/', postcontrollers.auth);
router.post('/signup', postcontrollers.signup);
// router.get('/', (req, res, next) => {});

// router.use(auth);

router.post('/dashboard/post', postcontrollers.postNewJob);
router.post("/dashboard/apply", postcontrollers.applyForJob);
router.post("/dashboard/team", postcontrollers.addEmployee);

// GET
router.get("/dashboard/post/:pid", getcontrollers.getPostByID);
router.get("/dashboard/apply/:aid", getcontrollers.getApplicationByID);
router.get("/dashboard/inbox/:uid", getcontrollers.getInbox);
router.get("/dashboard/:admin/:uid", getcontrollers.loadDashboard);
router.get("/dashboard/profile/:admin/:uid", getcontrollers.getProfile);

// PATCH
router.patch("/dashboard/post", patchcontrollers.updatePost);
router.patch("/dashboard/apply", patchcontrollers.updateApplication);
router.patch("/dashboard/permission", patchcontrollers.updatePermission);
router.patch("/dashboard/profile/:admin", patchcontrollers.updateProfile);

// DELETE
router.delete("/dashboard/post/:pid/:uid", deletecontrollers.deletePost);
router.delete("/dashboard/apply/:aid/:uid", deletecontrollers.deleteApplication);

module.exports = router;