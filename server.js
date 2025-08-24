const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'LBM UI Kit - Home',
        page: 'home'
    });
});

app.get('/components', (req, res) => {
    res.render('components/overview', {
        title: 'LBM UI Kit - Components',
        page: 'components'
    });
});

app.get('/colors', (req, res) => {
    res.render('colors', {
        title: 'LBM UI Kit - Colors',
        page: 'colors'
    });
});

app.get('/typography', (req, res) => {
    res.render('typography', {
        title: 'LBM UI Kit - Typography',
        page: 'typography'
    });
});

app.get('/forms', (req, res) => {
    res.render('forms', {
        title: 'LBM UI Kit - Forms',
        page: 'forms'
    });
});

// Component child routes
app.get('/components/buttons', (req, res) => {
    res.render('components/buttons', {
        title: 'LBM UI Kit - Buttons',
        page: 'components/buttons'
    });
});

app.get('/components/alerts', (req, res) => {
    res.render('components/alerts', {
        title: 'LBM UI Kit - Alerts',
        page: 'components/alerts'
    });
});

app.get('/components/cards', (req, res) => {
    res.render('components/cards', {
        title: 'LBM UI Kit - Cards',
        page: 'components/cards'
    });
});

app.get('/components/badges', (req, res) => {
    res.render('components/badges', {
        title: 'LBM UI Kit - Badges',
        page: 'components/badges'
    });
});

app.get('/components/breadcrumb', (req, res) => {
    res.render('components/breadcrumb', {
        title: 'LBM UI Kit - Breadcrumb',
        page: 'components/breadcrumb'
    });
});

app.get('/components/modals', (req, res) => {
    res.render('components/modals', {
        title: 'LBM UI Kit - Modals',
        page: 'components/modals'
    });
});

app.get('/components/accordion', (req, res) => {
    res.render('components/accordion', {
        title: 'LBM UI Kit - Accordion',
        page: 'components/accordion'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LBM UI Kit server is running on http://localhost:${PORT}`);
});

module.exports = app;