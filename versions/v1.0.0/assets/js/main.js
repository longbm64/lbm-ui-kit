/**
 * LBM UI Kit Demo - Main JavaScript File
 * Chứa các hàm tiện ích và xử lý tương tác cho demo website
 */

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    initializeDemo();
    setupSidebarToggle();
    setupCodeHighlighting();
    setupTooltips();
    setupScrollSpy();
});

/**
 * Khởi tạo các chức năng demo
 */
function initializeDemo() {
    console.log('LBM UI Kit Demo initialized');
    
    // Thêm class active cho sidebar item hiện tại
    highlightCurrentPage();
    
    // Khởi tạo các component Bootstrap
    initializeBootstrapComponents();
}

/**
 * Thiết lập toggle cho sidebar trên mobile
 */
function setupSidebarToggle() {
    const sidebarToggle = document.querySelector('[data-bs-toggle="collapse"][data-bs-target="#sidebarMenu"]');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebarMenu');
            sidebar.classList.toggle('show');
        });
    }
}

/**
 * Highlight trang hiện tại trong sidebar
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath.includes(href) && href !== '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Thiết lập syntax highlighting cho code blocks
 */
function setupCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // Thêm class để styling
        block.classList.add('language-javascript');
        
        // Thêm nút copy
        addCopyButton(block.parentElement);
    });
}

/**
 * Thêm nút copy cho code blocks
 * @param {Element} preElement - Phần tử pre chứa code
 */
function addCopyButton(preElement) {
    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2';
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.title = 'Copy code';
    
    // Thiết lập position relative cho pre element
    preElement.style.position = 'relative';
    
    copyButton.addEventListener('click', function() {
        const code = preElement.querySelector('code');
        const text = code.textContent;
        
        navigator.clipboard.writeText(text).then(function() {
            // Hiển thị feedback
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            copyButton.classList.remove('btn-outline-secondary');
            copyButton.classList.add('btn-success');
            
            setTimeout(function() {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.classList.remove('btn-success');
                copyButton.classList.add('btn-outline-secondary');
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });
    
    preElement.appendChild(copyButton);
}

/**
 * Khởi tạo tooltips
 */
function setupTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Thiết lập scroll spy cho navigation
 */
function setupScrollSpy() {
    const scrollSpyElements = document.querySelectorAll('[data-bs-spy="scroll"]');
    scrollSpyElements.forEach(element => {
        new bootstrap.ScrollSpy(document.body, {
            target: element
        });
    });
}

/**
 * Khởi tạo các component Bootstrap
 */
function initializeBootstrapComponents() {
    // Khởi tạo tất cả tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Khởi tạo tất cả popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Hàm tiện ích để hiển thị source code
 * @param {string} componentName - Tên component
 * @param {string} sourceCode - Mã nguồn
 */
function viewSource(componentName, sourceCode) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'sourceModal';
    modal.setAttribute('tabindex', '-1');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-code me-2"></i>
                        Source Code - ${componentName}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <pre><code class="language-javascript">${escapeHtml(sourceCode)}</code></pre>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-2"></i>Đóng
                    </button>
                    <button type="button" class="btn btn-primary" onclick="copySourceCode()">
                        <i class="fas fa-copy me-2"></i>Copy Code
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Xóa modal cũ nếu có
    const existingModal = document.getElementById('sourceModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.appendChild(modal);
    
    // Hiển thị modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Lưu source code để copy
    window.currentSourceCode = sourceCode;
    
    // Xóa modal khi đóng
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

/**
 * Copy source code từ modal
 */
function copySourceCode() {
    if (window.currentSourceCode) {
        navigator.clipboard.writeText(window.currentSourceCode).then(function() {
            // Hiển thị thông báo thành công
            showToast('Đã copy source code!', 'success');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
            showToast('Không thể copy source code!', 'error');
        });
    }
}

/**
 * Escape HTML để hiển thị an toàn
 * @param {string} text - Text cần escape
 * @returns {string} - Text đã được escape
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Hiển thị toast notification
 * @param {string} message - Thông điệp
 * @param {string} type - Loại toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    // Tạo toast container nếu chưa có
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }
    
    // Tạo toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    
    const iconMap = {
        success: 'fas fa-check-circle text-success',
        error: 'fas fa-exclamation-circle text-danger',
        warning: 'fas fa-exclamation-triangle text-warning',
        info: 'fas fa-info-circle text-info'
    };
    
    toast.innerHTML = `
        <div class="toast-header">
            <i class="${iconMap[type]} me-2"></i>
            <strong class="me-auto">Thông báo</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Hiển thị toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    bsToast.show();
    
    // Xóa toast sau khi ẩn
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

/**
 * Smooth scroll đến element
 * @param {string} targetId - ID của element đích
 */
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Toggle theme (light/dark)
 */
function toggleTheme() {
    const documentElement = document.documentElement;
    const currentTheme = documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Cập nhật cả data-theme cho LBM UI Kit và data-bs-theme cho Bootstrap
    documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Cập nhật icon toggle
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

/**
 * Khởi tạo theme từ localStorage
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Cập nhật cả data-theme cho LBM UI Kit và data-bs-theme cho Bootstrap
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-bs-theme', savedTheme);
    
    // Cập nhật icon toggle
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Khởi tạo theme khi load trang
initializeTheme();

// Export các hàm để sử dụng global
window.viewSource = viewSource;
window.copySourceCode = copySourceCode;
window.showToast = showToast;
window.smoothScrollTo = smoothScrollTo;
window.toggleTheme = toggleTheme;