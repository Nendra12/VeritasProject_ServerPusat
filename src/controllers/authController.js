'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../../models');

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: true, message: 'Username dan password wajib diisi' });
    }

    try {
      const admin = await Admin.findOne({ where: { username } });
      if (!admin) {
        return res.status(401).json({ error: true, message: 'Username atau password salah' });
      }

      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) {
        return res.status(401).json({ error: true, message: 'Username atau password salah' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        error: false,
        message: 'Login berhasil',
        data: {
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            nama: admin.nama,
            role: admin.role,
          },
        },
      });
    } catch (err) {
      console.error('[AUTH LOGIN ERROR]', err);
      return res.status(500).json({ error: true, message: 'Server error' });
    }
  },
};
