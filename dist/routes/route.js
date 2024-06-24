"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controllers_1 = require("../controllers/Auth.controllers");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const router = (0, express_1.Router)();
// Recruiter routes
router.post('/recruiter/login', Auth_controllers_1.AuthController.loginRecruiter);
router.post('/recruiter/register', Auth_controllers_1.AuthController.registerRecruiter);
// Candidate routes
router.post('/candidate/login', Auth_controllers_1.AuthController.loginCandidate);
router.post('/candidate/register', Auth_controllers_1.AuthController.registerCandidate);
// Example of a protected route for recruiters
router.get('/recruiter/protected-route', authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)(['recruiter']), (req, res) => {
    res.send('You have access as a recruiter');
});
// Example of a protected route for candidates
router.get('/candidate/protected-route', authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)(['candidate']), (req, res) => {
    res.send('You have access as a candidate');
});
exports.default = router;
