import express from 'express'
const app = express()
import morgan from 'morgan'
import path from 'path'

// Controller
import fornecRoute from './routes/fornecRoutes.js';
import appError from './utils/appError.js';
import globalErro from './controllers/errorController.js'
import userRoute from './routes/userRoutes.js'

//Middleware
app.use(morgan('dev')) //retorna o cabecalho das requisicoes
app.use(express.json()) // Content-Type: application/json
app.use((req, res, next) => {
    //req.requestTime = new Date().toISOString(); //retorna o horario da req
    req.requestTime = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    //console.log(req.headers);
    next();
});

const __dirname = path.resolve();
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

//Rotas
app.use('/api/v1/fornecedores', fornecRoute);
app.use('/api/v1/users', userRoute);

// app.get('/', (req, res) => {});
app.all('*', (req, res, next) => {
    next(new appError(`Nao foi possivel encontrar a pagina ${req.originalUrl}`)); //Lanca o erro para o proximo middleware
});

app.use(globalErro)

export default app;