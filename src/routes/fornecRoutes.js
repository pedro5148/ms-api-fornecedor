import express from 'express'
import * as fornecController from '../controllers/fornecedorController.js'
import auth from '../middleware/authMiddleware.js'

const router = express.Router()

//Middleware para checar o id da requisicao
//router.param('id', fornecController.checkId)

router
    .route('/')
    .get(auth.protect, fornecController.getAllFornec)
    .post(auth.protect, fornecController.createFornec)

router
    .route('/:id')
    .get(auth.protect, fornecController.getFornecbyId)
    .patch(auth.protect, fornecController.updateFornec)
    .delete(auth.protect, fornecController.deleteFornec)

export default router;