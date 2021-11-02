const knex = require('../config/knex');

module.exports = {
    async all (req, res, next) {
        const alerts = await knex('alerts');
        const ids = alerts.map(data => data.mod_id);
        const user = await knex('users').whereIn('id', ids);
    
        alerts.map((data) => {
            data.mod = user.filter(u => u.id = data.mod_id);
            delete data.mod_id;
        });
        return res.json(alerts);
    },

    async create (req, res, next) {
        const mod = req.moderatorToken;
        const params = req.body;
        params.mod_id = mod.id;
        if (!Object.keys(params).includes('description')) return res.status(401).json({ message: 'Está faltando a descrição do alerta.' });
        await knex('alerts').insert(params);
        return res.status(201).send();
    },

    async update (req, res, next) {
        const params = req.body;
        const { id } = req.params;
        await knex('alerts').update(params).where({ id });
        return res.status(200).send();
    },

    async delete (req, res, next) {
        const { id } = req.params;
        await knex('alerts').where({ id }).delete();
        return res.status(200).send();
    },
};