const express = require('express');
const { check } = require('express-validator');
const controller = require('./controllers');

const router = express.Router();

// Add all the routes here
// GET
router.get("/dashboard", loadDashboard);
router.get("/dashboard/post", getPostByID);
router.get("/dashboard/apply", getApplicationByID);
router.get("/dashboard/profile", getProfile);

// POST
router.post("/", controller.auth);
router.post("/signup", signup);
router.post("/dashboard/post", postNewJob);
router.post("/dashboard/apply", applyForJob);

// PATCH
router.patch("/dashboard/post", updatePost);
router.patch("/dashboard/apply", upateApplication);
router.patch("/dashboard/addteam", updateEmployeeList);
router.patch("/dashboard/permission", updatePermission);

// DELETE
router.delete("/dashboard/post", deletePost);
router.delete("/dashboard/apply", deleteApplication);

module.exports = router;