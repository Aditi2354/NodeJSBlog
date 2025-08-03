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


mongoose.connect(process.env.MONGO_URL).then(()=>console.log('Mongodb connected'))


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

app.get('/', async(req,res)=>{
    const allBlogs=await Blog.find({})
    return res.render('home',{
    user:req.user,
    blogs:allBlogs
    })
})

app.listen(PORT,()=>console.log(`server started at port ${PORT}`))