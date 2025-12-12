'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LembagaPeradilan', 'kode_lembaga', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('LembagaPeradilan', 'alamat', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('LembagaPeradilan', 'telepon', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('LembagaPeradilan', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('LembagaPeradilan', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('LembagaPeradilan', 'kode_lembaga');
    await queryInterface.removeColumn('LembagaPeradilan', 'alamat');
    await queryInterface.removeColumn('LembagaPeradilan', 'telepon');
    await queryInterface.removeColumn('LembagaPeradilan', 'email');
    await queryInterface.removeColumn('LembagaPeradilan', 'website');
  },
};
