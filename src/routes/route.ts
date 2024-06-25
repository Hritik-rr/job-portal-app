import { Router } from "express";
import { AuthController } from "../controllers/Auth.controllers";
import { authentication } from "../middlewares/authentication.middleware";
import { authorization } from "../middlewares/authorization.middleware";
import { RecruiterController } from "../controllers/Recruiter.controllers";
import { CandidateController } from "../controllers/Candidate.controllers";

const router = Router();

// Recruiter routes
router.post('/recruiter/login', AuthController.loginRecruiter);
router.post('/recruiter/register', AuthController.registerRecruiter);

// Candidate routes
router.post('/candidate/login', AuthController.loginCandidate);
router.post('/candidate/register', AuthController.registerCandidate);

router.post('/recruiter/newJob/:recId', authentication, authorization(['recruiter']), RecruiterController.jobPost);
router.get('/recruiter/applicationLogs/:jobId', authentication, authorization(['recruiter']), RecruiterController.jobApplicationLogs);

router.get('/candidate/searchJobs', authentication, authorization(['candidate']), CandidateController.getAvailableJobs);
router.post('/candidate/apply/:jobId', authentication, authorization(['candidate']), CandidateController.applyToJobs);
export default router;
