import { Router } from "express";
import { AuthController } from "../controllers/Auth.controllers";
import { authentication } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";
import { RecruiterController } from "../controllers/Recruiter.controllers";

const router = Router();

// Recruiter routes
router.post('/recruiter/login', AuthController.loginRecruiter);
router.post('/recruiter/register', AuthController.registerRecruiter);

// Candidate routes
router.post('/candidate/login', AuthController.loginCandidate);
router.post('/candidate/register', AuthController.registerCandidate);

// Example of a protected route for recruiters
router.post('/recruiter/newJob/:id', authentication, authorization(['recruiter']), RecruiterController.jobPost);

// Example of a protected route for candidates
// router.get('/candidate/protected-route', authentication, authorization(['candidate']), (req, res) => {
//   res.send('You have access as a candidate');
// });

export default router;
