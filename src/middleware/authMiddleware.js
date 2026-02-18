import { UserService } from '../service/userService.js'
import catchAsync from './../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import dotenv from 'dotenv'

dotenv.config();
const userService = new UserService();

const protect = catchAsync(async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('Você não está logado! Por favor, faça login para ter acesso.', 401)
        );
    }

    const decoded = await userService.verifyAuthToken(token);

    const currentUser = await userService.findById(decoded.id)
    if (!currentUser) {
        return next(
            new AppError('O usuário pertencente a este token não existe mais.', 401)
        );
    }

    if (await userService.changedPasswordAfterToken(currentUser, decoded.iat)) {
        return next(
            new AppError('Usuário alterou a senha recentemente. Por favor, faça login novamente.', 401)
        );
    }

    // ACESSO PERMITIDO
    req.user = currentUser;
    next()
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Você não tem permissão para realizar esta ação', 403)
            )
        }
        next()
    }
}

export default { protect, restrictTo }