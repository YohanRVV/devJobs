const express = require('express')
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');



module.exports = () => {
    router.get('/', homeController.mostrarTrabajos)

    //Crear Vacantes
    router.get('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.agregarVacante);

    //Mostrar cada vacante
    router.get('/vacantes/:url',
        vacantesController.mostrarVacante)


    //Editar Vacante
    router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante);

    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.editarVacante)

    //Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id',
        vacantesController.eliminarVacante
        )

    //crear cuentas
    router.get('/crear-cuenta',
        usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
        usuariosController.validarRegistro,
        usuariosController.crearUsuario);

    //Autenticar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    //Resetear password
    router.get('/restablecer-password', authController.formRestablecerPassword)
    router.post('/restablecer-password', authController.enviarToken)

    //Resetear Password (Almacenar en La BD)
    router.get('/restablecer-password/:token',
        authController.restablecerPassword
    )
    router.post('/restablecer-password/:token',
        authController.guardarPassword
    )

    //Cerrar Sesion
    router.get('/cerrar-sesion',
        authController.verificarUsuario,
        authController.cerrarSesion
    )

    //Panel Administracion
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel)


    //Editar Perfil
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil)

    router.post('/editar-perfil',
        authController.verificarUsuario,
        // usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil)

    //Recibir mensajes de candidatos
    router.post('/vacantes/:url', 
        vacantesController.subirCV,
        vacantesController.contactar
        )

    //Muestra los candidatos por vacante
    router.get('/candidatos/:id', 
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos
    )

    //Buscador de Vacantes
    router.post('/buscador', vacantesController.buscarVacantes)

    return router;
}

