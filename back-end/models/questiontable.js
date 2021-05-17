const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const questiontable = sequelize.define('questiontable',{
    
    questionid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    question: {
        type:Sequelize.TEXT('long'),
        allowNull:false

    },
    category: {
        type:Sequelize.STRING,
        allowNull:false

    },
    
});

module.exports=questiontable;