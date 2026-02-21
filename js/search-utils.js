/**
 * Client-side Search Utility
 * Provides search functionality for articles and data
 */

class SearchEngine {
    constructor(data = []) {
        this.data = data;
        this.index = new Map();
        this.buildIndex();
    }

    /**
     * Build search index
     */
    buildIndex() {
        this.index.clear();
        
        this.data.forEach((item, idx) => {
            const searchableText = (
                item.title + ' ' +
                (item.content || '') + ' ' +
                (item.description || '') + ' ' +
                (item.category || '')
            ).toLowerCase();

            const words = searchableText.match(/\b\w+\b/g) || [];
            words.forEach(word => {
                if (!this.index.has(word)) {
                    this.index.set(word, []);
                }
                this.index.get(word).push(idx);
            });
        });
    }

    /**
     * Search items
     * @param {string} query - Search query
     * @param {number} limit - Max results
     * @returns {Array} Matching items with relevance score
     */
    search(query, limit = 10) {
        if (!query || query.length < 2) return [];

        const searchTerms = query.toLowerCase().match(/\b\w+\b/g) || [];
        const results = new Map(); // itemIndex -> relevanceScore

        // Find all items matching any search term
        searchTerms.forEach(term => {
            const matches = this.index.get(term) || [];
            matches.forEach(idx => {
                const current = results.get(idx) || 0;
                results.set(idx, current + 1);
            });
        });

        // Convert to array and sort by relevance
        return Array.from(results.entries())
            .sort((a, b) => b[1] - a[1]) // Higher score first
            .slice(0, limit)
            .map(([idx, score]) => ({
                ...this.data[idx],
                relevance: score
            }));
    }

    /**
     * Filter by category
     * @param {string} category - Category name
     * @returns {Array} Filtered items
     */
    filterByCategory(category) {
        return this.data.filter(item => 
            item.category?.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Get suggestions for autocomplete
     * @param {string} prefix - Search prefix
     * @param {number} limit - Max suggestions
     * @returns {Array} Suggested queries
     */
    getSuggestions(prefix, limit = 5) {
        if (!prefix || prefix.length < 1) return [];

        const lower = prefix.toLowerCase();
        const suggestions = new Set();

        this.index.forEach((items, word) => {
            if (word.startsWith(lower)) {
                suggestions.add(word);
            }
        });

        return Array.from(suggestions).slice(0, limit);
    }

    /**
     * Add new item to search
     * @param {Object} item - Item to add
     */
    addItem(item) {
        this.data.push(item);
        this.buildIndex(); // Rebuild index
    }

    /**
     * Remove item from search
     * @param {number} id - Item ID
     */
    removeItem(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.buildIndex();
    }

    /**
     * Highlight search terms in text
     * @param {string} text - Text to highlight
     * @param {string} query - Search query
     * @returns {string} HTML with highlights
     */
    highlightMatches(text, query) {
        const terms = query.toLowerCase().match(/\b\w+\b/g) || [];
        
        let result = text;
        terms.forEach(term => {
            const regex = new RegExp(`\\b(${term})\\b`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });
        
        return result;
    }
}

// Example data initialization
const SEARCH_DATA = [
    {
        id: 1,
        title: 'Perubahan Iklim: Kutub Utara Mencair',
        content: 'Data satelit terbaru menunjukkan lapisan es Greenland kehilangan es per jam',
        category: 'Alam',
        url: '/pages/information.html'
    },
    {
        id: 2,
        title: 'AI Google Mampu Deteksi Kanker Payudara',
        content: 'Sistem kecerdasan buatan memiliki akurasi tinggi dalam mendeteksi sel kanker',
        category: 'Medis',
        url: '/pages/information.html'
    },
    {
        id: 3,
        title: 'Teleskop James Webb Temukan Planet Layak Huni',
        content: 'Ditemukan tanda-tanda molekul organik dalam atmosfer planet ekstrasolar',
        category: 'Astronomi',
        url: '/pages/information.html'
    }
    // Add more data as needed
];

// Create global search instance
window.SearchEngine = new SearchEngine(SEARCH_DATA);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchEngine;
}
