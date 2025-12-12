'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('SinkronisasiLog', 'id_putusan_daerah', {
      type: Sequelize.UUID,
      allowNull: true,
      comment: 'ID putusan dari ServerDaerah untuk tracking dan resync',
    });

    await queryInterface.addColumn('SinkronisasiLog', 'id_putusan_pusat', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'PutusanPusat',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'ID putusan di ServerPusat hasil sinkronisasi',
    });

    await queryInterface.addColumn('SinkronisasiLog', 'tipe_operasi', {
      type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE'),
      allowNull: true,
      comment: 'Tipe operasi sinkronisasi',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('SinkronisasiLog', 'tipe_operasi');
    await queryInterface.removeColumn('SinkronisasiLog', 'id_putusan_pusat');
    await queryInterface.removeColumn('SinkronisasiLog', 'id_putusan_daerah');
  },
};
