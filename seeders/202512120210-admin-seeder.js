'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface) {
    const exists = await queryInterface.rawSelect('Admins', {
      where: { username: 'admin' },
    }, ['id']);

    if (!exists) {
      const passwordHash = bcrypt.hashSync('admin123', 10);
      await queryInterface.bulkInsert('Admins', [
        {
          id: require('uuid').v4(),
          username: 'admin',
          password_hash: passwordHash,
          nama: 'Administrator',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Admins', { username: 'admin' });
  }
};
