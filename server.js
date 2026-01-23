// Imports
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
// Course data - place this after imports, before routes
const courses = {
  CS121: {
    id: "CS121",
    title: "Introduction to Programming",
    description:
      "Learn programming fundamentals using JavaScript and basic web development concepts.",
    credits: 3,
    sections: [
      { time: "9:00 AM", room: "STC 392", professor: "Brother Jack" },
      { time: "2:00 PM", room: "STC 394", professor: "Sister Enkey" },
      { time: "11:00 AM", room: "STC 390", professor: "Brother Keers" },
    ],
  },
  MATH110: {
    id: "MATH110",
    title: "College Algebra",
    description:
      "Fundamental algebraic concepts including functions, graphing, and problem solving.",
    credits: 4,
    sections: [
      { time: "8:00 AM", room: "MC 301", professor: "Sister Anderson" },
      { time: "1:00 PM", room: "MC 305", professor: "Brother Miller" },
      { time: "3:00 PM", room: "MC 307", professor: "Brother Thompson" },
    ],
  },
  ENG101: {
    id: "ENG101",
    title: "Academic Writing",
    description:
      "Develop writing skills for academic and professional communication.",
    credits: 3,
    sections: [
      { time: "10:00 AM", room: "GEB 201", professor: "Sister Anderson" },
      { time: "12:00 PM", room: "GEB 205", professor: "Brother Davis" },
      { time: "4:00 PM", room: "GEB 203", professor: "Sister Enkey" },
    ],
  },
};
/**
 * Declare Important Variables
 */
const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
// import.meta.url is the url of the current js file (where server.js is located)
const __dirname = path.dirname(__filename);

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express middleware
 */
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public"))); // when a request comes in, try to match the url path to a file inside public/

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));

/**
 * Global template variables middleware
 *
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
  // Make NODE_ENV available to all templates
  res.locals.NODE_ENV = NODE_ENV.toLowerCase() || "production";

  // Continue to the next middleware or route handler
  next();
});

app.use((req, res, next) => {
  // Skip logging for routes that start with /. (like /.well-known/)
  if (!req.path.startsWith("/.")) {
  }
  next();
});

app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// Global middleware for time-based greeting
app.use((req, res, next) => {
  const currentHour = new Date().getHours();

  if (0 < currentHour && currentHour < 12) {
    res.locals.greeting = "<p>Good Morning!</p>";
  } else if (currentHour <= 17) {
    res.locals.greeting = "<p>Good Afternoon!</p>";
  } else {
    res.locals.greeting = "<p>Good Evening!</p>";
  }

  next();
});

app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme'];

    const randomThemeId = Math.floor(Math.random() * themes.length);
    const randomTheme = themes[randomThemeId];
    
    res.locals.bodyClass = randomTheme;
    next();
})

app.use((req, res, next) => {
    // Make req.query available to all templates for debugging and conditional rendering
    res.locals.queryParams = req.query || {};

    next();
});

const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'hihi');

    next();
}

/**
 * Declare Routes
 */
app.get("/", (req, res) => {
  const title = "Welcome to Our Restaurant";
  res.render("home", { title });
});
app.get("/about", (req, res) => {
  const title = "About Me";
  res.render("about", { title }); // just need to pass in view name like 'about' not '/about'
});

app.get("/catalog", (req, res) => {
  res.render("catalog", {
    title: "Course Catalog",
    courses: courses,
  });
});

app.get("/catalog/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  const course = courses[courseId];

  if (!course) {
    const err = new Error(`Course ${courseId} not found`);
    err.status = 404;
    console.error("not found");
    return next(err);
  }

  // Get sort parameter (default to 'time')
  const sortBy = req.query.sort || "time";

  // Create a copy of sections to sort
  let sortedSections = [...course.sections];

  // Sort based on the parameter
  switch (sortBy) {
    case "professor":
      sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
      break;
    case "room":
      sortedSections.sort((a, b) => a.room.localeCompare(b.room));
      break;
    case "time":
    default:
      // Keep original time order as default
      break;
  }

  console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

  res.render("course-detail", {
    title: `${course.id} - ${course.title}`,
    course: { ...course, sections: sortedSections },
    // create a new object course, but replace sections with sortedSections
    currentSort: sortBy,
  });
});

app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    })
})

app.get("/help", (req, res) => {
  const title = "Help Page";
  res.render("help", { title });
});

// Test route for 500 errors
app.get("/test-error", (req, res, next) => {
  const err = new Error("This is a test error");
  err.status = 500;
  next(err);
});

//catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// global error handler
app.use((err, req, res, next) => {
  // Prevent infinite loops, if a response has already been sent, do nothing
  if (res.headersSent || res.finished) {
    return next(err);
  }

  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: NODE_ENV === "production" ? "An error occurred" : err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
  };

  // render the appropriate error templates with fallback
  try {
    res.status(status).render(`errors/${template}`, context);
  } catch (renderErr) {
    // If rendering fails, send a simple error page instead
    if (!res.headersSent) {
      res
        .status(status)
        .send(`<h1>Error ${status}</h1><p>An error occurred</p>`);
    }
  }
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(PORT) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
