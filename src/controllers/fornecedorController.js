import { FornecedorService } from '../service/fornecedorService.js';
const fornecedorService = new FornecedorService();
import catchAsync from './../utils/catchAsync.js'
import appErro from './../utils/appError.js'

//Route Handlers
export const getAllFornec = catchAsync(async (req, res) => {

    console.log('Filtros da requisicao:', req.query) //testando filtros
    const fornec = await fornecedorService.findAll(req.query);
    res.status(200).json({ 
        status: 'sucess',
        requestdAt: req.requestTime,
        results: fornec.length, 
        data: {
            fornec
        } 
    })
});

export const getFornecbyId = catchAsync(async (req, res, next) => {
    
    const fornecedor = await fornecedorService.findById(req.params.id);
    
    if (!fornecedor) { 
        return next(new appErro('Nenhum fornecedor encontrado com esse ID', 404));
    }

    res.status(200).json({ 
        status: 'sucess', 
        requestdAt: req.requestTime,
        data: { fornecedor }
    });
});

export const createFornec = catchAsync(async (req, res, next) => {

        const newFornec = await fornecedorService.create(req.body);

        res.status(201).json({
            status: 'sucess', 
            requestdAt: req.requestTime,
            data: {
                fornecedor: newFornec
            }
        })      
});

export const updateFornec = catchAsync(async (req, res, next) => { 
        const updateFornec = await fornecedorService.update(req.params.id, req.body)

        if (!updateFornec) { 
            return next(new appErro('Nenhum fornecedor encontrado com esse ID', 404)) 
        }

        res.status(204).json({ 
            status: 'sucess',
            requestdAt: req.requestTime, 
            data: {
                updateFornec
            } 
        });    
});

export const deleteFornec = catchAsync(async (req, res, next) => {
        const deleteFornec = await fornecedorService.delete(req.params.id); // nao devolver nada para o cliente (RESTFUL)

        if (!deleteFornec) { return next(new appErro('Nenhum fornecedor encontrado com esse ID', 404)) }

        res.status(204).json({ 
            status: 'sucess',
            data: null
        });    
});