const express = require('express');
const router = express.Router();

/**
 * Route cho phiên bản 1.0.0 của LBM UI Kit
 * @route GET /1.0.0
 * @description Hiển thị trang chính của phiên bản 1.0.0
 */
router.get('/1.0.0', (req, res) => {
    res.render('index', {
        title: 'LBM UI Kit - Phiên bản v1.0.0',
        version: '1.0.0',
        currentPage: 'home'
    });
});


module.exports = router;