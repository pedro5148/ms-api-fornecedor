import express from 'express'
import authController from '../controllers/authController.js'
import * as userController from '../controllers/userController.js'
import auth from '../middleware/authMiddleware.js'
const router = express.Router()

router
    .route('/')
    .get(auth.protect, authController.getAllUsers)

router
    .route('/signup')
    .post(authController.signup);
    
router
    .route('/login')
    .post(authController.login);


router
    .route('/esqueciSenha')
    .post(authController.esqueciSenha);
router
    .route('/resetarSenha/:token')
    .patch(authController.resetarSenha);

router
    .route('/deleteAll')
    .delete(auth.protect, authController.deleteUsers);

router
    .route('/atualizarSenha')
    .patch(auth.protect, authController.atualizarSenha);

router
    .route('/atualizarUsuario')
    .patch(auth.protect, userController.updateUser)
router
    .route('/deletarUsuario')
    .delete(auth.protect, userController.softDeleteUser);
export default router;