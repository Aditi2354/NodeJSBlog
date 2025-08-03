const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

// 🔧 Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, `../public/uploads/${req.user._id}`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });


// ============================
// 📄 Add Blog Form Page
// ============================
router.get('/add-new', async (req, res) => {
  try {
    console.log("➡️ req.user in route:", req.user);

    const blogs = await Blog.find({}).populate('createdBy');
    return res.render('addBlog', {
      user: req.user,
      // ✔ blogs available in template
      

    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong');
  }
});


// ============================
// 📨 Handle Blog Submission
// ============================
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`,
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to create blog');
  }
});


// ============================
// 🔍 View Blog Details
// ============================
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: blog._id }).populate('createdBy');

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // 👇👇 ADD THIS LINE
    const user = req.user;

    return res.render('blog', {
      user,
      blog,
      comments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error loading blog details');
  }
});



router.post("/comment/:blogId", async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    res.redirect(`/blog/${req.params.blogId}`); // or send JSON if it's an API
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating comment");
  }
});






router.get('/cleanup', async (req, res) => {
  await Blog.deleteMany({ title: 'Test Blog Title' }); // change condition accordingly
  res.send('Cleanup done');
});




router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // 🧠 Delete image from disk if exists
    if (blog.coverImageURL) {
      const filePath = path.resolve(__dirname, `../public${blog.coverImageURL}`);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err.message);
        else console.log("Image deleted:", blog.coverImageURL);
      });
    }

    await blog.deleteOne();
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to delete blog');
  }
});


// ✅ Export the router
module.exports = router;
