const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Import routes
const versionRouter = require('./routes/version');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình EJS template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'versions/v1.0.0'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Static files MUST be first to avoid any routing conflicts
// Set proper MIME types for JavaScript files
app.use('/v/1.0.0/assets', (req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});
app.use('/v/1.0.0/assets', express.static(path.join(__dirname, 'versions/v1.0.0/assets')));

// Middleware để parse JSON và URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes configuration
app.use('/v', versionRouter);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).send('404 - Page Not Found');
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).send('500 - Internal Server Error');
});

// Khởi động server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 LBM UI Kit Demo Server đang chạy tại http://localhost:${PORT}`);
        console.log(`📁 Static files được serve từ: ${path.join(__dirname, 'public')}`);
        console.log(`🎨 LBM UI Kit files được serve từ: ${path.join(__dirname, 'lbm-ui-kit')}`);
    });
}

module.exports = app;