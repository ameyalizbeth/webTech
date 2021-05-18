const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const user = sequelize.define('user',{
    
    userid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        unique:true
       
    },
    
    fullname: {
        type:Sequelize.STRING,
        allowNull:false
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false
    },
    email: {
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey: true

    },
   department: {
        type:Sequelize.STRING,
       
    },
    
    image: {
        type:Sequelize.STRING,
    
    }
});

module.exports=user;