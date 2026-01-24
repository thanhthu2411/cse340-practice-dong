import { Router } from 'express';
import {addDemoHeaders} from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import {homePage, aboutPage, demoPage, testErrorPage, helpPage} from './index.js'
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
// Create a new router instance
const router = Router();

router.get('/', homePage);
router.get('/about', aboutPage);

router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);
router.get('/help', helpPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

export default router;