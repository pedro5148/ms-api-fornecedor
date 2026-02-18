import User from '../modal/userModal.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import AppError from '../utils/appError.js';

dotenv.config();

export class UserService {

    async findAll(options = {}) {
        return await User.findAll({ where: options });
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findByEmailWithPassword(email) {
        return await User.findOne({ where: { email } });
    }

    async create(data) {
        return await User.create(data);
    }

    async update(id, data) {
        // MySQL não suporta { returning: true }, então fazemos em 2 passos:
        // 1. Atualiza
        const [updatedRows] = await User.update(data, {
            where: { id },
            individualHooks: true // Importante para rodar o hook de hash de senha se ela for alterada
        });

        // 2. Se atualizou algo, busca e retorna o objeto novo
        if (updatedRows > 0) {
            return await User.findByPk(id);
        }
        return null;
    }

    async delete(id) {
        return await User.destroy({ where: { id } });
    }
    
    async deleteMany(criteria = {}) {
        // Cuidado: criteria vazio {} apaga a tabela inteira
        return await User.destroy({ where: criteria });
    }

    async validateUser(email, password) {
        const user = await User.findOne({ where: { email } });
        
        // Verificar se o usuário existe e se a senha está correta
        // user.pwd está disponível aqui
        if (!user || !(await user.correctPassword(password, user.pwd))) {
            return null;
        }
        
        return user;
    }

    generateAuthToken(userId) {
        return jwt.sign(
            { id: userId }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }
    
    async verifyAuthToken(token) {
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw error;
        }
    }

    async changedPasswordAfterToken(user, jwtTimestamp) {
        if (user.changedPasswordAfter) {
            return user.changedPasswordAfter(jwtTimestamp);
        }
        return false;
    }

    async resetarSenha(user) {
        // O método createPasswordResetToken foi definido no userModal.js
        const resetToken = user.createPasswordResetToken(); 

        // validate: false evita validar campos obrigatórios (como nome) se eles não estiverem presentes, 
        // mas aqui estamos salvando a instância inteira, então geralmente o Sequelize valida.
        // Se der erro de validação, podemos usar { hooks: false } ou garantir que os dados estão integros.
        await user.save({ validate: false });
        return resetToken;
    }

    async clearResetToken(userId) {
        // Atualiza os campos para null
        return await this.update(userId, {
            resetToken: null,
            resetExpirou: null
        });
    }

    async findByResetToken(hashedToken) {
        return await User.findOne({ 
            where: { 
                resetToken: hashedToken, 
                // Verifica se a data de expiração é MAIOR (gt) que agora
                resetExpirou: { [Op.gt]: new Date() } 
            } 
        });
    }

    async updatePassword(userId, senhaAtual, novaSenha, novaSenhaC) {
        
        const user = await User.findByPk(userId);

        if (!user) {
            throw new AppError('Usuário não encontrado.', 404);
        }

        // 2. Verificar se a senha atual está correta
        // (Assumindo que você criou o método correctPassword no Model)
        if (!(await user.correctPassword(senhaAtual, user.pwd))) {
            throw new AppError('Sua senha atual está incorreta.', 401);
        }

        // 3. Atualizar
        user.pwd = novaSenha;
        user.pwdC = novaSenhaC;
        
        // AQUI NÃO USAMOS { validate: false }!
        // Queremos que o model valide se a nova senha é forte, tem caracteres suficientes, etc.
        await user.save();

        // 4. Gerar novo token
        //const token = this.generateAuthToken(user.id);

        return user;
    };

    async updateUserData(userId, data) {
        // 1. Buscar o usuário pelo ID
        const user = await User.findByPk(userId);

        if (!user) {
            throw new AppError('Usuário não encontrado.', 404);
        }

        // 2. Atualizar os campos
        // O método set do Sequelize atualiza apenas os campos passados no objeto 'data'
        user.set(data);

        // 3. Salvar
        // Aqui usamos validate: true para garantir que o email seja válido, por exemplo.
        // O Sequelize é inteligente e só salva se houver mudanças reais.
        await user.save();

        return user;
    }

    async softDeleteUser(userId) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new AppError('Usuário não encontrado.', 404);
        }

        user.ativo = false;
        
        await user.save();
    }
}