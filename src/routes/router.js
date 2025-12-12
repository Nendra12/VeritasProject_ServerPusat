'use strict';

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

const putusanController = require('../controllers/putusanController');
const klasifikasiController = require('../controllers/klasifikasiController');
const tahunController = require('../controllers/tahunController');
const lembagaController = require('../controllers/lembagaController');
const sinkronisasiController = require('../controllers/sinkronisasiController');
const authController = require('../controllers/authController');
const daerahController = require('../controllers/daerahController');

// Public routes
router.post('/auth/login', authController.login);

// Public with API key (no JWT required) for all GET endpoints
router.get('/putusan', apiKeyMiddleware, putusanController.getAllPutusan);
router.get('/putusan/:id', apiKeyMiddleware, putusanController.getPutusanById);
router.get('/klasifikasi', apiKeyMiddleware, klasifikasiController.getAllKlasifikasi);
router.get('/klasifikasi/:id', apiKeyMiddleware, klasifikasiController.getKlasifikasiById);
router.get('/tahun', apiKeyMiddleware, tahunController.getAllTahun);
router.get('/tahun/:id', apiKeyMiddleware, tahunController.getTahunById);
router.get('/lembaga', apiKeyMiddleware, lembagaController.getAllLembaga);
router.get('/lembaga/:id', apiKeyMiddleware, lembagaController.getLembagaById);
router.get('/daerah', apiKeyMiddleware, daerahController.getAll);
router.get('/daerah/:id', apiKeyMiddleware, daerahController.getById);
router.get('/sync/history', apiKeyMiddleware, sinkronisasiController.getSyncHistory);
router.get('/sync/failed', apiKeyMiddleware, sinkronisasiController.getFailedSyncs);

// Protected routes (JWT required) for managing data
router.use(authMiddleware);

// Putusan write routes
router.post('/putusan', putusanController.createPutusan);
router.put('/putusan/:id', putusanController.updatePutusan);
router.delete('/putusan/:id', putusanController.deletePutusan);

// Klasifikasi write routes
router.post('/klasifikasi', klasifikasiController.createKlasifikasi);
router.put('/klasifikasi/:id', klasifikasiController.updateKlasifikasi);
router.delete('/klasifikasi/:id', klasifikasiController.deleteKlasifikasi);

// Tahun write routes
router.post('/tahun', tahunController.createTahun);
router.put('/tahun/:id', tahunController.updateTahun);
router.delete('/tahun/:id', tahunController.deleteTahun);

// Lembaga write routes
router.post('/lembaga', lembagaController.createLembaga);
router.put('/lembaga/:id', lembagaController.updateLembaga);
router.delete('/lembaga/:id', lembagaController.deleteLembaga);

// Admin routes for API key management (keep protected)
router.get('/lembaga-keys', lembagaController.getAllLembagaWithKeys);
router.post('/lembaga/:id/regenerate-key', lembagaController.regenerateApiKey);

// Daerah write routes
router.post('/daerah', daerahController.create);
router.put('/daerah/:id', daerahController.update);
router.delete('/daerah/:id', daerahController.destroy);

// Sinkronisasi write routes
router.post('/sync/resync', sinkronisasiController.resyncPutusan);
router.post('/sync/bulk-resync', sinkronisasiController.bulkResync);

module.exports = router;
