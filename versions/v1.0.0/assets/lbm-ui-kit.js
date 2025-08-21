/*!
 * LBM UI Kit v2.0.0
 * Modern JavaScript UI Components Library
 * 
 * Features:
 * - Modal, Toast, Alert, Confirm dialogs
 * - Navigation components (Navbar, Tabs, Dropdown, Pagination, Sidebar)
 * - Form components (Tooltip, Accordion, Carousel)
 * - Theme switching (Light/Dark mode)
 * - Responsive design support
 * - Accessibility features
 * 
 * Author: LBM Team
 * Date: 2025-08-17
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.LBM = factory());
}(this, (function () {
    'use strict';

    // ================================================
    // AUTO-LOAD BOOTSTRAP JS DEPENDENCY
    // ================================================

    // Function to dynamically load Bootstrap JS
    function loadBootstrapJS() {
        return new Promise((resolve, reject) => {
            // Check if Bootstrap is already loaded
            if (typeof window !== 'undefined' && window.bootstrap) {
                resolve();
                return;
            }
            // Create script element for Bootstrap JS
            const script = document.createElement('script');
            script.src = window.location.href + '/assets/bootstrap-5.3.7/js/bootstrap.bundle.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Bootstrap JS'));

            // Append to head
            document.head.appendChild(script);
        });
    }

    // Auto-load Bootstrap JS when this script loads
    if (typeof document !== 'undefined') {
        loadBootstrapJS().catch(console.error);
    }

    // ================================================
    // VIETNAMESE ACCENT NORMALIZATION
    // ================================================

    const VietnameseUtils = {
        // Vietnamese accent mapping
        accentMap: {
            'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
            'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
            'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
            'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
            'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
            'đ': 'd',
            'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
            'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
            'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
            'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
            'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
            'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
            'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
            'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
            'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
            'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
            'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
            'Đ': 'D'
        },

        // Remove Vietnamese accents
        removeAccents: function (str) {
            if (!str) return '';

            return str.split('').map(char => {
                return this.accentMap[char] || char;
            }).join('');
        },

        // Normalize string for search (lowercase + remove accents)
        normalize: function (str) {
            return this.removeAccents(str.toLowerCase().trim());
        },

        // Check if search term matches text (accent-insensitive)
        matches: function (text, searchTerm) {
            if (!searchTerm) return true;

            const normalizedText = this.normalize(text);
            const normalizedSearch = this.normalize(searchTerm);

            return normalizedText.includes(normalizedSearch);
        }
    };

    // ================================================
    // UTILITIES & HELPERS
    // ================================================

    const Utils = {
        // Generate unique ID
        generateId: function () {
            return 'lbm-' + Math.random().toString(36).substr(2, 9);
        },

        // DOM manipulation helpers
        createElement: function (tag, className, innerHTML) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (innerHTML) element.innerHTML = innerHTML;
            return element;
        },

        // Event helpers
        on: function (element, event, handler, options) {
            element.addEventListener(event, handler, options);
        },

        off: function (element, event, handler) {
            element.removeEventListener(event, handler);
        },

        // Animation helpers
        fadeIn: function (element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';

            let start = performance.now();

            function animate(currentTime) {
                let elapsed = currentTime - start;
                let progress = elapsed / duration;

                if (progress < 1) {
                    element.style.opacity = progress;
                    requestAnimationFrame(animate);
                } else {
                    element.style.opacity = '1';
                }
            }

            requestAnimationFrame(animate);
        },

        fadeOut: function (element, duration = 300, callback) {
            let start = performance.now();
            let initialOpacity = parseFloat(getComputedStyle(element).opacity);

            function animate(currentTime) {
                let elapsed = currentTime - start;
                let progress = elapsed / duration;

                if (progress < 1) {
                    element.style.opacity = initialOpacity * (1 - progress);
                    requestAnimationFrame(animate);
                } else {
                    element.style.opacity = '0';
                    element.style.display = 'none';
                    if (callback) callback();
                }
            }

            requestAnimationFrame(animate);
        },

        // Position helpers
        getPosition: function (element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
        },

        // Throttle function
        throttle: function (func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Debounce function
        debounce: function (func, wait, immediate) {
            let timeout;
            return function () {
                const context = this, args = arguments;
                const later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    };

    // ================================================
    // MODAL COMPONENT
    // ================================================

    class Modal {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                backdrop: true,
                keyboard: true,
                focus: true,
                ...options
            };

            this.isOpen = false;
            this.backdrop = null;

            this.init();
        }

        init() {
            // Find or create backdrop
            this.backdrop = this.element.closest('.uk-modal') || this.element;

            // Find close buttons
            this.closeButtons = this.element.querySelectorAll('[data-uk-modal-close], .uk-modal-close');

            // Bind events
            this.bindEvents();
        }

        bindEvents() {
            // Close button events
            this.closeButtons.forEach(button => {
                Utils.on(button, 'click', (e) => {
                    e.preventDefault();
                    this.hide();
                });
            });

            // Keyboard events
            if (this.options.keyboard) {
                Utils.on(document, 'keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.hide();
                    }
                });
            }

            // Backdrop click
            if (this.options.backdrop) {
                Utils.on(this.backdrop, 'click', (e) => {
                    if (e.target === this.backdrop) {
                        this.hide();
                    }
                });
            }
        }

        show() {
            if (this.isOpen) return;

            // Trigger before show event
            const beforeShowEvent = new CustomEvent('uk.modal.beforeShow', {
                detail: { modal: this },
                cancelable: true
            });

            if (!this.element.dispatchEvent(beforeShowEvent)) {
                return;
            }

            this.isOpen = true;

            // Show backdrop
            this.backdrop.style.display = 'flex';
            this.backdrop.setAttribute('aria-hidden', 'false');

            // Force reflow
            void this.backdrop.offsetWidth;

            // Add open class for animation
            this.backdrop.classList.add('uk-modal-open');

            // Focus management
            if (this.options.focus) {
                const modalBody = this.element.querySelector('.uk-modal-body');
                if (modalBody) {
                    modalBody.setAttribute('tabindex', '0');
                    modalBody.focus();
                }
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Trigger show event
            const showEvent = new CustomEvent('uk.modal.show', {
                detail: { modal: this }
            });
            this.element.dispatchEvent(showEvent);
        }

        hide() {
            if (!this.isOpen) return;

            // Trigger before hide event
            const beforeHideEvent = new CustomEvent('uk.modal.beforeHide', {
                detail: { modal: this },
                cancelable: true
            });

            if (!this.element.dispatchEvent(beforeHideEvent)) {
                return;
            }

            this.isOpen = false;

            // Remove open class
            this.backdrop.classList.remove('uk-modal-open');
            this.backdrop.setAttribute('aria-hidden', 'true');

            // Restore body scroll
            document.body.style.overflow = '';

            // Hide after transition
            const handleTransitionEnd = () => {
                this.backdrop.style.display = 'none';
                Utils.off(this.backdrop, 'transitionend', handleTransitionEnd);

                // Trigger hidden event
                const hiddenEvent = new CustomEvent('uk.modal.hidden', {
                    detail: { modal: this }
                });
                this.element.dispatchEvent(hiddenEvent);
            };

            Utils.on(this.backdrop, 'transitionend', handleTransitionEnd);

            // Fallback
            setTimeout(() => {
                if (this.backdrop.style.display !== 'none') {
                    this.backdrop.style.display = 'none';
                }
            }, 300);
        }

        toggle() {
            this.isOpen ? this.hide() : this.show();
        }

        destroy() {
            this.hide();
            // Remove event listeners would go here
        }
    }

    // ================================================
    // TOAST COMPONENT
    // ================================================

    class Toast {
        static containers = {};
        static defaultOptions = {
            type: 'info',
            duration: 5000, // Mặc định 5 giây
            position: 'top-right', // Mặc định góc phải phía trên
            closable: true,
            title: 'Thông báo',
            autoHide: true // Tùy chọn tự động ẩn
        };

        static show(message, options = {}) {
            const config = { ...Toast.defaultOptions, ...options };
            const container = Toast.getContainer(config.position);

            const toast = Utils.createElement('div', `uk-toast uk-toast-${config.type}`);

            // Create toast header with close button
            const toastHeader = Utils.createElement('div', 'uk-toast-header');
            const headerTitle = Utils.createElement('div', 'uk-toast-title', config.title);
            toastHeader.appendChild(headerTitle);

            // Add close button to header (top-right position)
            if (config.closable) {
                const closeBtn = Utils.createElement('button', 'uk-toast-close', '×');
                Utils.on(closeBtn, 'click', () => Toast.hide(toast));
                toastHeader.appendChild(closeBtn);
            }

            toast.appendChild(toastHeader);

            // Create toast body
            const toastBody = Utils.createElement('div', 'uk-toast-body');
            const toastMessage = Utils.createElement('div', 'uk-toast-message');
            if (config.html) {
                toastMessage.innerHTML = message;
            } else {
                toastMessage.textContent = message;
            }
            toastBody.appendChild(toastMessage);

            // Add timestamp at bottom-left
            const timestamp = Utils.createElement('div', 'uk-toast-timestamp');
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Phân chia thời gian theo 4 khoảng: sáng, trưa, chiều, tối
            let period;
            if (hours >= 5 && hours < 11) {
                period = 'sáng';
            } else if (hours >= 11 && hours < 13) {
                period = 'trưa';
            } else if (hours >= 13 && hours < 18) {
                period = 'chiều';
            } else {
                period = 'tối'; // 18h-5h sáng hôm sau
            }

            const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
            const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
            timestamp.textContent = timeString;
            toastBody.appendChild(timestamp);

            toast.appendChild(toastBody);

            // Insert at beginning
            if (container.firstChild) {
                container.insertBefore(toast, container.firstChild);
            } else {
                container.appendChild(toast);
            }

            // Trigger show animation
            requestAnimationFrame(() => {
                toast.classList.add('uk-toast-show');
            });

            // Auto hide - chỉ ẩn khi autoHide = true và duration > 0
            if (config.autoHide && config.duration > 0) {
                setTimeout(() => {
                    Toast.hide(toast);
                }, config.duration);
            }

            return toast;
        }

        static hide(toast) {
            toast.classList.remove('uk-toast-show');

            Utils.on(toast, 'transitionend', () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, { once: true });
        }

        static getContainer(position) {
            if (!Toast.containers[position]) {
                let container = document.querySelector(`.uk-toast-container.uk-${position}`);
                if (!container) {
                    container = Utils.createElement('div', `uk-toast-container uk-${position}`);
                    document.body.appendChild(container);
                }
                Toast.containers[position] = container;
            }
            return Toast.containers[position];
        }

        static success(message, options = {}) {
            return Toast.show(message, { ...options, type: 'success', title: options.title || 'Thành công' });
        }

        static error(message, options = {}) {
            return Toast.show(message, { ...options, type: 'danger', title: options.title || 'Lỗi' });
        }

        static warning(message, options = {}) {
            return Toast.show(message, { ...options, type: 'warning', title: options.title || 'Cảnh báo' });
        }

        static info(message, options = {}) {
            return Toast.show(message, { ...options, type: 'info', title: options.title || 'Thông tin' });
        }

        // Hide all toasts from all containers
        static hideAll() {
            Object.values(Toast.containers).forEach(container => {
                const toasts = container.querySelectorAll('.uk-toast');
                toasts.forEach(toast => {
                    Toast.hide(toast);
                });
            });
        }

        // Count total number of visible toasts
        static count() {
            let total = 0;
            Object.values(Toast.containers).forEach(container => {
                total += container.querySelectorAll('.uk-toast').length;
            });
            return total;
        }

        // Check if any toast exists
        static exists() {
            return Toast.count() > 0;
        }
    }


    // ================================================
    // ALERT COMPONENT
    // ================================================

    class Alert {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                closable: true,
                duration: 0, // 0 means no auto-close
                ...options
            };

            this.init();
        }

        init() {
            // Add close button if closable
            if (this.options.closable && !this.element.querySelector('.uk-alert-close')) {
                const closeBtn = Utils.createElement('button', 'uk-alert-close', '×');
                this.element.appendChild(closeBtn);

                Utils.on(closeBtn, 'click', (e) => {
                    e.preventDefault();
                    this.close();
                });
            }

            // Auto close
            if (this.options.duration > 0) {
                setTimeout(() => {
                    this.close();
                }, this.options.duration);
            }
        }

        close() {
            // Trigger before close event
            const beforeCloseEvent = new CustomEvent('uk.alert.beforeClose', {
                detail: { alert: this },
                cancelable: true
            });

            if (!this.element.dispatchEvent(beforeCloseEvent)) {
                return;
            }

            // Fade out animation
            this.element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }

                // Trigger closed event
                const closedEvent = new CustomEvent('uk.alert.closed', {
                    detail: { alert: this }
                });
                document.dispatchEvent(closedEvent);
            }, 300);
        }

        static create(message, type = 'info', options = {}) {
            const alert = Utils.createElement('div', `uk-alert uk-alert-${type}`, message);

            const alertInstance = new Alert(alert, options);

            // Find container or create one
            let container = document.querySelector('.uk-alert-container');
            if (!container) {
                container = Utils.createElement('div', 'uk-alert-container');
                document.body.appendChild(container);
            }

            container.appendChild(alert);

            return alertInstance;
        }
    }

    // ================================================
    // CONFIRM COMPONENT
    // ================================================

    class Confirm {
        static show(title, message, options = {}) {
            return new Promise((resolve) => {
                const config = {
                    confirmText: 'Xác nhận',
                    cancelText: 'Hủy',
                    type: 'primary',
                    ...options
                };

                // Create overlay
                const overlay = Utils.createElement('div', 'uk-modal uk-modal-open');
                overlay.style.display = 'flex';

                // Create confirm dialog
                const confirmBox = Utils.createElement('div', 'uk-modal-dialog uk-modal-sm');
                confirmBox.innerHTML = `
                    <div class="uk-modal-content">
                        <div class="uk-modal-header">
                            <h3 class="uk-modal-title">${title}</h3>
                        </div>
                        <div class="uk-modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="uk-modal-footer">
                            <button class="uk-btn uk-btn-secondary" data-action="cancel">${config.cancelText}</button>
                            <button class="uk-btn uk-btn-${config.type}" data-action="confirm">${config.confirmText}</button>
                        </div>
                    </div>
                `;

                overlay.appendChild(confirmBox);
                document.body.appendChild(overlay);

                const confirmButton = confirmBox.querySelector('[data-action="confirm"]');
                const cancelButton = confirmBox.querySelector('[data-action="cancel"]');

                Utils.on(confirmButton, 'click', () => {
                    overlay.remove();
                    resolve(true);
                });

                Utils.on(cancelButton, 'click', () => {
                    overlay.remove();
                    resolve(false);
                });

                // Close on backdrop click
                Utils.on(overlay, 'click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                        resolve(false);
                    }
                });

                // Close on escape key
                Utils.on(document, 'keydown', (e) => {
                    if (e.key === 'Escape') {
                        overlay.remove();
                        resolve(false);
                    }
                }, { once: true });
            });
        }
    }

    // ================================================
    // ACCORDION COMPONENT
    // ================================================

    class Accordion {
        constructor(element) {
            this.element = element;
            this.items = Array.from(this.element.querySelectorAll('.uk-accordion-item'));
            this.init();
        }

        init() {
            this.items.forEach(item => {
                const header = item.querySelector('.uk-accordion-header');
                Utils.on(header, 'click', () => this.toggle(item));
            });
        }

        toggle(item) {
            const content = item.querySelector('.uk-accordion-content');
            if (item.classList.contains('uk-open')) {
                item.classList.remove('uk-open');
                content.style.maxHeight = null;
            } else {
                this.items.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('uk-open')) {
                        otherItem.classList.remove('uk-open');
                        otherItem.querySelector('.uk-accordion-content').style.maxHeight = null;
                    }
                });
                item.classList.add('uk-open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }

        static initAll() {
            document.querySelectorAll('.uk-accordion').forEach(accordionElement => {
                new Accordion(accordionElement);
            });
        }
    }

    // ================================================
    // CAROUSEL COMPONENT
    // ================================================

    class Carousel {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                autoplay: false,
                interval: 3000,
                loop: true,
                ...options
            };
            this.slides = Array.from(this.element.querySelectorAll('.uk-carousel-slide'));
            this.currentIndex = 0;
            this.timer = null;
            this.init();
        }

        init() {
            this.createControls();
            this.bindEvents();
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }

        createControls() {
            const prevBtn = Utils.createElement('button', 'uk-carousel-prev', '‹');
            const nextBtn = Utils.createElement('button', 'uk-carousel-next', '›');

            this.element.appendChild(prevBtn);
            this.element.appendChild(nextBtn);

            Utils.on(prevBtn, 'click', () => this.prev());
            Utils.on(nextBtn, 'click', () => this.next());
        }

        bindEvents() {
            Utils.on(this.element, 'mouseenter', () => this.stopAutoplay());
            Utils.on(this.element, 'mouseleave', () => {
                if (this.options.autoplay) {
                    this.startAutoplay();
                }
            });
        }

        next() {
            if (this.currentIndex < this.slides.length - 1) {
                this.currentIndex++;
            } else if (this.options.loop) {
                this.currentIndex = 0;
            }
            this.updateSlides();
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else if (this.options.loop) {
                this.currentIndex = this.slides.length - 1;
            }
            this.updateSlides();
        }

        updateSlides() {
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('uk-active', index === this.currentIndex);
            });
        }

        startAutoplay() {
            this.timer = setInterval(() => this.next(), this.options.interval);
        }

        stopAutoplay() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }

    // ================================================
    // SELECT DROPDOWN COMPONENT
    // ================================================

    class SelectDropdown {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                placeholder: 'Chọn một tùy chọn...',
                searchPlaceholder: 'Tìm kiếm...',
                noResultsText: 'Không tìm thấy kết quả',
                loadingText: 'Đang tải...',
                searchable: true,
                clearable: false,
                multiple: false,
                disabled: false,
                maxHeight: 300,
                searchDelay: 300,
                ...options
            };

            this.isOpen = false;
            this.selectedValues = this.options.multiple ? [] : null;
            this.filteredOptions = [];
            this.highlightedIndex = -1;
            this.searchTerm = '';

            this.init();
        }

        init() {
            this.createStructure();
            this.parseOptions();
            this.bindEvents();
            this.updateDisplay();
        }

        createStructure() {
            // Hide original select
            this.element.style.display = 'none';

            // Create dropdown container
            this.container = Utils.createElement('div', 'uk-select-dropdown');
            this.container.id = Utils.generateId();

            // Create trigger
            this.trigger = Utils.createElement('div', 'uk-select-trigger');
            this.trigger.setAttribute('tabindex', '0');
            this.trigger.setAttribute('role', 'combobox');
            this.trigger.setAttribute('aria-expanded', 'false');
            this.trigger.setAttribute('aria-haspopup', 'listbox');

            this.valueDisplay = Utils.createElement('span', 'uk-select-value uk-placeholder');
            this.valueDisplay.textContent = this.options.placeholder;

            this.arrow = Utils.createElement('span', 'uk-select-arrow');

            this.trigger.appendChild(this.valueDisplay);
            this.trigger.appendChild(this.arrow);

            // Create dropdown menu
            this.menu = Utils.createElement('div', 'uk-select-dropdown-menu');
            this.menu.setAttribute('role', 'listbox');

            // Create search input if searchable
            if (this.options.searchable) {
                this.searchContainer = Utils.createElement('div', 'uk-select-search');
                this.searchInput = Utils.createElement('input', 'uk-select-search-input');
                this.searchInput.type = 'text';
                this.searchInput.placeholder = this.options.searchPlaceholder;
                this.searchInput.setAttribute('autocomplete', 'off');

                this.searchContainer.appendChild(this.searchInput);
                this.menu.appendChild(this.searchContainer);
            }

            // Create options container
            this.optionsContainer = Utils.createElement('ul', 'uk-select-options');
            this.menu.appendChild(this.optionsContainer);

            // Assemble structure
            this.container.appendChild(this.trigger);
            this.container.appendChild(this.menu);

            // Insert after original select
            this.element.parentNode.insertBefore(this.container, this.element.nextSibling);

            // Apply size and state classes
            if (this.options.size) {
                this.container.classList.add(`uk-select-${this.options.size}`);
            }

            if (this.options.state) {
                this.container.classList.add(`uk-select-${this.options.state}`);
            }

            if (this.options.disabled) {
                this.container.classList.add('uk-select-disabled');
            }
        }

        parseOptions() {
            this.allOptions = [];
            const options = this.element.querySelectorAll('option');

            options.forEach((option, index) => {
                if (option.value === '') return; // Skip empty options

                const optionData = {
                    value: option.value,
                    text: option.textContent.trim(),
                    disabled: option.disabled,
                    selected: option.selected,
                    element: option,
                    index: index
                };

                // Parse data attributes
                if (option.dataset.icon) {
                    optionData.icon = option.dataset.icon;
                }

                if (option.dataset.description) {
                    optionData.description = option.dataset.description;
                }

                this.allOptions.push(optionData);

                // Set initial selection
                if (option.selected) {
                    if (this.options.multiple) {
                        this.selectedValues.push(optionData.value);
                    } else {
                        this.selectedValues = optionData.value;
                    }
                }
            });

            this.filteredOptions = [...this.allOptions];
        }

        bindEvents() {
            // Trigger click
            Utils.on(this.trigger, 'click', (e) => {
                e.preventDefault();
                if (!this.options.disabled) {
                    this.toggle();
                }
            });

            // Trigger keyboard
            Utils.on(this.trigger, 'keydown', (e) => {
                this.handleTriggerKeydown(e);
            });

            // Search input
            if (this.searchInput) {
                const debouncedSearch = Utils.debounce((e) => {
                    this.handleSearch(e.target.value);
                }, this.options.searchDelay);

                Utils.on(this.searchInput, 'input', debouncedSearch);

                Utils.on(this.searchInput, 'keydown', (e) => {
                    this.handleSearchKeydown(e);
                });
            }

            // Click outside to close
            Utils.on(document, 'click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.close();
                }
            });

            // Window resize
            Utils.on(window, 'resize', Utils.debounce(() => {
                if (this.isOpen) {
                    this.updateMenuPosition();
                }
            }, 100));
        }

        handleTriggerKeydown(e) {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (!this.isOpen) {
                        this.open();
                    } else {
                        this.highlightNext();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.isOpen) {
                        this.highlightPrevious();
                    }
                    break;
                case 'Escape':
                    if (this.isOpen) {
                        e.preventDefault();
                        this.close();
                    }
                    break;
            }
        }

        handleSearchKeydown(e) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.highlightNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.highlightPrevious();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.highlightedIndex >= 0) {
                        this.selectOption(this.filteredOptions[this.highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
            }
        }

        handleSearch(searchTerm) {
            this.searchTerm = searchTerm;
            this.filterOptions();
            this.renderOptions();
            this.highlightedIndex = -1;
        }

        filterOptions() {
            if (!this.searchTerm) {
                this.filteredOptions = [...this.allOptions];
            } else {
                this.filteredOptions = this.allOptions.filter(option => {
                    return VietnameseUtils.matches(option.text, this.searchTerm) ||
                        (option.description && VietnameseUtils.matches(option.description, this.searchTerm));
                });
            }
        }

        renderOptions() {
            this.optionsContainer.innerHTML = '';

            if (this.filteredOptions.length === 0) {
                const noResults = Utils.createElement('li', 'uk-select-no-results');
                noResults.textContent = this.options.noResultsText;
                this.optionsContainer.appendChild(noResults);
                return;
            }

            this.filteredOptions.forEach((option, index) => {
                const optionElement = this.createOptionElement(option, index);
                this.optionsContainer.appendChild(optionElement);
            });
        }

        createOptionElement(option, index) {
            const li = Utils.createElement('li');
            const button = Utils.createElement('button', 'uk-select-option');
            button.type = 'button';
            button.setAttribute('role', 'option');
            button.setAttribute('data-value', option.value);
            button.setAttribute('data-index', index);

            if (option.disabled) {
                button.classList.add('uk-disabled');
                button.disabled = true;
            }

            if (this.isSelected(option.value)) {
                button.classList.add('uk-selected');
                button.setAttribute('aria-selected', 'true');
            }

            // Create option content
            let content = '';

            if (option.icon) {
                content += `<span class="uk-select-option-icon">${option.icon}</span>`;
            }

            content += `<div class="uk-select-option-text">`;
            content += this.highlightSearchTerm(option.text);

            if (option.description) {
                content += `<div class="uk-select-option-description">${this.highlightSearchTerm(option.description)}</div>`;
            }

            content += `</div>`;

            button.innerHTML = content;

            // Click handler
            Utils.on(button, 'click', (e) => {
                e.preventDefault();
                this.selectOption(option);
            });

            // Hover handler
            Utils.on(button, 'mouseenter', () => {
                this.highlightedIndex = index;
                this.updateHighlight();
            });

            li.appendChild(button);
            return li;
        }

        highlightSearchTerm(text) {
            if (!this.searchTerm) return text;

            const normalizedText = VietnameseUtils.normalize(text);
            const normalizedSearch = VietnameseUtils.normalize(this.searchTerm);

            let result = text;
            let startIndex = normalizedText.indexOf(normalizedSearch);

            if (startIndex !== -1) {
                const originalMatch = text.substr(startIndex, this.searchTerm.length);
                result = text.replace(originalMatch, `<mark>${originalMatch}</mark>`);
            }

            return result;
        }

        selectOption(option) {
            if (option.disabled) return;

            if (this.options.multiple) {
                const index = this.selectedValues.indexOf(option.value);
                if (index > -1) {
                    this.selectedValues.splice(index, 1);
                } else {
                    this.selectedValues.push(option.value);
                }
            } else {
                this.selectedValues = option.value;
                this.close();
            }

            this.updateOriginalSelect();
            this.updateDisplay();
            this.renderOptions();
            this.emitChangeEvent();
        }

        isSelected(value) {
            if (this.options.multiple) {
                return this.selectedValues.includes(value);
            } else {
                return this.selectedValues === value;
            }
        }

        updateOriginalSelect() {
            const options = this.element.querySelectorAll('option');

            options.forEach(option => {
                option.selected = this.isSelected(option.value);
            });
        }

        updateDisplay() {
            if (this.options.multiple) {
                if (this.selectedValues.length === 0) {
                    this.valueDisplay.textContent = this.options.placeholder;
                    this.valueDisplay.classList.add('uk-placeholder');
                } else {
                    const selectedTexts = this.selectedValues.map(value => {
                        const option = this.allOptions.find(opt => opt.value === value);
                        return option ? option.text : value;
                    });
                    this.valueDisplay.textContent = selectedTexts.join(', ');
                    this.valueDisplay.classList.remove('uk-placeholder');
                }
            } else {
                if (!this.selectedValues) {
                    this.valueDisplay.textContent = this.options.placeholder;
                    this.valueDisplay.classList.add('uk-placeholder');
                } else {
                    const option = this.allOptions.find(opt => opt.value === this.selectedValues);
                    this.valueDisplay.textContent = option ? option.text : this.selectedValues;
                    this.valueDisplay.classList.remove('uk-placeholder');
                }
            }
        }

        emitChangeEvent() {
            const event = new CustomEvent('change', {
                bubbles: true,
                detail: {
                    value: this.selectedValues,
                    element: this.element
                }
            });
            this.element.dispatchEvent(event);
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            if (this.isOpen || this.options.disabled) return;

            this.isOpen = true;
            this.container.classList.add('uk-open');
            this.trigger.classList.add('uk-open');
            this.trigger.setAttribute('aria-expanded', 'true');
            this.menu.classList.add('uk-open');

            this.renderOptions();
            this.updateMenuPosition();

            if (this.searchInput) {
                setTimeout(() => {
                    this.searchInput.focus();
                }, 100);
            }

            this.emitOpenEvent();
        }

        close() {
            if (!this.isOpen) return;

            this.isOpen = false;
            this.container.classList.remove('uk-open');
            this.trigger.classList.remove('uk-open');
            this.trigger.setAttribute('aria-expanded', 'false');
            this.menu.classList.remove('uk-open');

            if (this.searchInput) {
                this.searchInput.value = '';
                this.searchTerm = '';
                this.filterOptions();
            }

            this.highlightedIndex = -1;
            this.emitCloseEvent();
        }

        highlightNext() {
            if (this.filteredOptions.length === 0) return;

            this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredOptions.length;
            this.updateHighlight();
        }

        highlightPrevious() {
            if (this.filteredOptions.length === 0) return;

            this.highlightedIndex = this.highlightedIndex <= 0
                ? this.filteredOptions.length - 1
                : this.highlightedIndex - 1;
            this.updateHighlight();
        }

        updateHighlight() {
            const options = this.optionsContainer.querySelectorAll('.uk-select-option');
            options.forEach((option, index) => {
                option.classList.toggle('uk-highlighted', index === this.highlightedIndex);
            });
        }

        updateMenuPosition() {
            const triggerRect = this.trigger.getBoundingClientRect();
            const menuHeight = this.menu.offsetHeight;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            // Position menu below or above trigger based on available space
            if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
                this.menu.style.top = '100%';
                this.menu.style.bottom = 'auto';
            } else {
                this.menu.style.top = 'auto';
                this.menu.style.bottom = '100%';
            }
        }

        emitOpenEvent() {
            const event = new CustomEvent('open', {
                bubbles: true,
                detail: { element: this.element }
            });
            this.element.dispatchEvent(event);
        }

        emitCloseEvent() {
            const event = new CustomEvent('close', {
                bubbles: true,
                detail: { element: this.element }
            });
            this.element.dispatchEvent(event);
        }

        // Public API methods
        getValue() {
            // Nếu chưa chọn giá trị từ data-options, trả về giá trị hiện tại trong input
            if (this.selectedValues === null || this.selectedValues === undefined || this.selectedValues === '') {
                return this.input.value;
            }
            return this.selectedValues;
        }

        setValue(value) {
            this.selectedValues = this.options.multiple ? (Array.isArray(value) ? value : [value]) : value;
            this.updateOriginalSelect();
            this.updateDisplay();
            this.renderOptions();
        }

        enable() {
            this.options.disabled = false;
            this.container.classList.remove('uk-select-disabled');
        }

        disable() {
            this.options.disabled = true;
            this.container.classList.add('uk-select-disabled');
            this.close();
        }

        destroy() {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this.element.style.display = '';
        }

        // Load options from JSON data
        loadFromJSON(jsonData, config = {}) {
            try {
                // Default configuration
                const defaultConfig = {
                    valueKey: 'value',
                    textKey: 'text',
                    disabledKey: 'disabled',
                    clearExisting: true
                };

                const finalConfig = { ...defaultConfig, ...config };

                // Clear existing options if requested
                if (finalConfig.clearExisting) {
                    this.element.innerHTML = '';
                    // Add placeholder option if needed
                    if (this.options.placeholder && !this.options.multiple) {
                        const placeholderOption = document.createElement('option');
                        placeholderOption.value = '';
                        placeholderOption.textContent = this.options.placeholder;
                        this.element.appendChild(placeholderOption);
                    }
                }

                // Process JSON data
                const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

                dataArray.forEach(item => {
                    const option = document.createElement('option');

                    // Set value
                    option.value = item[finalConfig.valueKey] || item.value || '';

                    // Set text
                    option.textContent = item[finalConfig.textKey] || item.text || item.label || option.value;

                    // Set disabled state
                    if (item[finalConfig.disabledKey] || item.disabled) {
                        option.disabled = true;
                    }

                    this.element.appendChild(option);
                });

                // Re-parse options and update display
                this.parseOptions();
                this.updateDisplay();
                this.renderOptions();

                // Emit custom event
                this.element.dispatchEvent(new CustomEvent('lbm:options-loaded', {
                    detail: {
                        source: 'json',
                        data: jsonData,
                        config: finalConfig
                    }
                }));

                return true;

            } catch (error) {
                console.error('LBM SelectDropdown: Error loading JSON data:', error);

                // Emit error event
                this.element.dispatchEvent(new CustomEvent('lbm:options-error', {
                    detail: {
                        source: 'json',
                        error: error.message,
                        data: jsonData
                    }
                }));

                return false;
            }
        }

        // Load options from API endpoint
        async loadFromAPI(url, config = {}) {
            try {
                // Default configuration
                const defaultConfig = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    valueKey: 'value',
                    textKey: 'text',
                    disabledKey: 'disabled',
                    clearExisting: true,
                    dataPath: null, // Path to data in response (e.g., 'data.items')
                    showLoading: true,
                    loadingText: this.options.loadingText || 'Đang tải...'
                };

                const finalConfig = { ...defaultConfig, ...config };

                // Show loading state
                if (finalConfig.showLoading) {
                    this.showLoadingState(finalConfig.loadingText);
                }

                // Make API request
                const response = await fetch(url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.method !== 'GET' ? JSON.stringify(finalConfig.body) : undefined
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let data = await response.json();

                // Extract data from nested path if specified
                if (finalConfig.dataPath) {
                    const pathParts = finalConfig.dataPath.split('.');
                    for (const part of pathParts) {
                        data = data[part];
                        if (data === undefined) {
                            throw new Error(`Data path '${finalConfig.dataPath}' not found in response`);
                        }
                    }
                }

                // Hide loading state
                if (finalConfig.showLoading) {
                    this.hideLoadingState();
                }

                // Use loadFromJSON to process the data
                const result = this.loadFromJSON(data, {
                    valueKey: finalConfig.valueKey,
                    textKey: finalConfig.textKey,
                    disabledKey: finalConfig.disabledKey,
                    clearExisting: finalConfig.clearExisting
                });

                if (result) {
                    // Emit custom event for API load
                    this.element.dispatchEvent(new CustomEvent('lbm:options-loaded', {
                        detail: {
                            source: 'api',
                            url: url,
                            data: data,
                            config: finalConfig
                        }
                    }));
                }

                return result;

            } catch (error) {
                console.error('LBM SelectDropdown: Error loading API data:', error);

                // Hide loading state on error
                if (finalConfig.showLoading) {
                    this.hideLoadingState();
                }

                // Show error state
                this.showErrorState(error.message);

                // Emit error event
                this.element.dispatchEvent(new CustomEvent('lbm:options-error', {
                    detail: {
                        source: 'api',
                        url: url,
                        error: error.message,
                        config: finalConfig
                    }
                }));

                return false;
            }
        }

        // Show loading state in dropdown
        showLoadingState(loadingText = 'Đang tải...') {
            // Clear existing options
            this.element.innerHTML = '';

            // Add loading option
            const loadingOption = document.createElement('option');
            loadingOption.value = '';
            loadingOption.textContent = loadingText;
            loadingOption.disabled = true;
            this.element.appendChild(loadingOption);

            // Update display
            this.parseOptions();
            this.updateDisplay();
            this.renderOptions();

            // Add loading class to container
            if (this.container) {
                this.container.classList.add('uk-select-loading');
            }
        }

        // Hide loading state
        hideLoadingState() {
            if (this.container) {
                this.container.classList.remove('uk-select-loading');
            }
        }

        // Show error state in dropdown
        showErrorState(errorMessage = 'Lỗi tải dữ liệu') {
            // Clear existing options
            this.element.innerHTML = '';

            // Add error option
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = `⚠️ ${errorMessage}`;
            errorOption.disabled = true;
            this.element.appendChild(errorOption);

            // Update display
            this.parseOptions();
            this.updateDisplay();
            this.renderOptions();

            // Add error class to container
            if (this.container) {
                this.container.classList.add('uk-select-error');
            }
        }

        // Clear error state
        clearErrorState() {
            if (this.container) {
                this.container.classList.remove('uk-select-error');
            }
        }

        // Static method to initialize all select dropdowns
        static initAll() {
            // Initialize dropdowns with data-uk-select attribute (legacy)
            document.querySelectorAll('select[data-uk-select]').forEach(select => {
                if (!select._lbmSelectDropdown) {
                    const options = select.dataset.ukSelectOptions ? JSON.parse(select.dataset.ukSelectOptions) : {};
                    select._lbmSelectDropdown = new SelectDropdown(select, options);
                }
            });

            // Initialize dropdowns with lbm-select-dropdown class
            document.querySelectorAll('select.lbm-select-dropdown').forEach(select => {
                if (!select._lbmSelectDropdown) {
                    const options = {};

                    // Read data attributes
                    if (select.dataset.searchable !== undefined) {
                        options.searchable = select.dataset.searchable === 'true';
                    }
                    if (select.hasAttribute('multiple')) {
                        options.multiple = true;
                    }
                    if (select.hasAttribute('disabled')) {
                        options.disabled = true;
                    }
                    if (select.dataset.placeholder) {
                        options.placeholder = select.dataset.placeholder;
                    }

                    select._lbmSelectDropdown = new SelectDropdown(select, options);
                }
            });
        }
    }

    // ================================================
    // INPUT DROPDOWN COMPONENT
    // ================================================

    class InputDropdown {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                placeholder: 'Nhập hoặc chọn...',
                searchPlaceholder: 'Tìm kiếm...',
                noResultsText: 'Không tìm thấy kết quả',
                loadingText: 'Đang tải...',
                searchable: true,
                clearable: true,
                multiple: false,
                disabled: false,
                maxHeight: 300,
                searchDelay: 300,
                allowCustomValue: true, // Cho phép nhập giá trị tùy chỉnh
                ...options
            };

            this.isOpen = false;
            this.selectedValues = this.options.multiple ? [] : null;
            this.filteredOptions = [];
            this.highlightedIndex = -1;
            this.searchTerm = '';
            this.customValue = '';

            this.init();
        }

        init() {
            this.createStructure();
            this.parseOptions();
            this.bindEvents();
            this.updateDisplay();
        }

        createStructure() {
            // Hide original input
            this.element.style.display = 'none';

            // Create dropdown container
            this.container = Utils.createElement('div', 'uk-input-dropdown');
            this.container.id = Utils.generateId();

            // Create input field
            this.input = Utils.createElement('input', 'uk-input-field');
            this.input.type = 'text';
            this.input.setAttribute('autocomplete', 'off');
            this.input.setAttribute('role', 'combobox');
            this.input.setAttribute('aria-expanded', 'false');
            this.input.setAttribute('aria-haspopup', 'listbox');
            this.input.placeholder = this.options.placeholder;

            // Create dropdown arrow
            this.arrow = Utils.createElement('span', 'uk-input-arrow');

            // Create input wrapper
            this.inputWrapper = Utils.createElement('div', 'uk-input-wrapper');
            this.inputWrapper.appendChild(this.input);
            this.inputWrapper.appendChild(this.arrow);

            // Create dropdown menu
            this.menu = Utils.createElement('div', 'uk-input-dropdown-menu');
            this.menu.setAttribute('role', 'listbox');

            // Create options list
            this.optionsList = Utils.createElement('div', 'uk-input-options-list');
            this.menu.appendChild(this.optionsList);

            // Assemble structure
            this.container.appendChild(this.inputWrapper);
            this.container.appendChild(this.menu);

            // Insert after original element
            this.element.parentNode.insertBefore(this.container, this.element.nextSibling);

            // Apply initial state
            if (this.options.disabled) {
                this.disable();
            }
        }

        parseOptions() {
            this.options.data = this.options.data || [];

            // Parse from data-options attribute if exists
            if (this.element.dataset.options) {
                try {
                    const dataOptions = JSON.parse(this.element.dataset.options);
                    this.options.data = [...this.options.data, ...dataOptions];
                } catch (e) {
                    console.warn('Invalid JSON in data-options attribute');
                }
            }

            this.filteredOptions = [...this.options.data];
        }

        bindEvents() {
            // Input events
            this.input.addEventListener('input', this.handleInput.bind(this));
            this.input.addEventListener('focus', this.handleFocus.bind(this));
            this.input.addEventListener('blur', this.handleBlur.bind(this));
            this.input.addEventListener('keydown', this.handleKeydown.bind(this));

            // Arrow click
            this.arrow.addEventListener('click', this.handleArrowClick.bind(this));

            // Option clicks
            this.optionsList.addEventListener('click', this.handleOptionClick.bind(this));

            // Outside click
            document.addEventListener('click', this.handleOutsideClick.bind(this));
        }

        handleInput(e) {
            const value = e.target.value;
            this.searchTerm = value;
            this.customValue = value;

            // Filter options based on input
            this.filterOptions(value);

            // Show dropdown if not open
            if (!this.isOpen) {
                this.open();
            }

            // Reset highlighted index
            this.highlightedIndex = -1;
            this.updateHighlight();
        }

        handleFocus() {
            if (!this.options.disabled) {
                this.open();
            }
        }

        handleBlur(e) {
            // Delay to allow option click
            setTimeout(() => {
                if (!this.container.contains(document.activeElement)) {
                    this.close();
                    this.handleValueSelection();
                }
            }, 150);
        }

        handleKeydown(e) {
            if (this.options.disabled) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!this.isOpen) {
                        this.open();
                    } else {
                        this.highlightNext();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.isOpen) {
                        this.highlightPrevious();
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.isOpen && this.highlightedIndex >= 0) {
                        this.selectOption(this.filteredOptions[this.highlightedIndex]);
                    } else if (this.options.allowCustomValue && this.customValue) {
                        this.selectCustomValue();
                    }
                    break;
                case 'Escape':
                    this.close();
                    break;
            }
        }

        handleArrowClick(e) {
            e.preventDefault();
            if (this.options.disabled) return;

            if (this.isOpen) {
                this.close();
            } else {
                this.open();
                this.input.focus();
            }
        }

        handleOptionClick(e) {
            const optionElement = e.target.closest('.uk-input-option');
            if (optionElement) {
                const index = parseInt(optionElement.dataset.index);
                const option = this.filteredOptions[index];
                if (option && !option.disabled) {
                    this.selectOption(option);
                }
            }
        }

        handleOutsideClick(e) {
            if (!this.container.contains(e.target)) {
                this.close();
                this.handleValueSelection();
            }
        }

        handleValueSelection() {
            // If input has value but no option selected, handle custom value
            if (this.options.allowCustomValue && this.customValue && !this.selectedValues) {
                this.selectCustomValue();
            }
        }

        filterOptions(searchTerm) {
            if (!searchTerm) {
                this.filteredOptions = [...this.options.data];
            } else {
                const term = VietnameseUtils.removeAccents(searchTerm.toLowerCase());
                this.filteredOptions = this.options.data.filter(option => {
                    const text = VietnameseUtils.removeAccents(option.text.toLowerCase());
                    const value = VietnameseUtils.removeAccents(option.value.toLowerCase());
                    return text.includes(term) || value.includes(term);
                });
            }

            this.renderOptions();
        }

        renderOptions() {
            this.optionsList.innerHTML = '';

            if (this.filteredOptions.length === 0) {
                const noResults = Utils.createElement('div', 'uk-input-no-results');
                noResults.textContent = this.options.noResultsText;
                this.optionsList.appendChild(noResults);
                return;
            }

            this.filteredOptions.forEach((option, index) => {
                const optionElement = Utils.createElement('div', 'uk-input-option');
                optionElement.dataset.index = index;
                optionElement.textContent = option.text;

                if (option.disabled) {
                    optionElement.classList.add('uk-disabled');
                }

                this.optionsList.appendChild(optionElement);
            });
        }

        highlightNext() {
            if (this.filteredOptions.length === 0) return;

            this.highlightedIndex = Math.min(
                this.highlightedIndex + 1,
                this.filteredOptions.length - 1
            );
            this.updateHighlight();
        }

        highlightPrevious() {
            if (this.filteredOptions.length === 0) return;

            this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
            this.updateHighlight();
        }

        updateHighlight() {
            const options = this.optionsList.querySelectorAll('.uk-input-option');
            options.forEach((option, index) => {
                option.classList.toggle('uk-highlighted', index === this.highlightedIndex);
            });
        }

        selectOption(option) {
            if (option.disabled) return;

            this.selectedValues = option.value;
            this.input.value = option.text;
            this.customValue = option.text;

            // Update original element
            this.element.value = option.value;

            // Trigger change event
            this.element.dispatchEvent(new Event('change', { bubbles: true }));

            // Custom event
            this.element.dispatchEvent(new CustomEvent('lbm:input-change', {
                detail: { value: option.value, text: option.text, option }
            }));

            this.close();
        }

        selectCustomValue() {
            if (!this.options.allowCustomValue || !this.customValue) return;

            this.selectedValues = this.customValue;
            this.input.value = this.customValue;

            // Update original element
            this.element.value = this.customValue;

            // Trigger change event
            this.element.dispatchEvent(new Event('change', { bubbles: true }));

            // Custom event
            this.element.dispatchEvent(new CustomEvent('lbm:input-change', {
                detail: { value: this.customValue, text: this.customValue, isCustom: true }
            }));

            this.close();
        }

        open() {
            if (this.isOpen || this.options.disabled) return;

            this.isOpen = true;
            this.container.classList.add('uk-open');
            this.input.setAttribute('aria-expanded', 'true');

            // Render options
            this.renderOptions();

            // Position dropdown
            this.positionDropdown();
        }

        close() {
            if (!this.isOpen) return;

            this.isOpen = false;
            this.container.classList.remove('uk-open');
            this.input.setAttribute('aria-expanded', 'false');
            this.highlightedIndex = -1;
        }

        positionDropdown() {
            const rect = this.inputWrapper.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < this.options.maxHeight && spaceAbove > spaceBelow) {
                this.menu.classList.add('uk-dropdown-up');
            } else {
                this.menu.classList.remove('uk-dropdown-up');
            }
        }

        // Public API methods
        getValue() {
            return this.selectedValues;
        }

        setValue(value) {
            // Find option by value
            const option = this.options.data.find(opt => opt.value === value);
            if (option) {
                this.selectOption(option);
            } else if (this.options.allowCustomValue) {
                this.customValue = value;
                this.input.value = value;
                this.element.value = value;
                this.selectedValues = value;
            }
        }

        clear() {
            this.selectedValues = this.options.multiple ? [] : null;
            this.input.value = '';
            this.customValue = '';
            this.element.value = '';
            this.searchTerm = '';
            this.updateDisplay();
        }

        updateDisplay() {
            // Update input placeholder
            if (!this.input.value) {
                this.input.placeholder = this.options.placeholder;
            }
        }

        enable() {
            this.options.disabled = false;
            this.container.classList.remove('uk-input-disabled');
            this.input.disabled = false;
        }

        disable() {
            this.options.disabled = true;
            this.container.classList.add('uk-input-disabled');
            this.input.disabled = true;
            this.close();
        }

        destroy() {
            // Remove event listeners
            if (this.input) {
                this.input.removeEventListener('input', this.handleInput.bind(this));
                this.input.removeEventListener('focus', this.handleFocus.bind(this));
                this.input.removeEventListener('blur', this.handleBlur.bind(this));
                this.input.removeEventListener('keydown', this.handleKeydown.bind(this));
            }

            if (this.arrow) {
                this.arrow.removeEventListener('click', this.handleArrowClick.bind(this));
            }

            if (this.optionsList) {
                this.optionsList.removeEventListener('click', this.handleOptionClick.bind(this));
            }

            document.removeEventListener('click', this.handleOutsideClick.bind(this));

            // Remove DOM elements
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }

            // Show original element
            this.element.style.display = '';

            // Clear reference
            this.element._ukInputDropdown = null;
        }

        // Data loading methods (similar to SelectDropdown)
        loadFromJSON(data, config = {}) {
            const defaultConfig = {
                valueKey: 'value',
                textKey: 'text',
                disabledKey: 'disabled',
                clearExisting: true
            };

            const finalConfig = { ...defaultConfig, ...config };

            try {
                if (finalConfig.clearExisting) {
                    this.options.data = [];
                }

                const processedData = data.map(item => {
                    if (typeof item === 'string') {
                        return { value: item, text: item };
                    }

                    return {
                        value: item[finalConfig.valueKey] || item.value || '',
                        text: item[finalConfig.textKey] || item.text || item[finalConfig.valueKey] || '',
                        disabled: item[finalConfig.disabledKey] || false
                    };
                });

                this.options.data = [...this.options.data, ...processedData];
                this.filteredOptions = [...this.options.data];

                // Emit success event
                this.element.dispatchEvent(new CustomEvent('lbm:options-loaded', {
                    detail: { data: processedData, config: finalConfig }
                }));

            } catch (error) {
                console.error('Error loading JSON data:', error);
                this.element.dispatchEvent(new CustomEvent('lbm:options-error', {
                    detail: { error: error.message, type: 'json' }
                }));
            }
        }

        async loadFromAPI(url, config = {}) {
            const defaultConfig = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                dataPath: '',
                valueKey: 'value',
                textKey: 'text',
                disabledKey: 'disabled',
                clearExisting: true,
                showLoading: true,
                loadingText: this.options.loadingText
            };

            const finalConfig = { ...defaultConfig, ...config };

            try {
                if (finalConfig.showLoading) {
                    this.showLoadingState(finalConfig.loadingText);
                }

                const response = await fetch(url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.body
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                let data = await response.json();

                // Extract data from nested path if specified
                if (finalConfig.dataPath) {
                    const pathParts = finalConfig.dataPath.split('.');
                    for (const part of pathParts) {
                        data = data[part];
                        if (data === undefined) {
                            throw new Error(`Data path '${finalConfig.dataPath}' not found in response`);
                        }
                    }
                }

                if (!Array.isArray(data)) {
                    throw new Error('API response data must be an array');
                }

                this.hideLoadingState();
                this.loadFromJSON(data, finalConfig);

            } catch (error) {
                console.error('Error loading API data:', error);
                this.hideLoadingState();
                this.showErrorState(error.message);

                this.element.dispatchEvent(new CustomEvent('lbm:options-error', {
                    detail: { error: error.message, type: 'api', url }
                }));
            }
        }

        showLoadingState(text = this.options.loadingText) {
            this.optionsList.innerHTML = `<div class="uk-input-loading">${text}</div>`;
            this.container.classList.add('uk-loading');
        }

        hideLoadingState() {
            this.container.classList.remove('uk-loading');
        }

        showErrorState(message) {
            this.optionsList.innerHTML = `<div class="uk-input-error">Lỗi: ${message}</div>`;
            this.container.classList.add('uk-error');
        }

        // Clear error state
        clearErrorState() {
            this.container.classList.remove('uk-error');
        }

        // Static method to get instance from element
        static getInstance(element) {
            return element._ukInputDropdown || null;
        }

        // Static method to initialize all input dropdowns
        static initAll() {
            // Initialize dropdowns with uk-input-dropdown class (support Bootstrap form-control)
            document.querySelectorAll('input[class*="uk-input-dropdown"]').forEach(input => {
                if (!input._ukInputDropdown) {
                    const options = {};

                    // Read data attributes
                    if (input.dataset.placeholder) {
                        options.placeholder = input.dataset.placeholder;
                    }
                    if (input.dataset.searchable !== undefined) {
                        options.searchable = input.dataset.searchable === 'true';
                    }
                    if (input.dataset.multiple !== undefined) {
                        options.multiple = input.dataset.multiple === 'true';
                    }
                    if (input.dataset.allowCustomValue !== undefined) {
                        options.allowCustomValue = input.dataset.allowCustomValue === 'true';
                    }
                    if (input.hasAttribute('disabled')) {
                        options.disabled = true;
                    }
                    if (input.hasAttribute('required')) {
                        options.required = true;
                    }

                    input._ukInputDropdown = new InputDropdown(input, options);
                }
            });
        }
    }

    // ================================================
    // THEME SWITCHER
    // ================================================

    class ThemeSwitcher {
        constructor() {
            this.currentTheme = localStorage.getItem('theme') || 'light';
            this.init();
        }

        init() {
            this.applyTheme(this.currentTheme);
            this.bindEvents();
        }

        bindEvents() {
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-uk-theme-toggle]')) {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }

        toggle() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
        }

        applyTheme(theme) {
            // Cập nhật cả data-theme cho LBM UI Kit và data-bs-theme cho Bootstrap
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-bs-theme', theme);

            // Update theme toggle buttons
            document.querySelectorAll('[data-uk-theme-toggle]').forEach(btn => {
                const icon = btn.querySelector('i, .icon');
                if (icon) {
                    if (theme === 'dark') {
                        icon.className = 'fas fa-sun';
                    } else {
                        icon.className = 'fas fa-moon';
                    }
                }
            });
        }
    }



    // ================================================
    // MAIN LBM OBJECT
    // ================================================

    // Global theme switcher instance
    const globalThemeSwitcher = new ThemeSwitcher();

    const LBM = {
        // Components
        Modal,
        Toast,
        Alert,
        Confirm,
        Accordion,
        Carousel,
        SelectDropdown,
        InputDropdown,
        ThemeSwitcher,

        // Theme API
        Theme: globalThemeSwitcher,

        // Utilities
        Utils,
        VietnameseUtils,

        // Initialize all components
        init: function () {
            // Theme switcher already initialized globally

            // Initialize accordions
            Accordion.initAll();

            // Initialize select dropdowns
            SelectDropdown.initAll();

            // Initialize input dropdowns
            InputDropdown.initAll();

            // Initialize modals
            document.querySelectorAll('.uk-modal').forEach(modalElement => {
                const modalDialog = modalElement.querySelector('.uk-modal-dialog');
                if (modalDialog) {
                    new Modal(modalDialog);
                }
            });

            // Initialize alerts
            document.querySelectorAll('.uk-alert').forEach(alertElement => {
                new Alert(alertElement);
            });

            // Initialize carousels
            document.querySelectorAll('.uk-carousel').forEach(carouselElement => {
                new Carousel(carouselElement);
            });



            // Modal trigger buttons
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-uk-modal]')) {
                    e.preventDefault();
                    const target = e.target.getAttribute('data-uk-modal');
                    const modal = document.querySelector(target);
                    if (modal) {
                        const modalDialog = modal.querySelector('.uk-modal-dialog');
                        if (modalDialog && modalDialog._lbmModal) {
                            modalDialog._lbmModal.show();
                        }
                    }
                }
            });
        }
    };

    // Auto-initialize when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => LBM.init());
        } else {
            LBM.init();
        }
    }

    return LBM;

})));


