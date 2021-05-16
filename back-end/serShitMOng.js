import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors'
import Level from './dbLevel.js';
// import Images from './Imagedb.js';
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';


//App config

const app = express();
const port = process.env.PORT || 8001;
const connection_url = "mongodb+srv://adminasd:asdproject@cluster0.2qbxz.mongodb.net/asddb?retryWrites=true&w=majority";
const upload = multer({dest: "./uploads/"});

//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(Cors());
app.use("/static", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));


//DB config
mongoose.connect(connection_url, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
});
//API end points

app.get('/', (req, res) => res.status(200).send("Welcome to ASD backend"));


// app.post("/api/card", (req,res) => {
//     const dbCard = req.body;

//     Cards.create(dbCard, (err, data) => {
//         if(err){
//             res.status(500).send(err);
//         }else {
//             res.status(201).send(data);
//         }
//     });
// });

// app.get("/api/card", (req,res) => {

//     Cards.find( (err, data) => {
//         if(err){
//             res.status(500).send(err);
//         }else {
//             res.status(200).send(data);
//         }
//     });
// });

app.post("/api/level", (req,res) => {
    const dbLevel = req.body;

    Level.create(dbLevel, (err, data) => {
        if(err){
            res.status(500).send(err);
        }else {
            res.status(201).send(data);
        }
    });
    res.send("200");
});

app.get("/api/level", (req,res) => {

    Level.find( (err, data) => {
        if(err){
            res.status(500).send(err);
        }else {
            res.status(200).send(data);
        }
    });
    
});

app.post('/uploadFile', upload.single('avatar'), (req,res ) => {

    let fileType = req.file.mimetype.split('/')[1];
    let newFileName = req.file.filename + '.' + fileType;
    fs.rename(`./uploads/${req.file.filename}`,`./uploads/${newFileName}`, function(){
        console.log("call back");

        Images.create(req.body, (err, data) =>{
            if(err){
                res.status(500).send(err);
            }else {
                res.status(200).send(data);
            }
        });
        res.send("200");
    });
    console.log(newFileName);

    
});


//listener
app.listen(port, () => console.log('listening on :8001'));