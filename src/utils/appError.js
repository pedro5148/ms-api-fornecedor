//padroniza os erros operacionais (erros conhecidos e esperados)

export class AppErro extends Error {
    constructor (message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppErro