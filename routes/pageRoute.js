import { Router } from 'express';
import { getIndexPage, getAboutPage, getRegisterPage, getLoginPage, getContactPage, sendEmail } from '../controllers/pageController';
import redirectMiddleware from '../middlewares/redirectMiddleware';
const router = Router();

router.route('/').get(getIndexPage);
router.route('/about').get(getAboutPage);
router.route('/register').get(redirectMiddleware,getRegisterPage);
router.route('/login').get(redirectMiddleware,getLoginPage);
router.route('/contact').get(getContactPage);
router.route('/contact').post(sendEmail);

export default router;