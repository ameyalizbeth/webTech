const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const Cors = require("cors");
const sequelize = require("./util/database");
const user = require("./models/user");
const questiontable = require("./models/questiontable");
const answertable = require("./models/answertable");
const app = express();
const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const multer = require("multer");

require("dotenv").config();


user.hasMany(questiontable);
questiontable.belongsTo(user,{constraints:true});
user.hasMany(answertable);
answertable.belongsTo(user,{constraints:true});
questiontable.hasMany(answertable);
answertable.belongsTo(questiontable,{constraints:true});


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
    Cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(
    session({
        key: "username",
        secret: "appu703453",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

app.use(express.json());
// app.use(multer({storage:filestorage,fileFilter:fileFilter}).single('data'));

const verifyJWT = (req, res, next) => {
    // const token = req.headers["x-access-token"];
    const token = req.get("x-access-token");

    if (!token) {
        res.send("NO TOKEN FOUND!!");
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "Failed to Auth" });
            } else {
                req.id = decoded.id;
                next();
            }
        });
    }
};

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
    );

    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});




app.post("/signup", async(req, res, next) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(req.body.password,salt);
    user.create({
           
        email: req.body.email,
        
        fullname:req.body.fullname,
        password: hash,
        department:req.body.department,
        
    })
    .then((r) => {
           
            const username = user.fullname;
            const token = jwt.sign({ username }, process.env.SECRET, {
                expiresIn: 7200,
            });
            res.status(200).json({
                message: "signup succesfull",
                auth: true,
                token: token,
            });
        })
        .catch((err) => {
            console.log("hi")
            err.statusCode = 403;
            err.message = "email already registered!! choose another";
            res.send(err.message);
            next(err);
        });
});
app.post("/login", (req, res) => {
    user.findByPk(req.body.email)
        .then((user) => {
            if (user) {
                bcrypt.compare(
                    req.body.password,
                    user.password,
                    (err, response) => {
                        if (response) {
                            req.session.user = user;

                            const username = user.fullname;
                            const token = jwt.sign(
                                { username },
                                process.env.SECRET,
                                {
                                    expiresIn: 7200,
                                }
                            );
                            // console.log(req.session.user);
                            res.status(200).json({ auth: true, token: token });
                        } else {
                            res.json({
                                auth: false,
                                message: "wrong combinations!!",
                            });
                        }
                    }
                );
            } else {
                //    res.status(404).send({message:"No user found!!"});
                res.json({ auth: false, message: "No user found!!" });
            }
        })
        .catch((err) => console.log(err));
});

app.get("/:email/user", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    user.findByPk(req.params.email)
        .then((user) => {
            res.status(200).json({
                
                email: user.email,
                department: user.department,
                fullname:user.fullname
                
            });console.log(user);
        })
        .catch((err) => {

            console.log(err);
        });
});

app.get("/question",verifyJWT,(req,res,next)=>{
    questiontable.findAll()
    .then((r)=>{
        
        console.log(r);
    })
    .catch((err)=>{
        next(err);
    })
})

app.get("/answer/:questionid",verifyJWT,(req,res,next)=>{
    answertable.findAll({where:{questiontableQuestionid:req.params.questionid}})
    .then((r)=>{
        console.log(r);
    })
    .catch((err)=>{
        next(err);
    })
})
app.post("/votes/:answerid",verifyJWT,(req,res,next)=>{
    answertable.findByPk(req.params.answerid)
    .then((answer)=>{
        answer.votes +=1;
        
    })
    .catch((err)=>{
        next(err);
    })
})
app.post("/question/user", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    console.log(req.body.question);
    questiontable.create({
        question:req.body.question,
        category:req.body.category,
        userEmail:req.body.email})
    .then((r)=>{
       res.sendStatus(200);
    })
    .catch((err)=>{
        next(err)
    })

        
});
app.post("/answer/user", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    
    answertable.create({answer:req.body.answer,userEmail:req.body.email,questiontableQuestionid:req.body.questionid})
    .then((r)=>{
       res.send(200);
    })
    .catch((err)=>{
        next(err)
    })

        
});

app.get("/question/user", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    
    questiontable.findAll({where:{userEmail:req.body.email}})
    .then((r)=>{
        console.log(r);
       res.send(200);
    })
    .catch((err)=>{
        next(err)
    })

        
});

app.get("/answer/user", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    
    answertable.findAll({where:{userEmail:req.body.email}})
    .then((r)=>{
       res.send(200);
    })
    .catch((err)=>{
        next(err)
    })

        
});

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).send();
    console.log(status);
});
sequelize
    .sync()
    .then((r) => {
        // console.log(r);
        app.listen(process.env.PORT || 8001);
    })
    .catch((err) => console.log(err));