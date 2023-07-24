const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true})

mongoose.connection.on('error', (error)=>{
    console.log(error);
})

//Importar los modelos

require('../models/Vacantes');
require('../models/Usuarios');
