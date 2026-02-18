import Fornecedor from '../modal/fornecModal.js'; // Importa o model Sequelize
import { APIFeatures } from '../utils/apiFeatures.js';

export class FornecedorService {
    
    async findAll(queryString) {

        const features = new APIFeatures(queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate(); 

        return await Fornecedor.findAll(features.options);
    }

    async findById(id) {
        return await Fornecedor.findByPk(id);
    }

    async create(data) {
        return await Fornecedor.create(data);
    }

    async update(id, data) {
        const [updatedRows] = await Fornecedor.update(data, {
            where: { id: id },
            individualHooks: true 
        });

        if (updatedRows === 0) return null;

        return await Fornecedor.findByPk(id);
    }

    async delete(id) {
        const deletedRows = await Fornecedor.destroy({
            where: { id: id }
        });
        
        return deletedRows;
    }
    
    async deleteMany(criteria = {}) {
        
        return await Fornecedor.destroy({
            where: criteria,
            truncate: false 
        });
    }
}