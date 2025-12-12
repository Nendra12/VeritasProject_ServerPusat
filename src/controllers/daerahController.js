'use strict';

const { Daerah, LembagaPeradilan } = require('../../models');

module.exports = {
  getAll: async (_req, res) => {
    try {
      const rows = await Daerah.findAll({
        include: [{ model: LembagaPeradilan, as: 'lembaga_list', attributes: ['id', 'nama_lembaga'] }],
        order: [['nama_daerah', 'ASC']],
      });
      return res.status(200).json({ error: false, message: 'OK', data: rows });
    } catch (err) {
      console.error('[DAERAH][LIST]', err);
      return res.status(500).json({ error: true, message: 'Server error', data: [] });
    }
  },

  getById: async (req, res) => {
    try {
      const row = await Daerah.findByPk(req.params.id, {
        include: [{ model: LembagaPeradilan, as: 'lembaga_list', attributes: ['id', 'nama_lembaga'] }],
      });
      if (!row) return res.status(404).json({ error: true, message: 'Daerah not found', data: null });
      return res.status(200).json({ error: false, message: 'OK', data: row });
    } catch (err) {
      console.error('[DAERAH][DETAIL]', err);
      return res.status(500).json({ error: true, message: 'Server error', data: null });
    }
  },

  create: async (req, res) => {
    try {
      const payload = req.body;
      const row = await Daerah.create(payload);
      return res.status(201).json({ error: false, message: 'Created', data: row });
    } catch (err) {
      console.error('[DAERAH][CREATE]', err);
      return res.status(500).json({ error: true, message: 'Server error', data: null });
    }
  },

  update: async (req, res) => {
    try {
      const row = await Daerah.findByPk(req.params.id);
      if (!row) return res.status(404).json({ error: true, message: 'Daerah not found', data: null });
      await row.update(req.body);
      return res.status(200).json({ error: false, message: 'Updated', data: row });
    } catch (err) {
      console.error('[DAERAH][UPDATE]', err);
      return res.status(500).json({ error: true, message: 'Server error', data: null });
    }
  },

  destroy: async (req, res) => {
    try {
      const row = await Daerah.findByPk(req.params.id);
      if (!row) return res.status(404).json({ error: true, message: 'Daerah not found', data: null });
      await row.destroy();
      return res.status(200).json({ error: false, message: 'Deleted', data: null });
    } catch (err) {
      console.error('[DAERAH][DELETE]', err);
      return res.status(500).json({ error: true, message: 'Server error', data: null });
    }
  },
};
