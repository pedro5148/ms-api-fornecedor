import { Op } from 'sequelize';

export class APIFeatures {
    constructor(queryString) {
        this.queryString = queryString;
        this.options = { where: {}, order: [] };
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        const operatorsMap = {
            gte: Op.gte,
            gt: Op.gt,
            lte: Op.lte,
            lt: Op.lt,
            ne: Op.ne,
            eq: Op.eq,
            like: Op.like
        };

        const replaceOperators = (obj) => {
            const newObj = {};
            
            for (const key in obj) {
                const value = obj[key];

                if (operatorsMap[key]) {
                    newObj[operatorsMap[key]] = value;
                } 

                else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    newObj[key] = replaceOperators(value);
                } 
                else {
                    newObj[key] = value;
                }
            }
            return newObj;
        };

        // Aplica a substituição apenas se houver filtros
        if (Object.keys(queryObj).length > 0) {
            this.options.where = replaceOperators(queryObj);
        }

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').map(field => {
                if (field.startsWith('-')) {
                    return [field.substring(1), 'DESC'];
                }
                return [field, 'ASC'];
            });
            this.options.order = sortBy;
        } else {
            this.options.order = [['dataCriacao', 'DESC']]; 
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',');
            this.options.attributes = fields;
        }
        return this;
    }
    
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const offset = (page - 1) * limit;

        this.options.limit = limit;
        this.options.offset = offset;
        
        return this;
    }
}