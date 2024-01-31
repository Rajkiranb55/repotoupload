const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

DB_LOCATION =
  "mongodb+srv://radba8:skribbleblog@skribbledb.kgmcfkh.mongodb.net/?retryWrites=true&w=majority";

//creating the server
const server = express();

//will enable to accept json dta from frontend
const cors = require("cors");

server.use(express.json());

server.use(cors(
    {
        origin: ["https://repotoupload-61js.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
//initiating the server on 8000 port
server.listen("https://repotoupload.vercel.app", () => {
  console.log("server started");
});

//connecting to mongo db
mongoose.connect(DB_LOCATION, {
  autoIndex: true,
});

//Schemas - to define the kind of data we want to put into database

const User = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: {
    type: Object,
  },
});

//routes

//req--data that we are getting from teh user from teh from

//res- is the response we are sending to the user after process
let emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
server.post("/signup", (req, res) => {
  //fullname,email,password

  let { name, email, password } = req.body;

  //vaidating the data

  if (name.length < 3) {
    return res
      .status(403)
      .json({ error: "full na me must be atleast 3 letters log" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "enter email" });
  }
  if (!emailregex.test(email)) {
    return res.status(403).json({ error: "enter valid email" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "password should have minimum 8 characters including numbers alphabets of lower and capital case  and special characters",
    });
  }

  let user = new User({
    name: name,
    email: email,
    password: password,
  });
  user.save();

  res.status(200).json({ status: "ok" });
});
//jwt-access token
// let accessToken = jwt.sign({ email: email }, "rkb2345fgvvwlopandkd");

server.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let userlogin = await User.findOne({ email });

  if (!userlogin) {
    return res.status(401).json({ error: "Authentication failed" });
  }
  const passCompare = password === userlogin.password;
  if (!passCompare) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  const token = jwt.sign({ userId: userlogin._id }, "rkb2345fgvvwlopandkd");

  res.json({ success: true, token, userName: userlogin.name });
});

//upload image to server using multer

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.filename}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

server.use("/images", express.static("upload/images"));

server.post("/upload", upload.single("newPost"), (req, res) => {
  res.json({
    success: 1,
    image_url: `https://repotoupload.vercel.app/${req.file.filename}`,
  });
});

//need to authenticate to find the user

//to save post to the db
const Post = mongoose.model("Posts", {
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
  },
});
//auth middleware

const auth = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    // console.log(token);
    const decoded = jwt.verify(token, "rkb2345fgvvwlopandkd");
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      console.log("user not found");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication required" });
  }
};

//model for Post
server.post("/createpost", auth, async (req, res) => {
  let userData = req.user;
  try {
    let post = new Post(req.body.post);
    console.log(post);
    post.save();
    return res.status(200).json("Post saved succefully");
  } catch (error) {
    return res.status(500).json(error);
  }
});

server.get("/allposts", async (req, res) => {
  try {
    let allPosts = await Post.find({});
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});
server.get("/blogdata/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.put("/updatepost/:id", auth, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    console.log(result.title);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.put("/updatepost2/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ msg: "Post not found" });
    }
    const result = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body.post,
      },
      { new: true }
    );

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//method 3 for put
server.put("/updatepost3/:id", async (req, res) => {
  let upId = req.params.id;
  let upPost = req.body.post;
  let upTitle = req.body.title;
  console.log("post from req", upPost);
  const result = Post.findOneAndUpdate(
    { _id: upId },
    { $set: { title: upTitle } },
    { new: true }
  );

  console.log("after call result ", result);
});

//delete the post

server.delete("/deletepost/:id", auth, async (req, res) => {
  try {
    let delId = req.params.id;

    let res = Post.findOneAndDelete({ delId });

    res.json({ success: "ok", msg: "done deleting" });
  } catch (error) {
    res.status(500).json(error);
  }
});
server.delete("/deletepost2/:id", async (req, res) => {
  try {
    const blog = await Post.findOneAndDelete({ _id: req.params.id });
    res.send("all good");
  } catch (error) {
    res.status(500).json(error);
  }
});

//to create a comment
//scheman mmoel for comment
const Comment = mongoose.model("Comments", {
  name: { type: String, required: true },
  postId: { type: String, required: true },
  date: { type: String },
  comments: { type: String, required: true },
});

server.post("/addcomment", auth, async (req, res) => {
  try {
    const newComment = await new Comment(req.body);
    newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//to get all comments

server.get("/allcomments/:id", async (req, res) => {
  try {
    console.log("getting comments for ", req.params.id);
    const allCommnets = await Comment.find({ postId: req.params.id });
    console.log("comments", allCommnets);

    res.status(200).json(allCommnets);
  } catch (error) {
    res.status(500).json(error);
  }
});
