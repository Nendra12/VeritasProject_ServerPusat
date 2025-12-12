const { PutusanPusat, LembagaPeradilan, SinkronisasiLog } = require('../../models');

class SyncHandler {
  /**
   * Handle PUTUSAN_CREATED event
   */
  static async handlePutusanCreated(payload) {
    try {
      console.log(`[SYNC] Handling PUTUSAN_CREATED: ${payload.data.id}`);

      // Find lembaga by lembaga_id
      const lembaga = await LembagaPeradilan.findOne({
        where: { kode_lembaga: payload.lembaga_id },
      });

      if (!lembaga) {
        throw new Error(`Lembaga ${payload.lembaga_id} not found`);
      }

      // Check if already exists
      const exists = await PutusanPusat.findOne({
        where: { id_putusan_daerah: payload.data.id },
      });

      if (exists) {
        console.log(`[SYNC] Putusan ${payload.data.id} already exists, skipping...`);
        return;
      }

      // Create new putusan in Pusat
      const putusan = await PutusanPusat.create({
        id_putusan_daerah: payload.data.id,
        nomor_putusan: payload.data.nomor,
        tanggal_putusan: payload.data.tanggal_putusan,
        tanggal_upload: payload.data.tanggal_upload || new Date(),
        id_lembaga: lembaga.id,
        jenis_putusan: payload.data.jenis_putusan,
      });

      // Log success
      await SinkronisasiLog.create({
        id_lembaga: lembaga.id,
        id_putusan_daerah: payload.data.id,
        id_putusan_pusat: putusan.id,
        tipe_operasi: 'CREATE',
        waktu_sync: new Date(),
        status: 'SUCCESS',
        jumlah_data: 1,
        pesan_error: null,
      });

      console.log(`✅ [SYNC] Created putusan: ${putusan.id}`);
    } catch (err) {
      console.error(`❌ [SYNC ERROR] handlePutusanCreated:`, err.message);

      // Log error
      try {
        const lembaga = await LembagaPeradilan.findOne({
          where: { kode_lembaga: payload.lembaga_id },
        });

        if (lembaga) {
          await SinkronisasiLog.create({
            id_lembaga: lembaga.id,
            id_putusan_daerah: payload.data.id,
            id_putusan_pusat: null,
            tipe_operasi: 'CREATE',
            waktu_sync: new Date(),
            status: 'ERROR',
            jumlah_data: 0,
            pesan_error: err.message,
          });
        }
      } catch (logErr) {
        console.error('[LOG ERROR]', logErr);
      }
    }
  }

  /**
   * Handle PUTUSAN_UPDATED event
   */
  static async handlePutusanUpdated(payload) {
    try {
      console.log(`[SYNC] Handling PUTUSAN_UPDATED: ${payload.data.id}`);

      // Find existing putusan
      const putusan = await PutusanPusat.findOne({
        where: { id_putusan_daerah: payload.data.id },
      });

      if (!putusan) {
        console.log(`[SYNC] Putusan ${payload.data.id} not found in Pusat, creating new...`);
        // If not exists, create it (fallback)
        return await this.handlePutusanCreated(payload);
      }

      // Update existing putusan
      await putusan.update({
        nomor_putusan: payload.data.nomor,
        tanggal_putusan: payload.data.tanggal_putusan,
        tanggal_upload: payload.data.tanggal_upload || new Date(),
        jenis_putusan: payload.data.jenis_putusan,
      });

      // Log success
      const lembaga = await LembagaPeradilan.findOne({
        where: { kode_lembaga: payload.lembaga_id },
      });

      if (lembaga) {
        await SinkronisasiLog.create({
          id_lembaga: lembaga.id,
          id_putusan_daerah: payload.data.id,
          id_putusan_pusat: putusan.id,
          tipe_operasi: 'UPDATE',
          waktu_sync: new Date(),
          status: 'SUCCESS',
          jumlah_data: 1,
          pesan_error: null,
        });
      }

      console.log(`✅ [SYNC] Updated putusan: ${putusan.id}`);
    } catch (err) {
      console.error(`❌ [SYNC ERROR] handlePutusanUpdated:`, err.message);

      // Log error
      try {
        const lembaga = await LembagaPeradilan.findOne({
          where: { kode_lembaga: payload.lembaga_id },
        });

        if (lembaga) {
          await SinkronisasiLog.create({
            id_lembaga: lembaga.id,
            id_putusan_daerah: payload.data.id,
            id_putusan_pusat: null,
            tipe_operasi: 'UPDATE',
            waktu_sync: new Date(),
            status: 'ERROR',
            jumlah_data: 0,
            pesan_error: err.message,
          });
        }
      } catch (logErr) {
        console.error('[LOG ERROR]', logErr);
      }
    }
  }

  /**
   * Handle PUTUSAN_DELETED event
   */
  static async handlePutusanDeleted(payload) {
    try {
      console.log(`[SYNC] Handling PUTUSAN_DELETED: ${payload.data.id}`);

      // Find and delete putusan
      const putusan = await PutusanPusat.findOne({
        where: { id_putusan_daerah: payload.data.id },
      });

      if (!putusan) {
        console.log(`[SYNC] Putusan ${payload.data.id} not found in Pusat, skipping delete...`);
        return;
      }

      const putusanId = putusan.id;
      await putusan.destroy();

      // Log success
      const lembaga = await LembagaPeradilan.findOne({
        where: { kode_lembaga: payload.lembaga_id },
      });

      if (lembaga) {
        await SinkronisasiLog.create({
          id_lembaga: lembaga.id,
          id_putusan_daerah: payload.data.id,
          id_putusan_pusat: putusanId,
          tipe_operasi: 'DELETE',
          waktu_sync: new Date(),
          status: 'SUCCESS',
          jumlah_data: 1,
          pesan_error: null,
        });
      }

      console.log(`✅ [SYNC] Deleted putusan: ${putusanId}`);
    } catch (err) {
      console.error(`❌ [SYNC ERROR] handlePutusanDeleted:`, err.message);

      // Log error
      try {
        const lembaga = await LembagaPeradilan.findOne({
          where: { kode_lembaga: payload.lembaga_id },
        });

        if (lembaga) {
          await SinkronisasiLog.create({
            id_lembaga: lembaga.id,
            id_putusan_daerah: payload.data.id,
            id_putusan_pusat: null,
            tipe_operasi: 'DELETE',
            waktu_sync: new Date(),
            status: 'ERROR',
            jumlah_data: 0,
            pesan_error: err.message,
          });
        }
      } catch (logErr) {
        console.error('[LOG ERROR]', logErr);
      }
    }
  }
}

module.exports = SyncHandler;
