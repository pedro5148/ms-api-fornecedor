import express from 'express'
import * as viewController from '../controllers/viewController.js'
const router = express.Router()

router.get('/', viewController.getHome);
router.get('/sobre', viewController.getSobre);
router.get('/suporte', viewController.getSuporte);
router.get('/termos', viewController.getTermos);
router.get('/contato', viewController.getContato);

export default router;