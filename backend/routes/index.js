import express from 'express';
import appointmentController from '../controllers/appointmentController.js'
import doctorsListController from '../controllers/listController.js';
import signUpController from '../controllers/signUpController.js';
import loginController from '../controllers/loginController.js';
import  updateStatus from '../controllers/appointmentController.js';
import  authenticateToken  from '../middleware/auth.js';
import forgotPassword from '../controllers/forgotPassword.js' 
import { googleAuth,googleAuthCallback } from '../controllers/loginController.js';
import manageDoctor from '../controllers/manageDoctor.js';

import ratingController from '../controllers/ratingController.js';
const router=express.Router();

router.use('/manageDoctors',manageDoctor);

router.use('/',updateStatus);

router.use('/',ratingController);

router.use('/listDoctors',authenticateToken,doctorsListController);

router.get('/google',(req, res, next)=>{console.log('inside /google'); next();},googleAuth);
router.use('/google/callback',googleAuthCallback);
router.use('/signUp',signUpController);
router.use('/login',loginController);
router.use('/',appointmentController);   

router.use('/',forgotPassword);

export default router;