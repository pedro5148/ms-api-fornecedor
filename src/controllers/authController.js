import { UserService } from '../service/userService.js'
import catchAsync from './../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Email from '../utils/email.js'
import dotenv from 'dotenv'
import crypto from 'crypto';

dotenv.config();
const userService = new UserService();

const tokenCriado = (user, statusCode, res) => {
    const token = userService.generateAuthToken(user.id); 
    const userResponse = user.get({ plain: true });

    delete userResponse.pwd;
    delete userResponse.pwdC;
    delete userResponse.resetToken;
    delete userResponse.resetExpirou;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: userResponse
        }
    });
}

const signup = catchAsync(async (req, res, next) => {

    if (req.body.pwd !== req.body.pwdC) {
        return next(new AppError('As senhas não coincidem', 400));
    }

    const { nome, email, pwd } = req.body;

    const newUser = await userService.create({
        nome,
        email,
        pwd
    });

    tokenCriado(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        return next(new AppError('Informe um email e senha', 400));
    }

    const user = await userService.validateUser(email, pwd);

    if (!user) {
        return next(new AppError('Email ou senhas incorretos', 401))
    }
    
    tokenCriado(user, 200, res);
});

const getAllUsers = catchAsync(async(req, res, next) => {
    const users = await userService.findAll();
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

const deleteUsers = catchAsync(async(req, res, next) => {
    await userService.deleteMany();

    res.status(200).json({
        status: 'success',
        message: 'Todos os usuários foram deletados.',
        data: {}
    })
})

const esqueciSenha = catchAsync(async(req, res, next) => {
    const user = await userService.findByEmail(req.body.email)
    if (!user) {
        return next(
            new AppError('Não existe usuário com esse email, verifique', 404)
        );
    }

    const resetToken = await userService.resetarSenha(user)

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetarSenha/${resetToken}`
    const mensagem = `Esqueceu sua senha? Redefina no endereço:\n ${resetUrl} \n(Válido por 10 min).`

    try {
        await Email.enviaEmail({
            email: user.email,
            subject: 'Recuperação de Senha (Válido por 10 min)',
            mensagem
        })
    
        res.status(200).json({
            status: 'success',
            message: 'Token enviado para o email!'
        })    
    } catch (error) {
        await userService.clearResetToken(user.id);
        return next(new AppError('Erro ao enviar o email. Tente novamente.', 500));
    }
});

const resetarSenha = catchAsync(async(req, res, next) => {
    const tokenRecebido = req.params.token;
    const { pwd, pwdC } = req.body;

    if (pwd !== pwdC) {
        return next(new AppError('As senhas não coincidem. Por favor, tente novamente.', 400));
    }

    const hashedToken = crypto
        .createHash('sha256')
        .update(tokenRecebido)
        .digest('hex');

    const user = await userService.findByResetToken(hashedToken);

    if (!user) {
        return next(new AppError('Token inválido ou expirado', 400));
    }

    user.pwd = req.body.pwd;
    user.resetToken = null;
    user.resetExpirou = null;

    await user.save();

    tokenCriado(user, 200, res);
});

const atualizarSenha = catchAsync(async(req, res, next) => {
    const { senhaAtual, novaPwd, novaPwdC } = req.body;

    if (novaPwd !== novaPwdC) {
        return next(new AppError('As novas senhas não coincidem', 400));
    }

    const userAtualizado = await userService.updatePassword(
        req.user.id, 
        senhaAtual, 
        novaPwd, 
        novaPwdC
    );

    tokenCriado(userAtualizado, 200, res);
});

export default { signup, login, getAllUsers, deleteUsers, esqueciSenha, resetarSenha, atualizarSenha}