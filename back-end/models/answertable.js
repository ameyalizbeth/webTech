const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const answertable = sequelize.define('answertable',{
    
    answerid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    answer: {
        type:Sequelize.TEXT('long'),
        allowNull:false

    },
    votes: {
        type:Sequelize.INTEGER,
        
    },
    
});

module.exports=answertable;