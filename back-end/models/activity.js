const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const activity = sequelize.define('activity',{
    
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull:false,
        // primaryKey:true,
        

    },
    title: {
        type:Sequelize.STRING,
        allowNull:false
    },
    sem: {
        type:Sequelize.STRING

    },
    // name: {
    //     type:Sequelize.STRING,
    //     allowNull:false
    // },
    category: {
        type:Sequelize.STRING,
        allowNull:false
    },
    prize: {
        type:Sequelize.STRING,
        allowNull:false
    },
    level: {
        type:Sequelize.STRING,
        allowNull:false

    },
    point: {
        type:Sequelize.INTEGER,
        allowNull:false

    },
    verify: {
        type:Sequelize.BOOLEAN,
        allowNull:false

    },
    image: {
        type:Sequelize.STRING,
        allowNull:false
    
    }
});

module.exports=activity;