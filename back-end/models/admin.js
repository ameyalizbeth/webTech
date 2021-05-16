const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const admin = sequelize.define('admin',{
    
    // id: {
    //     type: Sequelize.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    // },
    username: {
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
        

    },
    // password: {
    //     type:Sequelize.STRING,
    //     allowNull:false
    // },
    // email: {
    //     type:Sequelize.STRING

    // },
    // // name: {
    // //     type:Sequelize.STRING,
    // //     allowNull:false
    // // },
    // address: {
    //     type:Sequelize.STRING,
    //     allowNull:false
    // },
    // phoneno: {
    //     type:Sequelize.STRING,
    //     allowNull:false

    // },
    // // image: {
    // //     type:Sequelize.STRING,
    
    // // }
});

module.exports=admin;