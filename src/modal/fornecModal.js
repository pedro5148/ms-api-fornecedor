import { DataTypes } from 'sequelize';
import { sequelize } from '../dao/db.js';
import slugify from 'slugify';

const Fornecedor = sequelize.define('Fornecedor', {
  
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Um fornecedor deve ter um nome' }
    },
    set(value) {
      this.setDataValue('nome', value.trim());
    }
  },
  nomeLower: {
    type: DataTypes.STRING,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Informe um CNPJ valido' }
    }
  },
  telefone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: { msg: 'Informe um email válido!' } 
    }
  },
  endereco: {
    type: DataTypes.STRING,
  },
  produtos: {
    type: DataTypes.JSON, 
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    defaultValue: 'ativo'
  },
  privado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'fornecedores',
  timestamps: true, 
  createdAt: 'dataCriacao', 
  updatedAt: false, 
  
  hooks: {
    beforeSave: (fornecedor) => {
      if (fornecedor.nome) {
        fornecedor.nomeLower = slugify(fornecedor.nome, { lower: true });
      }
    }
  },
  
  defaultScope: {
    where: {
      privado: false
    }
  }
});


Fornecedor.prototype.getDuracaoSemana = function() {
  return (this.duration || 0) / 7; 
};

export default Fornecedor;