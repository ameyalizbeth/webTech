const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const sempoints = sequelize.define('sempoints',{
    
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull:false,
        

    },
    sem: {
        type:Sequelize.STRING

    },
    point: {
        type:Sequelize.INTEGER,
        allowNull:false

    },
    
});

module.exports=sempoints;