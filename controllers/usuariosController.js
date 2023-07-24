const mongoose = require('mongoose')
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
    upload(req, res, function (error) {

        if (error) {
            if (error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El Archivo es muy Grande: Máximo 100kb');
                }else{
                    req.flash('error', error.message)
                }
            }else{
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        }else{
            return next();
        }
    });
}

//Opciones de Multer
const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/perfiles')
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //Callback se ejecuta como true o false, true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido', false));
        }
    },
}

const upload = multer(configuracionMulter).single('imagen');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu Nueva Cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}




exports.validarRegistro = (req, res, next) => {

    //sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    //Validar
    req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();
    req.checkBody('email', 'El Email debe ser válido').isEmail();
    req.checkBody('password', 'El Password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'Confirmar Password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'El Password es diferente').equals(req.body.password);
    const errores = req.validationErrors();

    if (errores) {
        //Si hay errores
        req.flash('error', errores.map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crear tu Cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        });
        return;
    }
    //Si toda la validacion es correcta
    next()
}


exports.crearUsuario = async (req, res, next) => {
    //Crear el Usuario
    const usuario = new Usuarios(req.body);
    try {
        await usuario.save()
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error)
        res.redirect('/crear-cuenta');
    }
}


//Formulario para iniciar Sesión
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs',

    })
}

//Form Editar el Perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu Perfil en devJobs',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen:req.user.imagen,
        usuario: req.user.toObject()

    })
}


//Guardar Cambios Editar Perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if (req.body.password) {
        usuario.password = req.body.password
    }

    if (req.file) {
        usuario.imagen = req.file.filename;
    }

    await usuario.save();

    req.flash('correcto', 'Cambios Guardados Correctamente');

    //Redirect
    res.redirect('/administracion');
}

//Sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    //sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if (req.body.password) {
        req.sanitizeBody('password').escape();
    }

    //validar
    req.checkBody('nombre', 'El Nombre no puede ir vacío').notEmpty();
    req.checkBody('email', 'El Email no puede ir vacío').notEmpty();

    const errores = req.validationErrors();
    if (errores) {
        req.flash('error', errores.map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Edita tu Perfil en devJobs',
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen:req.user.imagen,
            usuario: req.user.toObject(),
            mensajes: req.flash()
        })
        return;
    }
    next();
}