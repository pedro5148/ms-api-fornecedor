import connectToDatabase from '../dao/db.js'
import dotenv from 'dotenv'
import app from '../app.js'

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 

const startServer = async () => {
    try {
        
        console.log('Iniciando conexão com o banco...');
        await connectToDatabase();

        app.listen(PORT, HOST, () => {
            console.log(`🚀 Servidor rodando e ouvindo em http://${HOST}:${PORT}`);
        });
        
    } catch (error) {
        console.error('Falha fatal ao iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();