const express = require("express");
require("dotenv").config();
const router = require(__dirname + "/src/routes/router.js");
const cors = require("cors");
const SyncListener = require(__dirname + "/src/services/syncListener.js");

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(express.json());
app.use('/api/v1', router);

app.listen(process.env.PORT, () => {
    console.log("Server is starting on port " + process.env.PORT);
    
    // Start Redis Sync Listener
    SyncListener.start();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⏳ Shutting down gracefully...');
    SyncListener.stop();
    process.exit(0);
});

module.exports = app;