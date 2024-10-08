const express = require('express');
const { createServer } = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const apiRoutes = require('./routes/apiRoutes'); // Import routes
const { initializeSocket } = require('./socket-io');
const app = express();
const httpServer = createServer(app);
const port = 3000;
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongoexample', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
const io = initializeSocket(httpServer);

// Middleware JSON
app.use(express.json());

// Use routes
app.use('/api', apiRoutes);

httpServer.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});