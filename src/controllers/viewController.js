import catchAsync from './../utils/catchAsync.js'
import { FornecedorService } from '../service/fornecedorService.js';
const fornecedorService = new FornecedorService();
import appErro from './../utils/appError.js'

export const getHome = catchAsync(async (req, res, next) => {

    const fornecedores = await fornecedorService.findAll(req.query);
    
    res.status(200).render('index', { 
        title: 'Lista de Fornecedores', 
        fornecedores 
    });
});

export const getSobre = catchAsync(async (req, res, next) => {
    res.status(200).render('sobre', { title: 'Sobre a GranSystem' });
});

export const getSuporte = catchAsync(async (req, res, next) => {
    res.status(200).render('suporte', { title: 'Suporte' });
});

export const getTermos = catchAsync(async (req, res, next) => {
    res.status(200).render('termos', { title: 'Termos de Uso' });
});

export const getContato = catchAsync(async (req, res, next) => {
    res.status(200).render('contato', { title: 'Contato' });
});