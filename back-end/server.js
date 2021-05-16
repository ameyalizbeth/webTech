const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const Cors = require("cors");
const sequelize = require("./util/database");
const user = require("./models/user");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const activity = require("./models/activity");
const admin = require("./models/admin");
const sempoints = require("./models/sempoints");
require("dotenv").config();

//MULTER
// const filestorage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'images');
//     },
//     filename:(req,file,cb)=>{

//         cb(null, new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
//     }
// });
// const fileFilter=(req,file,cb)=>{
//     if(file.mimetype == 'image/jpg' || file.mimetype =='image/png' || file.mimetype =='image/jpeg'){
//         cb(null,true);
//     }
//     else{
//         cb(null,false);
//     }

// }

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

app.use('/certi',multer({storage:Storagecerti,fileFilter:fileFiltercerti}).single('certificatedata'));
app.use('/certificates',express.static(path.join(__dirname,'certificates')));

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


// admin.create({
//     username:"cs203"
// }).then((r) => {
//     console.log(r);
// })
// .catch((err) => {
//     console.log(err);
// });

app.post("/signup", (req, res, next) => {
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        user.create({
            // name:req.body.name,
            email: req.body.email,
            username: req.body.username,
            fullname:req.body.fullname,
            password: hash,
            currsem:req.body.currsem,
            address: req.body.address,
            phoneno: req.body.phoneno,
        })
            .then((r) => {
                const username = user.username;
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
    user.findByPk(req.body.username)
        .then((user) => {
            if (user) {
                bcrypt.compare(
                    req.body.password,
                    user.password,
                    (err, response) => {
                        if (response) {
                            req.session.user = user;

                            const username = user.username;
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

app.post("/admin/login", (req, res) => {
    admin
        .findByPk(req.body.username)
        .then((admin) => {
            if (admin) {
                const username = admin.username;
                const token = jwt.sign({ username }, process.env.SECRET, {
                    expiresIn: 7200,
                });
                // console.log(req.session.user);
                res.status(200).json({ auth: true, token: token });
            } else {
                //    res.status(404).send({message:"No user found!!"});
                res.json({ auth: false, message: "Admin not found!!" });
            }
        })
        .catch((err) => console.log(err));
});

app.post("/admin/signup", (req, res, next) => {
    admin
        .create({
            username: req.body.username,
        })
        .then((r) => {
            const username = admin.username;
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

// app.put("/sempoints", verifyJWT, (req, res, next) => {
//     sempoints.update(
//       {
//         username:req.body.username,
//         point: req.body.point
//     },
//     )
//     .then((r) => {
//         console.log(r)
//     })
//     .catch(
//         (err) => console.log(err)
//     )
//    });

app.post("/activity", verifyJWT, (req, res, next) => {
    activity
        .create({
            username: req.body.username,
            sem: req.body.sem,
            activity: req.body.activity,
            category:req.body.category,
            prize: req.body.prize,
            level: req.body.level,
        })
        .then((r) => {
            res.status(200).json({ message: "Activity added" });
        })
        .catch((err) => {
            err.statusCode = 403;
            err.message = "Something went wrong!!";
            res.send(err.message);
            next(err);
        });
});

app.get("/:username/sempoints", verifyJWT, (req, res, next) => {
    sempoints
        .findAll({
            where: {
                username: req.params.username,
            },
        })
        .then((user) => {
            res.status(200).json(
                user
               
            );
            // const users =[];
            // console.log(user);
            // user.map((e) => {
            //     users.push(e.dataValues.point)
            // });
            // res.send(200).json(
            //     users
            // )
        })
        .catch((err) => {
            console.log(err);
        });
});
app.post("/sempoints", verifyJWT, (req, res, next) => {

    console.log(req.body.point);

    sempoints.findAll({where: {
        username: req.body.username,
        sem:req.body.sem
    }}).then((response) => {
        // console.log(response);
        

        if(response.length == 0){
            sempoints
        .create({
            username: req.body.username,
            sem: req.body.sem,
            point:req.body.point
        }).then((r) => {
            console.log(r);
        }).catch((err) => {
                console.log(err);
        })
        }else{
            sempoints.update({point:req.body.point},
                {where:{
                    username:req.body.username,
                    sem:req.body.sem
                },
                returning:true,plain:true}).then((r)=>{
                    console.log(r);
                }).catch((err) => {
                    console.log(err);
                })
        };
    })

    
        .then((r) => {
            res.status(200).json({ message: "Activity point added" });
        })
        .catch((err) => {
            err.statusCode = 403;
            err.message = "Something went wrong!!";
            res.send(err.message);
            next(err);
        });
});

app.post("/approval", verifyJWT, (req, res, next) => {

    console.log(req.body.verfiy);
    activity.update({verify:true},
        {where:{
            id:req.body.id
        },
        returning:true,plain:true}).then((r)=>{
            console.log(r);
        }).catch((err) => {
            console.log(err);
        })

    // sempoints.findAll({where: {
    //     username: req.body.username,
    //     sem:req.body.sem
    // }}).then((response) => {
    //     // console.log(response);
        

    //     if(response.length == 0){
    //         sempoints
    //     .create({
    //         username: req.body.username,
    //         sem: req.body.sem,
    //         point:req.body.point
    //     }).then((r) => {
    //         console.log(r);
    //     }).catch((err) => {
    //             console.log(err);
    //     })
    //     }else{
    
    //     };
    // })

    
    //     .then((r) => {
    //         res.status(200).json({ message: "Activity point added" });
    //     })
    //     .catch((err) => {
    //         err.statusCode = 403;
    //         err.message = "Something went wrong!!";
    //         res.send(err.message);
    //         next(err);
    //     });
});

app.post("/certi/activity",verifyJWT,(req,res,next)=>{

    console.log(req.file);
    console.log(req.body.title);

    if(!req.file){
      res.sendStatus(422);
    }
    // else if (req.userid===req.params.studentid){
    //   certificate.create({username:req.userid,title:req.body.title,category:req.body.category,filepath:req.file.path});
    //   res.sendStatus(200);
    // }

//    else
//    res.sendStatus(401);
    
        activity
        .create({
            username: req.body.username,
            sem: req.body.sem,
            title: req.body.title,
            category:req.body.category,
            prize: req.body.prize,
            level: req.body.level,
            point:req.body.point,
            verify:req.body.verify,
            image:req.file.path
        })
        .then((r) => {
            res.status(200).json({ message: "Activity added" });
        })
        .catch((err) => {
            err.statusCode = 403;
            err.message = "Something went wrong!!";
            res.send(err.message);
            next(err);
        });
    
  });

app.get("/:username/:sem/activity", verifyJWT, (req, res, next) => {
    activity
        .findAll({
            where: {
                username: req.params.username,
                sem: req.params.sem,
            },
        })
        .then((activity) => {
            res.status(200).json(
                activity
                //     {

                //     // name:user.name,
                //     // activity:activity.activity,
                //     // prize:activity.prize,
                //     // level:activity.level,
                //     // image:user.image
                // }
            );
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/admin/studentinfo", verifyJWT, (req, res, next) => {
    user
        .findAll({
            attributes: [
                [
                    Sequelize.fn("DISTINCT", Sequelize.col("username")),
                    "username",
                ],
                "email"
            ],
        })
        .then((activity) => {
            res.status(200).json(activity);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/isAuth", verifyJWT, (req, res) => {
    res.send("User Is Authenticated");
});

// app.get('/login', (req, res) => {
//     if (req.session.user){
//         res.send({loggedIn: true, user: req.session.user});
//     }else{
//         res.send({loggedIn:false});
//     }
// });
app.get("/:username/user", verifyJWT, (req, res, next) => {
    user.findByPk(req.params.username)
        .then((user) => {
            res.status(200).json({
                // name:user.name,
                email: user.email,
                address: user.address,
                phoneno: user.phoneno,
                username: user.username,
                currsem: user.currsem,
                fullname:user.fullname
                // image:user.image
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/:username/page", (req, res, next) => {
    user.findByPk(req.params.username)
        .then((user) => {
            res.status(200).json({
                name: user.name,
                email: user.email,
                address: user.address,
                phoneno: user.phoneno,
                username: user.username,
                image: user.image,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

// app.use((error,req,res,next)=>{
//     console.log(error);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     res.status(status).send();
//     console.log(status);
// });

app.post("/:username/images", (req, res) => {
    user.findByPk(req.params.username)
        .then((user) => {
            const p = user.image;
            console.log(req.file);
            console.log(p);
            user.update({ image: req.file.path })
                .then((r) => {
                    res.status(200).json({ path: req.file.path });
                    if (p) {
                        fs.unlink(p, function (err) {
                            if (err) throw err;
                            console.log("file deleted");
                        });
                    }
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });

    console.log(req.file);
});

sequelize
    .sync()
    .then((r) => {
        // console.log(r);
        app.listen(process.env.PORT || 8001);
    })
    .catch((err) => console.log(err));
