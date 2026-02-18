import { DataTypes } from 'sequelize';
import { sequelize } from '../dao/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Um usuário precisa ter um nome' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Informe um email válido!' }
        }
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'supervisor'),
        defaultValue: 'user'
    },
    pwd: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: { args: [4, 100], msg: 'A senha deve ter no mínimo 4 caracteres' }
        }
    },
    alterouSenha: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetExpirou: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        select: false
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        
        beforeCreate: async (user) => {
            if (user.pwd) {
                user.pwd = await bcrypt.hash(user.pwd, 12);
            }
            user.pwdC = undefined; 
        },
        
        beforeUpdate: async (user) => {
            if (user.changed('pwd')) {
                user.pwd = await bcrypt.hash(user.pwd, 12);
                user.alterouSenha = new Date();
            }
        }
    }
});

// Checar senha (Login)
User.prototype.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Checar se mudou senha depois do token
User.prototype.changedPasswordAfter = function(JWTTimestamp) {
    if (this.alterouSenha) {
        const changedTimestamp = parseInt(this.alterouSenha.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Gerar token de reset
User.prototype.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetExpirou = Date.now() + 10 * 60 * 1000; // 10 minutos

    return resetToken;
};

User.prototype.toJSON = function () {
    
    const values = Object.assign({}, this.get());

    delete values.pwd;
    delete values.pwdC;
    delete values.resetToken;
    delete values.resetExpirou;
    delete values.alterouSenha;

    return values;
};

User.addHook('beforeFind', (options) => {

    if (options.where && options.where.ativo !== undefined) {
        return;
    }

    if (!options.where) options.where = {};
    options.where.ativo = true;
});

export default User;