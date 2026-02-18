import catchAsync from './../utils/catchAsync.js'
import { UserService } from '../service/userService.js'
const userService = new UserService();
import AppError from '../utils/appError.js';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const getAllUsers = catchAsync(async (req, res, next) => {

    const users = await userService.findAll(req.query);
    res.status(200).json({ 
        status: 'sucess',
        requestdAt: req.requestTime,
        results: fornec.length, 
        data: {
            users
        }
    })
});

export const getUser = (req, res) => {
    res.status(500).json({
        status: 'erro',
        message: 'Essa rota nao foi criada'
    })
}

export const createUser = (req, res) => {
    res.status(500).json({
        status: 'erro',
        message: 'Essa rota nao foi criada'
    })
}

export const updateUser = catchAsync(async (req, res, next) => {
    if (req.body.pwd || req.body.pwdC) {
        return next(new AppError('Essa rota não é para atualizar senha. Por favor, use /atualizarSenha.', 400));
    }

    const filteredBody = filterObj(req.body, 'nome', 'email');

    const updatedUser = await userService.updateUserData(req.user.id, filteredBody);

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

export const softDeleteUser = catchAsync(async (req, res, next) => {
    await userService.softDeleteUser(req.user.id);

    res.status(204).json({
        status: 'success',
        data: {
            user: null
        }
    });
});