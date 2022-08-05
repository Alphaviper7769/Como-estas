const express = require('express');
const { check } = require('express-validator');
const controller = require('./controllers');

const router = express.Router();

// Add all the routes here
// GET
router.get("/dashboard/:admin/:uid", controller.loadDashboard);
router.get("/dashboard/post/:pid", controller.getPostByID);
router.get("/dashboard/apply/:aid", controller.getApplicationByID);
router.get("/dashboard/profile/:admin/:uid", controller.getProfile);

// POST
router.post('/', controller.auth);
router.post('/signup', controller.signup);
router.post('/dashboard/post', controller.postNewJob);
router.post("/dashboard/apply", controller.applyForJob);
router.post("/dashboard/team", controller.addEmployee);

// PATCH
// router.patch("/dashboard/post", controller.updatePost);
// router.patch("/dashboard/apply", controller.upateApplication);
// router.patch("/dashboard/permission", controller.updatePermission);

// DELETE
router.delete("/dashboard/post/:pid/:uid", controller.deletePost);
router.delete("/dashboard/apply/:aid/:uid", controller.deleteApplication);

module.exports = router;