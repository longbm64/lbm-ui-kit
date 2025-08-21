/**
 * Search Components Functionality
 * Handles real-time search filtering for components in sidebar
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchComponents');
        const componentsList = document.querySelector('.nav.flex-column.mb-2');
        
        if (!searchInput || !componentsList) {
            return;
        }

        const componentItems = componentsList.querySelectorAll('.nav-item');
        
        // Store original component data for filtering
        const componentsData = Array.from(componentItems).map(item => {
            const link = item.querySelector('.nav-link');
            const text = link ? link.textContent.trim().toLowerCase() : '';
            return {
                element: item,
                text: text,
                visible: true
            };
        });

        /**
         * Filter components based on search query
         * @param {string} query - Search query
         */
        function filterComponents(query) {
            const searchTerm = query.toLowerCase().trim();
            
            componentsData.forEach(component => {
                const isMatch = searchTerm === '' || component.text.includes(searchTerm);
                
                if (isMatch && !component.visible) {
                    component.element.style.display = '';
                    component.visible = true;
                } else if (!isMatch && component.visible) {
                    component.element.style.display = 'none';
                    component.visible = false;
                }
            });

            // Show/hide "no results" message
            showNoResultsMessage(searchTerm !== '' && !componentsData.some(c => c.visible));
        }

        /**
         * Show or hide "no results" message
         * @param {boolean} show - Whether to show the message
         */
        function showNoResultsMessage(show) {
            let noResultsMsg = componentsList.querySelector('.no-results-message');
            
            if (show && !noResultsMsg) {
                noResultsMsg = document.createElement('li');
                noResultsMsg.className = 'nav-item no-results-message';
                noResultsMsg.innerHTML = `
                    <div class="px-3 py-2 text-muted small">
                        <i class="fas fa-search me-2"></i>
                        Không tìm thấy component nào
                    </div>
                `;
                componentsList.appendChild(noResultsMsg);
            } else if (!show && noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        /**
         * Clear search and show all components
         */
        function clearSearch() {
            searchInput.value = '';
            filterComponents('');
        }

        // Event listeners
        searchInput.addEventListener('input', function(e) {
            filterComponents(e.target.value);
        });

        // Clear search on Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                clearSearch();
                searchInput.blur();
            }
        });

        // Focus search with Ctrl+K or Cmd+K
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Add keyboard shortcut hint to placeholder
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcut = isMac ? '⌘K' : 'Ctrl+K';
        searchInput.placeholder = `Tìm kiếm components... (${shortcut})`;
    });
})();