/*!
 * LBM API Client v2.0.0
 * Advanced RESTful API Client with comprehensive features
 * 
 * Features:
 * - Auto-cookie handling for authentication
 * - Comprehensive error handling with user-friendly messages
 * - Request/Response interceptors
 * - Automatic retry mechanism with exponential backoff
 * - File upload with progress tracking
 * - Request caching
 * - Loading state management
 * - CSRF token auto-handling
 * - Request timeout management
 * - Response type auto-detection
 * - Integration with LBM UI Kit toasts
 * 
 * Author: LBM Team
 * Date: 2025-08-17
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.LBMApiClient = factory());
}(this, (function () {
    'use strict';

    // ================================================
    // UTILITIES & HELPERS
    // ================================================

    const Utils = {
        // Generate unique request ID
        generateRequestId: function() {
            return 'req-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        },

        // Deep merge objects
        deepMerge: function(target, source) {
            const result = { ...target };
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            return result;
        },

        // Check if value is empty
        isEmpty: function(value) {
            return value === null || value === undefined || value === '';
        },

        // Format file size
        formatFileSize: function(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        // Validate email
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Validate URL
        isValidUrl: function(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        // Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // ================================================
    // CUSTOM ERROR CLASSES
    // ================================================

    class ApiError extends Error {
        constructor(message, status = 0, data = null, requestId = null) {
            super(message);
            this.name = 'ApiError';
            this.status = status;
            this.data = data;
            this.requestId = requestId;
            this.timestamp = new Date().toISOString();
        }

        toString() {
            return `${this.name}: ${this.message} (Status: ${this.status}, Request: ${this.requestId})`;
        }
    }

    class NetworkError extends ApiError {
        constructor(message, requestId = null) {
            super(message, 0, null, requestId);
            this.name = 'NetworkError';
        }
    }

    class TimeoutError extends ApiError {
        constructor(message, requestId = null) {
            super(message, 408, null, requestId);
            this.name = 'TimeoutError';
        }
    }

    class ValidationError extends ApiError {
        constructor(message, errors = {}, requestId = null) {
            super(message, 422, errors, requestId);
            this.name = 'ValidationError';
            this.errors = errors;
        }
    }

    // ================================================
    // REQUEST CACHE
    // ================================================

    class RequestCache {
        constructor(maxSize = 100, ttl = 300000) { // 5 minutes default TTL
            this.cache = new Map();
            this.maxSize = maxSize;
            this.ttl = ttl;
        }

        generateKey(url, method, params) {
            return `${method}:${url}:${JSON.stringify(params)}`;
        }

        get(key) {
            const item = this.cache.get(key);
            if (!item) return null;

            if (Date.now() > item.expiry) {
                this.cache.delete(key);
                return null;
            }

            return item.data;
        }

        set(key, data) {
            // Remove oldest items if cache is full
            if (this.cache.size >= this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            this.cache.set(key, {
                data: data,
                expiry: Date.now() + this.ttl
            });
        }

        clear() {
            this.cache.clear();
        }

        delete(key) {
            this.cache.delete(key);
        }
    }

    // ================================================
    // LOADING STATE MANAGER
    // ================================================

    class LoadingManager {
        constructor() {
            this.loadingRequests = new Set();
            this.callbacks = new Set();
        }

        addRequest(requestId) {
            this.loadingRequests.add(requestId);
            this.notifyCallbacks(true);
        }

        removeRequest(requestId) {
            this.loadingRequests.delete(requestId);
            if (this.loadingRequests.size === 0) {
                this.notifyCallbacks(false);
            }
        }

        isLoading() {
            return this.loadingRequests.size > 0;
        }

        onLoadingChange(callback) {
            this.callbacks.add(callback);
            return () => this.callbacks.delete(callback);
        }

        notifyCallbacks(isLoading) {
            this.callbacks.forEach(callback => {
                try {
                    callback(isLoading, this.loadingRequests.size);
                } catch (error) {
                    console.error('Loading callback error:', error);
                }
            });
        }
    }

    // ================================================
    // MAIN API CLIENT CLASS
    // ================================================

    class LBMApiClient {
        constructor(options = {}) {
            // Configuration
            this.config = Utils.deepMerge({
                baseURL: '',
                timeout: 30000,
                showToasts: true,
                autoRetry: true,
                maxRetries: 3,
                retryDelay: 1000,
                enableCache: false,
                cacheSize: 100,
                cacheTTL: 300000, // 5 minutes
                enableLoading: true,
                validateStatus: (status) => status >= 200 && status < 300,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }, options);

            // Internal state
            this.requestInterceptors = [];
            this.responseInterceptors = [];
            this.errorInterceptors = [];
            
            // Managers
            this.cache = new RequestCache(this.config.cacheSize, this.config.cacheTTL);
            this.loadingManager = new LoadingManager();
            
            // Initialize
            this.init();
        }

        init() {
            this.setupCSRFToken();
            this.setupDefaultInterceptors();
        }

        // ================================================
        // SETUP METHODS
        // ================================================

        setupCSRFToken() {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                this.config.headers['X-CSRF-TOKEN'] = csrfToken;
            }
        }

        setupDefaultInterceptors() {
            // Request interceptor for logging
            this.addRequestInterceptor((config) => {
                if (this.config.debug) {
                    console.log(`[API] ${config.method} ${config.url}`, config);
                }
                return config;
            });

            // Response interceptor for logging
            this.addResponseInterceptor((response, config) => {
                if (this.config.debug) {
                    console.log(`[API] Response ${config.method} ${config.url}`, response);
                }
                return response;
            });

            // Error interceptor for authentication
            this.addErrorInterceptor((error) => {
                if (error.status === 401) {
                    this.handleAuthenticationError();
                }
                return error;
            });
        }

        handleAuthenticationError() {
            if (this.config.showToasts) {
                this.showToast('Phiên đăng nhập đã hết hạn. Đang chuyển hướng...', 'warning');
            }

            // Redirect to login after delay
            setTimeout(() => {
                const loginUrl = this.config.loginUrl || '/login';
                window.location.href = loginUrl;
            }, 2000);
        }

        // ================================================
        // INTERCEPTOR METHODS
        // ================================================

        addRequestInterceptor(interceptor) {
            this.requestInterceptors.push(interceptor);
            return () => {
                const index = this.requestInterceptors.indexOf(interceptor);
                if (index > -1) {
                    this.requestInterceptors.splice(index, 1);
                }
            };
        }

        addResponseInterceptor(interceptor) {
            this.responseInterceptors.push(interceptor);
            return () => {
                const index = this.responseInterceptors.indexOf(interceptor);
                if (index > -1) {
                    this.responseInterceptors.splice(index, 1);
                }
            };
        }

        addErrorInterceptor(interceptor) {
            this.errorInterceptors.push(interceptor);
            return () => {
                const index = this.errorInterceptors.indexOf(interceptor);
                if (index > -1) {
                    this.errorInterceptors.splice(index, 1);
                }
            };
        }

        // ================================================
        // CORE REQUEST METHOD
        // ================================================

        async request(url, options = {}) {
            const requestId = Utils.generateRequestId();
            
            // Prepare request config
            let config = Utils.deepMerge({
                method: 'GET',
                headers: { ...this.config.headers },
                credentials: 'include', // Always include cookies
                cache: false,
                timeout: this.config.timeout
            }, options);

            config.url = this.buildUrl(url);
            config.requestId = requestId;

            try {
                // Apply request interceptors
                for (const interceptor of this.requestInterceptors) {
                    config = await interceptor(config) || config;
                }

                // Check cache for GET requests
                if (config.method === 'GET' && this.config.enableCache && config.cache !== false) {
                    const cacheKey = this.cache.generateKey(config.url, config.method, config.params);
                    const cachedResponse = this.cache.get(cacheKey);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                }

                // Start loading
                if (this.config.enableLoading) {
                    this.loadingManager.addRequest(requestId);
                }

                // Execute request with retry logic
                const response = await this.executeRequestWithRetry(config);

                // Cache GET responses
                if (config.method === 'GET' && this.config.enableCache && config.cache !== false) {
                    const cacheKey = this.cache.generateKey(config.url, config.method, config.params);
                    this.cache.set(cacheKey, response);
                }

                return response;

            } catch (error) {
                // Apply error interceptors
                let processedError = error;
                for (const interceptor of this.errorInterceptors) {
                    processedError = await interceptor(processedError) || processedError;
                }

                throw processedError;

            } finally {
                // Stop loading
                if (this.config.enableLoading) {
                    this.loadingManager.removeRequest(requestId);
                }
            }
        }

        async executeRequestWithRetry(config) {
            let lastError;
            const maxAttempts = this.config.autoRetry ? this.config.maxRetries + 1 : 1;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                try {
                    const response = await this.executeRequest(config, attempt);
                    return response;

                } catch (error) {
                    lastError = error;

                    // Don't retry on certain errors
                    if (!this.shouldRetry(error, attempt, maxAttempts)) {
                        break;
                    }

                    // Wait before retry with exponential backoff
                    if (attempt < maxAttempts - 1) {
                        const delay = this.config.retryDelay * Math.pow(2, attempt);
                        await this.delay(delay);
                    }
                }
            }

            throw lastError;
        }

        async executeRequest(config, attempt) {
            // Setup timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);

            try {
                // Prepare fetch options
                const fetchOptions = {
                    method: config.method,
                    headers: config.headers,
                    credentials: config.credentials,
                    signal: controller.signal
                };

                // Add body for non-GET requests
                if (config.body && config.method !== 'GET') {
                    fetchOptions.body = this.prepareRequestBody(config.body, config.headers);
                }

                // Execute fetch
                const response = await fetch(config.url, fetchOptions);
                clearTimeout(timeoutId);

                // Apply response interceptors
                let processedResponse = response;
                for (const interceptor of this.responseInterceptors) {
                    processedResponse = await interceptor(processedResponse, config) || processedResponse;
                }

                // Check if response is successful
                if (!this.config.validateStatus(processedResponse.status)) {
                    await this.handleHttpError(processedResponse, config, attempt);
                }

                // Parse and return response
                return await this.parseResponse(processedResponse);

            } catch (error) {
                clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    const timeoutError = new TimeoutError(
                        `Request timeout after ${config.timeout}ms`,
                        config.requestId
                    );
                    
                    if (this.config.showToasts && attempt === this.config.maxRetries) {
                        this.showToast('Yêu cầu quá thời gian chờ. Vui lòng thử lại.', 'error');
                    }
                    
                    throw timeoutError;
                }

                // Network error
                const networkError = new NetworkError(
                    `Network error: ${error.message}`,
                    config.requestId
                );

                if (this.config.showToasts && attempt === this.config.maxRetries) {
                    this.showToast('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.', 'error');
                }

                throw networkError;
            }
        }


        // ================================================
        // HTTP ERROR HANDLING
        // ================================================

        async handleHttpError(response, config, attempt) {
            let errorData = null;
            let errorMessage = this.getStatusMessage(response.status);

            try {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } else {
                    errorData = await response.text();
                }
            } catch (e) {
                // If we can't parse the error response, use the default message
            }

            // Create appropriate error type
            let error;
            if (response.status === 422) {
                error = new ValidationError(
                    errorMessage,
                    errorData?.errors || errorData,
                    config.requestId
                );
            } else {
                error = new ApiError(
                    errorMessage,
                    response.status,
                    errorData,
                    config.requestId
                );
            }

            // Show toast only on final attempt
            if (this.config.showToasts && attempt === this.config.maxRetries) {
                this.showToast(errorMessage, this.getToastType(response.status));
            }

            throw error;
        }

        getStatusMessage(status) {
            const messages = {
                400: 'Dữ liệu không hợp lệ',
                401: 'Vui lòng đăng nhập để tiếp tục',
                403: 'Bạn không có quyền thực hiện thao tác này',
                404: 'Không tìm thấy tài nguyên yêu cầu',
                409: 'Xung đột dữ liệu. Vui lòng làm mới trang và thử lại',
                422: 'Dữ liệu đầu vào không hợp lệ',
                429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
                500: 'Lỗi máy chủ nội bộ',
                502: 'Máy chủ tạm thời không khả dụng',
                503: 'Dịch vụ tạm thời không khả dụng',
                504: 'Máy chủ quá thời gian chờ'
            };

            return messages[status] || `Lỗi HTTP ${status}`;
        }

        getToastType(status) {
            if (status >= 500) return 'error';
            if (status === 429) return 'warning';
            if (status === 401 || status === 403) return 'warning';
            return 'error';
        }

        shouldRetry(error, attempt, maxAttempts) {
            // Don't retry if we've reached max attempts
            if (attempt >= maxAttempts - 1) return false;

            // Don't retry client errors (except specific ones)
            if (error.status >= 400 && error.status < 500) {
                return [408, 429].includes(error.status);
            }

            // Retry server errors and network errors
            return error.status >= 500 || error instanceof NetworkError || error instanceof TimeoutError;
        }

        // ================================================
        // UTILITY METHODS
        // ================================================

        buildUrl(url) {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            
            const baseURL = this.config.baseURL.replace(/\/$/, '');
            const path = url.startsWith('/') ? url : `/${url}`;
            return `${baseURL}${path}`;
        }

        prepareRequestBody(body, headers) {
            if (body instanceof FormData) {
                // Remove Content-Type header for FormData to let browser set boundary
                delete headers['Content-Type'];
                return body;
            }

            if (body instanceof Blob || body instanceof File) {
                return body;
            }

            if (typeof body === 'string') {
                return body;
            }

            // Default to JSON
            return JSON.stringify(body);
        }

        async parseResponse(response) {
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/json')) {
                return await response.json();
            }

            if (contentType.includes('text/')) {
                return await response.text();
            }

            if (contentType.includes('application/octet-stream') ||
                contentType.includes('application/pdf') ||
                contentType.includes('image/') ||
                contentType.includes('video/') ||
                contentType.includes('audio/')) {
                return await response.blob();
            }

            // Default to text
            return await response.text();
        }

        showToast(message, type = 'info') {
            // Try LBM UI Kit first
            if (typeof window.LBM !== 'undefined' && window.LBM.toast) {
                window.LBM.toast.show(message, { type });
                return;
            }

            // Fallback to legacy ukToast
            if (typeof window.ukToast === 'function') {
                window.ukToast(message, type, 5000);
                return;
            }

            // Console fallback
            console.log(`[${type.toUpperCase()}] ${message}`);
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // ================================================
        // HTTP METHODS
        // ================================================

        async get(url, params = {}, options = {}) {
            const queryString = this.buildQueryString(params);
            const fullUrl = queryString ? `${url}?${queryString}` : url;

            return this.request(fullUrl, {
                method: 'GET',
                ...options
            });
        }

        async post(url, data = {}, options = {}) {
            return this.request(url, {
                method: 'POST',
                body: data,
                ...options
            });
        }

        async put(url, data = {}, options = {}) {
            return this.request(url, {
                method: 'PUT',
                body: data,
                ...options
            });
        }

        async patch(url, data = {}, options = {}) {
            return this.request(url, {
                method: 'PATCH',
                body: data,
                ...options
            });
        }

        async delete(url, options = {}) {
            return this.request(url, {
                method: 'DELETE',
                ...options
            });
        }

        buildQueryString(params) {
            const searchParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (!Utils.isEmpty(value)) {
                    if (Array.isArray(value)) {
                        value.forEach(item => searchParams.append(`${key}[]`, item));
                    } else {
                        searchParams.append(key, value);
                    }
                }
            });

            return searchParams.toString();
        }

        // ================================================
        // FILE UPLOAD METHODS
        // ================================================

        async upload(url, file, options = {}) {
            const {
                fieldName = 'file',
                additionalData = {},
                onProgress = null,
                validateFile = true,
                maxSize = 10 * 1024 * 1024, // 10MB default
                allowedTypes = null,
                ...requestOptions
            } = options;

            // Validate file if enabled
            if (validateFile) {
                this.validateFile(file, { maxSize, allowedTypes });
            }

            // Create FormData
            const formData = new FormData();
            formData.append(fieldName, file);

            // Add additional data
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });

            // Use XMLHttpRequest for progress tracking
            if (onProgress) {
                return this.uploadWithProgress(url, formData, onProgress, requestOptions);
            }

            // Use regular fetch for simple uploads
            return this.request(url, {
                method: 'POST',
                body: formData,
                ...requestOptions
            });
        }

        validateFile(file, options = {}) {
            const { maxSize, allowedTypes } = options;

            if (!file || !(file instanceof File)) {
                throw new ValidationError('Invalid file provided');
            }

            if (maxSize && file.size > maxSize) {
                throw new ValidationError(
                    `File size (${Utils.formatFileSize(file.size)}) exceeds maximum allowed size (${Utils.formatFileSize(maxSize)})`
                );
            }

            if (allowedTypes && !allowedTypes.includes(file.type)) {
                throw new ValidationError(
                    `File type (${file.type}) is not allowed. Allowed types: ${allowedTypes.join(', ')}`
                );
            }
        }

        async uploadWithProgress(url, formData, onProgress, options = {}) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                const requestId = Utils.generateRequestId();

                // Setup progress tracking
                if (xhr.upload && onProgress) {
                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            const percentComplete = (e.loaded / e.total) * 100;
                            onProgress({
                                loaded: e.loaded,
                                total: e.total,
                                percentage: percentComplete,
                                speed: this.calculateUploadSpeed(e.loaded),
                                remainingTime: this.calculateRemainingTime(e.loaded, e.total)
                            });
                        }
                    });
                }

                // Setup response handlers
                xhr.addEventListener('load', async () => {
                    try {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const response = await this.parseXHRResponse(xhr);
                            resolve(response);
                        } else {
                            const error = new ApiError(
                                this.getStatusMessage(xhr.status),
                                xhr.status,
                                xhr.responseText,
                                requestId
                            );
                            
                            if (this.config.showToasts) {
                                this.showToast('Tải file lên thất bại. Vui lòng thử lại.', 'error');
                            }
                            
                            reject(error);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                xhr.addEventListener('error', () => {
                    const error = new NetworkError('Upload network error', requestId);
                    if (this.config.showToasts) {
                        this.showToast('Lỗi mạng khi tải file lên.', 'error');
                    }
                    reject(error);
                });

                xhr.addEventListener('timeout', () => {
                    const error = new TimeoutError('Upload timeout', requestId);
                    if (this.config.showToasts) {
                        this.showToast('Tải file lên quá thời gian chờ.', 'error');
                    }
                    reject(error);
                });

                // Setup request
                const fullUrl = this.buildUrl(url);
                xhr.open('POST', fullUrl);

                // Set headers (exclude Content-Type for FormData)
                Object.keys(this.config.headers).forEach(key => {
                    if (key !== 'Content-Type') {
                        xhr.setRequestHeader(key, this.config.headers[key]);
                    }
                });

                // Set timeout and credentials
                xhr.timeout = options.timeout || this.config.timeout;
                xhr.withCredentials = true;

                // Start loading tracking
                if (this.config.enableLoading) {
                    this.loadingManager.addRequest(requestId);
                }

                // Send request
                xhr.send(formData);

                // Cleanup on completion
                const cleanup = () => {
                    if (this.config.enableLoading) {
                        this.loadingManager.removeRequest(requestId);
                    }
                };

                xhr.addEventListener('loadend', cleanup);
            });
        }

        async parseXHRResponse(xhr) {
            const contentType = xhr.getResponseHeader('content-type') || '';
            
            if (contentType.includes('application/json')) {
                return JSON.parse(xhr.responseText);
            }
            
            return xhr.responseText;
        }

        calculateUploadSpeed(loaded) {
            const now = Date.now();
            if (!this.uploadStartTime) {
                this.uploadStartTime = now;
                return 0;
            }
            
            const elapsed = (now - this.uploadStartTime) / 1000; // seconds
            return elapsed > 0 ? loaded / elapsed : 0; // bytes per second
        }

        calculateRemainingTime(loaded, total) {
            const speed = this.calculateUploadSpeed(loaded);
            if (speed === 0) return Infinity;
            
            const remaining = total - loaded;
            return remaining / speed; // seconds
        }

        // ================================================
        // SPECIALIZED METHODS
        // ================================================

        async uploadImage(url, imageFile, options = {}) {
            const imageOptions = {
                fieldName: 'image',
                allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                maxSize: 5 * 1024 * 1024, // 5MB
                ...options
            };

            return this.upload(url, imageFile, imageOptions);
        }

        async uploadDocument(url, documentFile, options = {}) {
            const documentOptions = {
                fieldName: 'document',
                allowedTypes: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain'
                ],
                maxSize: 20 * 1024 * 1024, // 20MB
                ...options
            };

            return this.upload(url, documentFile, documentOptions);
        }

        async downloadFile(url, filename = null, options = {}) {
            try {
                const response = await this.request(url, {
                    method: 'GET',
                    ...options
                });

                // If response is a blob, trigger download
                if (response instanceof Blob) {
                    this.triggerDownload(response, filename);
                    return { success: true, filename };
                }

                // If response contains download URL
                if (response.downloadUrl) {
                    window.open(response.downloadUrl, '_blank');
                    return response;
                }

                return response;

            } catch (error) {
                if (this.config.showToasts) {
                    this.showToast('Không thể tải file xuống. Vui lòng thử lại.', 'error');
                }
                throw error;
            }
        }

        triggerDownload(blob, filename = null) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `download_${Date.now()}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }

        async convertImageToBase64(file) {
            return new Promise((resolve, reject) => {
                if (!file || !file.type.startsWith('image/')) {
                    reject(new ValidationError('File is not an image'));
                    return;
                }

                const reader = new FileReader();
                
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to read file'));
                
                reader.readAsDataURL(file);
            });
        }

        async convertImagesToBase64(htmlContent) {
            try {
                const response = await this.post('/api/convert-images-to-base64', {
                    content: htmlContent
                });
                
                return response.processedContent || htmlContent;
            } catch (error) {
                console.warn('Failed to convert images to base64:', error.message);
                return htmlContent;
            }
        }

        // ================================================
        // BATCH OPERATIONS
        // ================================================

        async batch(requests, options = {}) {
            const {
                concurrent = 3,
                failFast = false,
                onProgress = null
            } = options;

            const results = [];
            const errors = [];
            let completed = 0;

            // Process requests in batches
            for (let i = 0; i < requests.length; i += concurrent) {
                const batch = requests.slice(i, i + concurrent);
                
                const batchPromises = batch.map(async (request, index) => {
                    try {
                        const result = await this.request(request.url, request.options);
                        results[i + index] = { success: true, data: result };
                    } catch (error) {
                        const errorResult = { success: false, error };
                        results[i + index] = errorResult;
                        errors.push({ index: i + index, error });

                        if (failFast) {
                            throw error;
                        }
                    } finally {
                        completed++;
                        if (onProgress) {
                            onProgress(completed, requests.length);
                        }
                    }
                });

                await Promise.all(batchPromises);
            }

            return {
                results,
                errors,
                success: errors.length === 0
            };
        }

        // ================================================
        // CONFIGURATION METHODS
        // ================================================

        setBaseURL(baseURL) {
            this.config.baseURL = baseURL;
        }

        setHeader(name, value) {
            this.config.headers[name] = value;
        }

        removeHeader(name) {
            delete this.config.headers[name];
        }

        setTimeout(timeout) {
            this.config.timeout = timeout;
        }

        enableCache(enable = true) {
            this.config.enableCache = enable;
        }

        clearCache() {
            this.cache.clear();
        }

        // ================================================
        // LOADING STATE METHODS
        // ================================================

        isLoading() {
            return this.loadingManager.isLoading();
        }

        onLoadingChange(callback) {
            return this.loadingManager.onLoadingChange(callback);
        }

        // ================================================
        // UTILITY METHODS FOR EXTERNAL USE
        // ================================================

        createFormData(data) {
            const formData = new FormData();
            
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else if (Array.isArray(value)) {
                    value.forEach(item => formData.append(`${key}[]`, item));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            return formData;
        }

        validateEmail(email) {
            return Utils.isValidEmail(email);
        }

        validateUrl(url) {
            return Utils.isValidUrl(url);
        }

        formatFileSize(bytes) {
            return Utils.formatFileSize(bytes);
        }
    }


    // ================================================
    // GLOBAL INSTANCE AND SHORTCUTS
    // ================================================

    // Create default instance
    const defaultApiClient = new LBMApiClient();

    // Global shortcuts for convenience
    const api = {
        // Configuration
        config: (options) => {
            Object.assign(defaultApiClient.config, options);
            defaultApiClient.init();
        },

        setBaseURL: (baseURL) => defaultApiClient.setBaseURL(baseURL),
        setHeader: (name, value) => defaultApiClient.setHeader(name, value),
        setTimeout: (timeout) => defaultApiClient.setTimeout(timeout),

        // HTTP methods
        get: (url, params, options) => defaultApiClient.get(url, params, options),
        post: (url, data, options) => defaultApiClient.post(url, data, options),
        put: (url, data, options) => defaultApiClient.put(url, data, options),
        patch: (url, data, options) => defaultApiClient.patch(url, data, options),
        delete: (url, options) => defaultApiClient.delete(url, options),

        // File operations
        upload: (url, file, options) => defaultApiClient.upload(url, file, options),
        uploadImage: (url, file, options) => defaultApiClient.uploadImage(url, file, options),
        uploadDocument: (url, file, options) => defaultApiClient.uploadDocument(url, file, options),
        download: (url, filename, options) => defaultApiClient.downloadFile(url, filename, options),

        // Utilities
        imageToBase64: (file) => defaultApiClient.convertImageToBase64(file),
        convertImages: (html) => defaultApiClient.convertImagesToBase64(html),
        createFormData: (data) => defaultApiClient.createFormData(data),
        batch: (requests, options) => defaultApiClient.batch(requests, options),

        // State
        isLoading: () => defaultApiClient.isLoading(),
        onLoadingChange: (callback) => defaultApiClient.onLoadingChange(callback),

        // Cache
        clearCache: () => defaultApiClient.clearCache(),

        // Interceptors
        addRequestInterceptor: (interceptor) => defaultApiClient.addRequestInterceptor(interceptor),
        addResponseInterceptor: (interceptor) => defaultApiClient.addResponseInterceptor(interceptor),
        addErrorInterceptor: (interceptor) => defaultApiClient.addErrorInterceptor(interceptor),

        // Create new instance
        create: (options) => new LBMApiClient(options)
    };

    // ================================================
    // EXPORT MODULE
    // ================================================

    // Attach to global object for browser usage
    if (typeof window !== 'undefined') {
        window.LBMApiClient = LBMApiClient;
        window.api = api;

        // Backward compatibility
        window.ApiClient = LBMApiClient;
    }

    // Return for module systems
    return {
        LBMApiClient,
        api,
        ApiError,
        NetworkError,
        TimeoutError,
        ValidationError,
        Utils
    };

})));

/*!
 * LBM API Client v2.0.0 - Usage Examples
 * 
 * // Basic usage
 * api.config({
 *     baseURL: 'https://api.example.com',
 *     showToasts: true
 * });
 * 
 * // Simple requests
 * const users = await api.get('/users');
 * const user = await api.post('/users', { name: 'John', email: 'john@example.com' });
 * 
 * // File upload with progress
 * await api.upload('/upload', file, {
 *     onProgress: (progress) => {
 *         console.log(`Upload: ${progress.percentage}%`);
 *     }
 * });
 * 
 * // Batch requests
 * const results = await api.batch([
 *     { url: '/users/1', options: { method: 'GET' } },
 *     { url: '/users/2', options: { method: 'GET' } }
 * ]);
 * 
 * // Loading state
 * api.onLoadingChange((isLoading, count) => {
 *     console.log(`Loading: ${isLoading}, Active requests: ${count}`);
 * });
 * 
 * // Custom instance
 * const customApi = api.create({
 *     baseURL: 'https://custom-api.com',
 *     timeout: 60000
 * });
 * 
 * // Error handling
 * try {
 *     await api.post('/users', invalidData);
 * } catch (error) {
 *     if (error instanceof ValidationError) {
 *         console.log('Validation errors:', error.errors);
 *     }
 * }
 */

