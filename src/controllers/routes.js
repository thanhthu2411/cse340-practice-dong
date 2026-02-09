import { Router } from 'express';
import {addDemoHeaders} from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import {homePage, aboutPage, demoPage, testErrorPage, helpPage} from './index.js'
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import contactRoutes from './forms/contact.js';
// Create a new router instance
const router = Router();

// Router middleware should be added here, before route definitions
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});


router.get('/', homePage);
router.get('/about', aboutPage);

router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);
router.get('/help', helpPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:facultySlug', facultyDetailPage);

router.use('/contact', contactRoutes);

export default router;