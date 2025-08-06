const { Schema ,model} = require("mongoose");
const { error } = require("node:console");
const{createHmac,randomBytes}=require('node:crypto')
const { createTokenForUser } = require('../services/authentication'); 
const userSchema = new Schema ({

fullName: {
type: String,
required: true,
},
email:{
type: String,
required: true, 
unique:true
},
salt:{
type: String,

},
password:{
type: String,
required: true, 
},
profileImageURL:{
type: String, 
default:'/images/profile.png'
},

role:{
    type:String,
    enum:['USER','ADMIN'],
    default:'USER'
}
},{timestamps:true});

userSchema.pre("save", function (next) {
  const user = this;

  // Agar password already hashed hai toh skip
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPassword;
  user.salt = salt;

  next();
});



userSchema.static("matchPasswordAndGenerateTokens", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new Error("Password Invalid");

  const token = createTokenForUser(user);

  // 👇 Return both token and user
  return { token, user };
});

const User = model('user', userSchema); // ✅ good


module.exports=User;