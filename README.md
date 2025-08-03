# NodeJSBlog
This Node.js Blog Website is a full-stack application that allows users to create, read, update, and delete blog posts. Built using Node.js, Express.js, and MongoDB, it offers a smooth and dynamic user experience. Users can register, log in, and publish blogs with images. The site supports comments, user authentication  via cookies and secure data handling. It's designed with a clean UI and efficient backend, making it ideal for sharing thoughts, articles, and updates online.  
The application follows MVC architecture and uses middleware for modularity and clean code structure.
Technologies Used
Backend:

Node.js – JavaScript runtime for building scalable server-side applications.

Express.js – Web framework to handle routing, middleware, and HTTP requests.

MongoDB – NoSQL database for storing users, blogs, and comments.

Mongoose – ODM for interacting with MongoDB in an object-oriented way.

Frontend:

EJS – Server-side templating engine to dynamically render HTML views.

Bootstrap/CSS – For responsive design and layout.

Authentication & Security:

Cookie-based authentication using HTTP-only cookies.

Passwords are securely hashed using crypto or bcrypt.

Access control for routes (e.g., only authors can edit/delete their posts).

File Uploads:

Multer – Middleware for handling multipart/form-data for uploading blog cover images.

Uploaded images are stored in user-specific folders under the public/uploads/ directory.

Features:

🧑‍💻 User Registration & Login

✍️ Create, Edit, and Delete Blogs

🖼️ Image Upload with Blogs

💬 Comment on Blogs

🔒 Secure authentication with role-based access

🧹 Clean URL routing using Express Router

📁 Folder Structure

NodejsBlog/
├── models/           # Mongoose schemas for User, Blog, Comment
├── routes/           # Express route handlers (user, blog, comment)
├── views/            # EJS templates (addBlog, editBlog, home, login, etc.)
├── public/           # Static files (CSS, JS, images)
│   └── uploads/      # User-uploaded images
├── middlewares/      # Custom middlewares (e.g., auth check)
├── app.js          # Entry point of the application
├── package.json      # Project metadata and dependencies

📂 MVC folder structure for scalable development

🌐 Error handling and fallback pages
