import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = (req, res) => {
    
    //sorting
    const sortBy = req.query.sort || 'name';
    const sortedFaculty = getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty List',
        facultyList: sortedFaculty,
        currentSort: sortBy
    })
}

const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);
    if(!faculty) {
        const err = new Error("Faculty not found!");
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: `${facultyId} - ${faculty.name}`,
        faculty: faculty
    });
};

export {facultyListPage, facultyDetailPage};