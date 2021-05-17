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
const saltRounds = 10;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const multer = require("multer");
// const activity = require("./models/activity");
// const admin = require("./models/admin");
// const sempoints = require("./models/questiontable");
require("dotenv").config();


user.hasMany(questiontable);
questiontable.belongsTo(user,{constraints:true});
user.hasMany(answertable);
answertable.belongsTo(user,{constraints:true});
questiontable.hasMany(answertable);
answertable.belongsTo(questiontable,{constraints:true});
var Storagecerti = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'certificates');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
    }
  });
  const fileFiltercerti=(req,file,cb)=>{
    console.log("yess");
    console.log(file);
    if(file.mimetype == 'application/pdf' || 
        file.mimetype == 'image/jpg' || 
        file.mimetype =='image/png' || 
        file.mimetype =='image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }

}

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




app.post("/signup", (req, res, next) => {
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
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
                err.statusCode = 403;
                err.message = "username already registered!! choose another";
                res.send(err.message);
                next(err);
            });
    });
});
app.post("/login", (req, res) => {
    user.findAll({where:{email:req.body.email}})
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


sequelize
    .sync()
    .then((r) => {
        // console.log(r);
        app.listen(process.env.PORT || 8001);
    })
    .catch((err) => console.log(err));