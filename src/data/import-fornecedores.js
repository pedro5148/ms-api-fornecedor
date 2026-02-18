import fs from 'fs';
import { FornecedorService } from './../service/fornecedorService.js';
import connectToDatabase from '../dao/db.js'; 

const fornecService = new FornecedorService();

// Lê o arquivo JSON
const fornecedores = JSON.parse(
    fs.readFileSync('/app/data/fornecedores.json', 'utf-8')
);

const importData = async () => {
    try {
        await connectToDatabase();
        console.log('📦 Conectado ao MySQL. Iniciando importação...');

        for (const item of fornecedores) {
            await fornecService.create(item);
        }
        
        console.log('✅ Dados carregados com sucesso!');
    } catch (err) {
        console.error('❌ Erro na importação:', err.message);
    }
    process.exit();
};

const deleteFornec = async () => {
    try {
        await connectToDatabase();
        console.log('🔥 Conectado ao MySQL. Apagando dados...');
        await fornecService.deleteMany({});
        console.log('✅ Dados apagados com sucesso!');
    } catch (err) {
        console.error('❌ Erro ao apagar:', err.message);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteFornec();
}