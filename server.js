const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.static(path.join(__dirname, 'public')));

// Route configuration
const routes = {
    // Main pages
    '/': { template: 'index', title: 'LBM UI Kit - Home', page: 'home' },
    '/components': { template: 'components/overview', title: 'LBM UI Kit - Components', page: 'components' },
    '/colors': { template: 'colors', title: 'LBM UI Kit - Colors', page: 'colors' },
    '/typography': { template: 'typography', title: 'LBM UI Kit - Typography', page: 'typography' },
    '/forms': { template: 'forms', title: 'LBM UI Kit - Forms', page: 'forms' },
    
    // Component pages
    '/components/buttons': { template: 'components/buttons', title: 'LBM UI Kit - Buttons' },
    '/components/alerts': { template: 'components/alerts', title: 'LBM UI Kit - Alerts' },
    '/components/cards': { template: 'components/cards', title: 'LBM UI Kit - Cards' },
    '/components/badges': { template: 'components/badges', title: 'LBM UI Kit - Badges' },
    '/components/breadcrumb': { template: 'components/breadcrumb', title: 'LBM UI Kit - Breadcrumb' },
    '/components/modals': { template: 'components/modals', title: 'LBM UI Kit - Modals' },
    '/components/accordion': { template: 'components/accordion', title: 'LBM UI Kit - Accordion' },
    '/components/input': { template: 'components/input', title: 'LBM UI Kit - Input' },
    '/components/select': { template: 'components/select', title: 'LBM UI Kit - Select' },
    '/components/dropdown': { template: 'components/dropdown', title: 'LBM UI Kit - Dropdown' },
    '/components/navbar': { template: 'components/navbar', title: 'LBM UI Kit - Navbar' },
    '/components/navs-tabs': { template: 'components/navs-tabs', title: 'LBM UI Kit - Navs & Tabs' },
    '/components/tooltips': { template: 'components/tooltips', title: 'LBM UI Kit - Tooltips' },
    '/components/popovers': { template: 'components/popovers', title: 'LBM UI Kit - Popovers' },
    '/components/toasts': { template: 'components/toasts', title: 'LBM UI Kit - Toasts' },
    '/components/scrollspy': { template: 'components/scrollspy', title: 'LBM UI Kit - Scrollspy' },
    '/components/pagination': { template: 'components/pagination', title: 'LBM UI Kit - Pagination' },
    '/components/scroll-types': { template: 'components/scroll-types', title: 'LBM UI Kit - Scroll Types' },
    '/components/input-dropdown': { template: 'components/input-dropdown', title: 'Input Dropdown - LBM UI Kit' }
};

// Generate routes dynamically
Object.entries(routes).forEach(([path, config]) => {
    app.get(path, (req, res) => {
        res.render(config.template, {
            title: config.title,
            page: config.page || path.replace('/', '')
        });
    });
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Page Not Found - LBM UI Kit',
        page: '404'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', {
        title: 'Server Error - LBM UI Kit',
        page: '500'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LBM UI Kit server is running on http://localhost:${PORT}`);
});

module.exports = app;