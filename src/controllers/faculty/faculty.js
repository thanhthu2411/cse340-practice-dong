import {
  getFacultyBySlug,
  getSortedFaculty,
} from "../../models/faculty/faculty.js";

const facultyListPage = async (req, res) => {
  const validSortOptions = ["name", "department", "title"];
  const sortQuery = req.query.sort;
  const sortBy = validSortOptions.includes(sortQuery)
    ? sortQuery
    : "department";

  const facultyList = await getSortedFaculty(sortBy);
  // console.log(facultyList);

  res.render("faculty/list", {
    title: "Faculty Directory",
    faculty: facultyList,
    currentSort: sortBy,
  });
};

const facultyDetailPage = async (req, res, next) => {
  const facultySlug = req.params.facultySlug;
  const facultyMember = await getFacultyBySlug(facultySlug);

  if (Object.keys(facultyMember).length === 0) {
    const err = new Error(`Faculty member ${facultySlug} not found`);
    err.status = 404;
    return next(err);
  }

  res.render("faculty/detail", {
    title: `${facultyMember.name} - Faculty Profile`,
    faculty: facultyMember,
  });
};

export { facultyListPage, facultyDetailPage };
