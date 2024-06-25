"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controllers_1 = require("../controllers/Auth.controllers");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const Recruiter_controllers_1 = require("../controllers/Recruiter.controllers");
const Candidate_controllers_1 = require("../controllers/Candidate.controllers");
const router = (0, express_1.Router)();
// Recruiter routes
router.post('/recruiter/login', Auth_controllers_1.AuthController.loginRecruiter);
router.post('/recruiter/register', Auth_controllers_1.AuthController.registerRecruiter);
// Candidate routes
router.post('/candidate/login', Auth_controllers_1.AuthController.loginCandidate);
router.post('/candidate/register', Auth_controllers_1.AuthController.registerCandidate);
// Example of a protected route for recruiters
router.post('/recruiter/newJob/:recId', authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)(['recruiter']), Recruiter_controllers_1.RecruiterController.jobPost);
router.get('/recruiter/applicationLogs/:jobId', authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)(['recruiter']), Recruiter_controllers_1.RecruiterController.jobApplicationLogs);
router.get('/candidate/searchJobs', authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)(['candidate']), Candidate_controllers_1.CandidateController.getAvailableJobs);
router.post('/candidate/apply/:jobId', authentication_middleware_1.authentication, (0, authorization_middleware_1.authorization)(['candidate']), Candidate_controllers_1.CandidateController.applyToJobs);
// Example of a protected route for candidates
// router.get('/candidate/protected-route', authentication, authorization(['candidate']), (req, res) => {
//   res.send('You have access as a candidate');
// });
exports.default = router;
