import { Router } from 'express';
import { createCourse, getAllCourses, getCourse, deleteCourse, updateCourse, enrollCourse, releaseCourse } from '../controllers/courseController';
import roleMiddleware from '../middlewares/roleMiddleware';
const router = Router();

router.route('/').post(roleMiddleware(["teacher", "admin"]),createCourse);
router.route('/').get(getAllCourses);
router.route('/:slug').get(getCourse);
router.route('/:slug').delete(deleteCourse);
router.route('/:slug').put(updateCourse);
router.route('/enroll').post(enrollCourse);
router.route('/release').post(releaseCourse);
export default router;