const express = require('express');
const { check } = require('express-validator');
const controller = require('./controllers');

const router = express.Router();

// Add all the routes here
// GET
// router.get("/dashboard", controller.loadDashboard);
// router.get("/dashboard/post", controllergetPostByID);
// router.get("/dashboard/apply", controller.getApplicationByID);
// router.get("/dashboard/profile", controller.getProfile);

// POST
router.post('/', controller.auth);
router.post('/signup', controller.signup);
router.post('/dashboard/post', controller.postNewJob);
router.post("/dashboard/apply", controller.applyForJob);
router.post("/dashboard/team", controller.addEmployee);

// // PATCH
// router.patch("/dashboard/post", controller.updatePost);
// router.patch("/dashboard/apply", controller.upateApplication);
// router.patch("/dashboard/permission", controller.updatePermission);

// // DELETE
// router.delete("/dashboard/post", controller.deletePost);
// router.delete("/dashboard/apply", controller.deleteApplication);

module.exports = router;