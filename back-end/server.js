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
const multer = require('multer');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");


require("dotenv").config();


user.hasMany(questiontable);
questiontable.belongsTo(user,{constraints:true});
user.hasMany(answertable);
answertable.belongsTo(user,{constraints:true});
questiontable.hasMany(answertable);
answertable.belongsTo(questiontable,{constraints:true,onDelete:'CASCADE'});


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const filestorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        
        cb(null, new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype == 'image/jpg' || file.mimetype =='image/png' || file.mimetype =='image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }

}
app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/dp',multer({storage:filestorage,fileFilter:fileFilter}).single('data'));

app.use(
    Cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
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
    console.log(req.params.email);
    user.findByPk(req.params.email)
        .then((user) => {
            res.status(200).json({
                
                email: user.email,
                department: user.department,
                fullname:user.fullname,
                image:user.image
            });
        })
        .catch((err) => {

            console.log(err);
        });
});

app.post("/dp/:email",(req,res,next)=>{
    
    
    user.findByPk(req.params.email)
    .then((user)=>{
        console.log(user);
        const p = user.image;
        console.log(req.file);
        user.update(
            {image:req.file.path}
            )
        .then(r=>{
            res.status(200).json({path:req.file.path});
            if(p){
            fs.unlink(p,function (err){
                if(err) throw err;
                console.log('file deleted');
        })}


        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        }) ;

    })
    .catch((err)=>{
        next(err);
    })

})


const promise1 = (r) => {
    return new Promise(async(resolve, reject) => {
     
      let questions= await Promise.all(
        r.map(async (e) => {
          return answertable
            .findAll({
                attributes: [
                   [ sequelize.fn('MAX',sequelize.col('votes')),"votes"],
                   'answerid','answer'
                ],
              where: { questiontableQuestionid: e.dataValues.questionid },
              include: [
                user
              ],
            })
            .then((r) => {
               
              var qaobject = new Object();
              qaobject.question = e.dataValues.question;
              qaobject.questionid = e.dataValues.questionid;
              qaobject.category = e.dataValues.category;
              qaobject.user =e.dataValues.user.fullname;
              qaobject.answer = r[0].dataValues.answer;
              qaobject.answervotes = r[0].dataValues.votes;
              qaobject.answereduser =  r[0].dataValues.user;
             
              
              return qaobject
            })
            .catch((err) => {
              console.log(err);
            });
        })
      )
    // console.log(questions)
     
      
        resolve(questions);
     
    });
  };

app.get("/question", verifyJWT, async(req, res, next) => {
  questiontable
    .findAll({
        include:[
            user
        ]
     })
    .then((r) => {
        promise1(r)
        .then(function (value) {
          value.reverse();
          res.status(200).json({ questions: value });
        })
        .catch((err) => {
            console.log(err);
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
    
   
});

app.get("/answer/:questionid",verifyJWT,(req,res,next)=>{
    answertable.findAll(
        {
            where:{questiontableQuestionid:req.params.questionid},
            include:[
                user
            ]
        })
    .then((r)=>{
        const result = []
        r.map((e)=>{
            var obj = new Object();
            obj.answerid = e.dataValues.answerid;
            obj.answer = e.dataValues.answer;
            obj.votes = e.dataValues.votes;
            obj.answereduser = e.dataValues.user.fullname;
            result.push(obj);
        })
        res.send(200).json({result:result});
        console.log(result);
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
app.put("/question/user",verifyJWT,(req,res,next)=>{
    questiontable.findByPk(req.body.questionid)
    .then((q)=>{
        q.update({question:req.body.question,category:req.body.category})
        .then(r=>res.sendStatus(200))
        .catch((err)=>{
            next(err);
        })
    })

})

app.delete("/question/user",verifyJWT,(req,res,next)=>{
    
    questiontable.destroy({
        where:{
            questionid:req.body.questionid
        }
    })
    .then((r)=>{
        res.sendStatus(200);

    })
    .catch((err)=>{
        next(err);
    })
})


app.post("/answer/user", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    
    answertable.create({answer:req.body.answer,userEmail:req.body.email,questiontableQuestionid:req.body.questionid})
    .then((r)=>{
       res.sendStatus(200);
    })
    .catch((err)=>{
        next(err)
    })

        
});

app.get("/question/:email", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);
    

    questiontable.findAll(
        {where:{userEmail:req.params.email}
    })
    .then((r)=>{
        const result =[];
       r.map((e)=>{
    
        var ansobject = new Object();
        ansobject.question =e.dataValues.question;
        ansobject.questionid =e.dataValues.questionid;
        ansobject.category =e.dataValues.category;
       
       
          result.push(ansobject);  
       })
       console.log(result);
       res.status(200).json({result:result});
      
 })
    .catch((err)=>{
        next(err)
    })

        
});

app.get("/activityanswer/:email", verifyJWT, (req, res, next) => {
    // console.log(req.params.email);

   
    answertable.findAll(
        {where:{userEmail:req.params.email},
        include: [
            questiontable
        ]
    })
    .then((r)=>{
        const result = [];
       r.map((e)=>{
        var ansobject = new Object();
        ansobject.question =e.dataValues.questiontable.question;
        ansobject.category =e.dataValues.questiontable.category;

        ansobject.answer = e.dataValues.answer;
        ansobject.votes =e.dataValues.votes;
       
       
          result.push(ansobject);  
       })
       console.log(result);
       res.status(200).json({result:result});

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