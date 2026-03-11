// ============================================================================
// 1. IMPORTAÇÕES (Agrupadas por categoria)
// ============================================================================
// 1.1. Módulos Core do Node e Express
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// 1.2. Middlewares de Terceiros (Segurança, Logs, Utilitários)
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

// 1.3. Módulos Locais (Rotas e Controladores de Erro)
import appError from './utils/appError.js';
import globalErro from './controllers/errorController.js';
import fornecRoute from './routes/fornecRoutes.js';
import userRoute from './routes/userRoutes.js';
import viewRoute from './routes/viewRoutes.js';

// ============================================================================
// 2. CONFIGURAÇÕES INICIAIS DA APLICAÇÃO
// ============================================================================
const app = express();

// Configuração de caminhos absolutos (Módulos ES)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Template Engine (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// 3. MIDDLEWARES GLOBAIS (Ordem de execução rigorosa)
// ============================================================================
// 3.1. Segurança HTTP (Deve ser o primeiro a tocar na requisição)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:"],
            scriptSrc: ["'self'"],
            upgradeInsecureRequests: null 
        }
    }
}));

// 3.2. Logs de Desenvolvimento
app.use(morgan('dev'));

// 3.3. Limite de Requisições (Rate Limiting aplicado apenas às rotas da API)
const limiter = rateLimit({
    max: 100, 
    windowMs: 60 * 60 * 1000, 
    message: 'Muitas requisições feitas a partir deste IP, tente novamente mais tarde'
});
app.use('/api', limiter);

// 3.4. Parser do Body (Lê os dados recebidos antes de os higienizar)
app.use(express.json({ limit: '10kb' }));

// 3.5. Sanitização de Dados (Requer o express.json já executado)
app.use(xss()); 
app.use(hpp({
    whitelist: ['nome', 'email'] 
}));

// 3.6. Ficheiros Estáticos (Devolve imagens/CSS antes de processar lógicas complexas)
app.use(express.static(path.join(__dirname, 'public')));

// 3.7. Middlewares Customizados
app.use((req, res, next) => {
    req.requestTime = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    next();
});

// ============================================================================
// 4. ROTAS
// ============================================================================

// Rotas da API (Backend)
app.use('/', viewRoute);
app.use('/api/v1/fornecedores', fornecRoute);
app.use('/api/v1/users', userRoute);

// ============================================================================
// 5. TRATAMENTO DE ERROS
// ============================================================================
// Captura todas as rotas não mapeadas (404)
app.all('*', (req, res, next) => {
    next(new appError(`Não foi possível encontrar a página ${req.originalUrl}`, 404));
});

// Middleware Global de Tratamento de Erros
app.use(globalErro);

// ============================================================================
// 6. EXPORTAÇÃO
// ============================================================================
export default app;