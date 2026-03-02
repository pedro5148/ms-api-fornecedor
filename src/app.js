import express from 'express'
const app = express()
import morgan from 'morgan'
import path from 'path'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean'
import hpp from 'hpp'

// Controller
import fornecRoute from './routes/fornecRoutes.js';
import appError from './utils/appError.js';
import globalErro from './controllers/errorController.js'
import userRoute from './routes/userRoutes.js'

//Middleware
app.use(morgan('dev')) //retorna o cabecalho das requisicoes
app.use(express.json({ limit: '10kb' })) // Content-Type: application/json

app.set('view engine', 'pug'); //configura o pug como template engine
const __dirname = path.resolve();
app.set('views', path.join(__dirname, 'views')); //configura o caminho das views
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    //req.requestTime = new Date().toISOString(); //retorna o horario da req
    req.requestTime = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    //console.log(req.headers);
    next();
});
const limiter = rateLimit({
    max: 100, //limite de 100 requisicoes por IP
    windowMs: 60 * 60 * 1000, //1 hora
    message: 'Muitas requisicoes feitas a partir deste IP, tente novamente mais tarde'
});
app.use('/api', limiter); //aplica o limitador para todas as rotas que comecam com /api
app.use(helmet()) //ajuda a proteger a aplicacao de algumas vulnerabilidades, configurando os cabecalhos HTTP
app.use(xss()) //ajuda a proteger a aplicacao de XSS attacks
app.use(hpp(
    {whitelist: ['nome', 'email'] //parametros que podem ser repetidos na query string
    }
)) //ajuda a proteger a aplicacao de HTTP Parameter Pollution attacks

//const staticPath = path.join(__dirname, 'public');
//app.use(express.static(staticPath));

//Rotas
app.get('/', (req, res) => {
    res.status(200).render('base');
});

app.use('/api/v1/fornecedores', fornecRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
    next(new appError(`Nao foi possivel encontrar a pagina ${req.originalUrl}`)); //Lanca o erro para o proximo middleware
});

app.use(globalErro)

export default app;