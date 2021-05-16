const express= require('express');
const fs= require('fs');
const path= require('path');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');

const sequelize = require('./util/database');
const user = require('./models/user');
const app = express();
// const jwt = require('jsonwebtoken');

const multer = require('multer');

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
app.use(bodyparser.json());

app.use('/images',express.static(path.join(__dirname,'images')));

app.use('/certi',multer({storage:Storagecerti,fileFilter:fileFiltercerti}).single('certificatedata'));
app.use('/certificates',express.static(path.join(__dirname,'certificates')));

app.use(multer({storage:filestorage,fileFilter:fileFilter}).single('data'));
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");

    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();

});

app.post('/signup',(req,res,next)=>{
    user.create({name:req.body.name,email:req.body.email,username:req.body.username,password:req.body.password,address:req.body.address,phoneno:req.body.phoneno,}).then(r=>res.status(200).json({message:"signup succesfull"})).catch(err=>{
        err.statusCode = 403;
        err.message = "username already registered choose another";
        next(err);
      });

});
app.post('/login',(req,res)=>{
    user.findByPk(req.body.username).then(user=>
        {
           
            if(user){
           if(user.password ===req.body.password){

              
               
             res.status(200).json({message:'succesfull'});

           }
        else{
            res.status(401).send({status:401});
        }}
        else{
       res.status(404).send({status:404});
        }
    }).catch(err=>console.log(err))
   

});
app.get('/:username/page',(req,res,next)=>{
    user.findByPk(req.params.username).then(user=>{
        res.status(200).json({name:user.name,email:user.email,address:user.address,phoneno:user.phoneno,username:user.username,image:user.image});
    }).catch(err=>{console.log(err)})

});

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).send();
    console.log(status);
});

app.post('/:username/images',(req,res)=>{
    user.findByPk(req.params.username).then(user=>{
        const p = user.image;
        console.log(req.file);
        console.log(p);
        user.update({image:req.file.path}).then(r=>{
            res.status(200).json({path:req.file.path});
            if(p){
            fs.unlink(p,function (err){
                if(err) throw err;
                console.log('file deleted');
        })}


        }).catch(err=>console.log(err)) ;
        
       
           
        }
       
       
    ).catch(err=>{console.log(err)})



    console.log(req.file);

});

sequelize.sync().then(r=>{
    // console.log(r);
    app.listen(process.env.PORT || 3000);
}).catch(err=>console.log(err));


