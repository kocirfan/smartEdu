import { Router } from 'express';
import { createUser, loginUser, logoutUser, getDashboardPage, deleteUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { body } from 'express-validator';
import { findOne } from '../models/User';
const router = Router();

router.route('/signup').post(
    [
       body('name').not().isEmpty().withMessage('Please Enter Your Name'),


       body('email').isEmail().withMessage('Please Enter Valid Email')
       .custom((userEmail) =>{
           return findOne({email:userEmail}).then(user =>{
               if(user){
                   return Promise.reject('Email is already exists!')
               }
           })
       }),


       body('password').not().isEmpty().withMessage('Please Enter A Password')

    ],

    createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/dashboard').get(authMiddleware, getDashboardPage);
router.route('/:id').delete(deleteUser);
export default router;