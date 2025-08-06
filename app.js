require('dotenv').config();

const path=require('path')
const express=require('express')
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const mongoose=require('mongoose');
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog=require('./models/blog')
const { log } = require('console');
const methodOverride = require('method-override');


const app=express();
const PORT= process.env.PORT||8000;


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Mongodb connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server started at port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

startServer();


app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(checkForAuthenticationCookie('token'))
app.use('/uploads', express.static(path.resolve('./public/uploads')));
app.use('/images', express.static(path.resolve('./public/images')));
app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({});
console.log("🔥 BLOGS FETCHED WITHOUT POPULATE:", allBlogs);

  console.log("🔥 BLOGS FETCHED:", allBlogs); // Debug log
  return res.render('home', {
    user: req.user,
    blogs: allBlogs
  });
});

mongoose.connection.once('open', async () => {
  console.log("🔍 Connected to DB — running raw query");

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("📚 Collections in DB:", collections.map(c => c.name));

  const blogs = await mongoose.connection.db.collection('blogs').find({}).toArray();
  console.log("📂 Raw blogs directly from MongoDB:", blogs);
});
console.log("👀 Model collection name:", Blog.collection.name);

app.listen(PORT,()=>console.log(`server started at port ${PORT}`))