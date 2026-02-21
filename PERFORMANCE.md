# Performance Optimization Guide

## Overview

IEA Portal is built with performance as a core principle. This document outlines optimization strategies and best practices.

## Performance Metrics

### Target Scores
- **Lighthouse Performance**: 95+
- **Lighthouse Best Practices**: 95+
- **Lighthouse Accessibility**: 95+
- **Lighthouse SEO**: 95+

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Current Optimizations

### 1. Zero Framework Overhead
```javascript
// ❌ Avoid
import React from 'react';
import Vue from 'vue';

// ✅ Use
// Vanilla JavaScript - no runtime overhead
```

**Benefit**: ~50% smaller bundle size

### 2. CSS Grid/Flexbox Only
```css
/* ❌ Avoid */
float: left;
position: absolute;

/* ✅ Use */
display: grid;
display: flex;
```

**Benefit**: Better browser optimization, faster layout

### 3. Lazy Loading for Images
```html
<!-- ✅ Native lazy loading -->
<img src="image.jpg" alt="desc" loading="lazy">
```

**Benefit**: Defer off-screen image loading

## Asset Optimization

### Image Guidelines
- Use WebP format when possible
- Compress PNG/JPG files (tinypng.com)
- Serve responsive images with srcset
- Maximum size: 200KB per image

```html
<img 
    src="image.jpg" 
    srcset="image-small.jpg 480w, image-large.jpg 1200w"
    sizes="(max-width: 600px) 100vw, 50vw"
    loading="lazy"
    alt="Description"
>
```

### Font Loading
```css
/* ✅ Font-display swap for faster rendering */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
```

**Benefit**: Text visible immediately while fonts load

### CSS Minification
- Production CSS is already minified
- File size: ~1.6KB total CSS
- Load in head for faster rendering

### JavaScript Splitting
- Separate calculator logic into `calculate.js`
- Load only when needed
- Use `async` for non-critical scripts

## Network Optimization

### Service Worker Caching
- Static assets cached on first load
- API responses cached with network-first strategy
- Offline support via cache fallback

```javascript
// Service Worker handles caching automatically
// See sw.js for details
```

### Compression
- All text files should be gzip compressed
- HTTP/2 Server Push recommended
- CDN deployment for faster delivery

### API Response Caching
```javascript
// Cache API responses for 1 hour
const CACHE_DURATION = 3600000;
const cachedData = {}; // Store with timestamp

function getCachedData(key) {
    if (cachedData[key] && Date.now() - cachedData[key].time < CACHE_DURATION) {
        return cachedData[key].data;
    }
    return null;
}
```

## Runtime Performance

### Minimize DOM Operations
```javascript
// ❌ Causes layout thrashing
for (let i = 0; i < 100; i++) {
    element.style.width = i + 'px'; // Reflow each iteration
}

// ✅ Batch DOM operations
element.style.width = '100px'; // Single reflow
```

### Event Delegation
```javascript
// ❌ Listen on every element
document.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', handler);
});

// ✅ Listen on parent
document.querySelector('.list').addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
        handler(e.target);
    }
});
```

### Debounce/Throttle Heavy Operations
```javascript
// Prevent excessive function calls
function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Usage
window.addEventListener('resize', debounce(() => {
    console.log('Resized');
}, 300));
```

## Memory Management

### Avoid Memory Leaks
```javascript
// ❌ Keep references alive indefinitely
const largeData = new Array(1000000).fill('data');

// ✅ Clean up when done
let largeData = new Array(1000000).fill('data');
// ... use it ...
largeData = null; // Allow garbage collection
```

### Event Listener Cleanup
```javascript
// ✅ Always remove listeners
const handler = () => console.log('clicked');
element.addEventListener('click', handler);

// Later...
element.removeEventListener('click', handler);
```

## Testing Performance

### Lighthouse Audit
```bash
# Using Chrome DevTools
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Generate Report
4. Target: 95+ on all metrics
```

### Real Device Testing
- Test on actual mobile devices
- Check performance with 3G network
- Monitor battery usage

### Performance Monitoring
```javascript
// Measure page load time
const perfData = performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
console.log('Page Load Time:', pageLoadTime, 'ms');

// Measure specific operations
const start = performance.now();
// ... your code ...
const end = performance.now();
console.log('Operation took:', end - start, 'ms');
```

## Build & Deployment

### Minification Setup
```bash
# For CSS
npx csso style.css -o style.min.css

# For JS
npx terser script.js -o script.min.js
```

### Gzip Compression
```bash
# On Nginx
gzip on;
gzip_types text/css application/javascript application/json;
gzip_level 6;
```

## Monitoring & Analytics

### Error Rate
- Monitor JavaScript errors
- Track API failures
- Alert on performance degradation

### User Metrics
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- API response times

## Checklist for New Features

- [ ] No new dependencies added
- [ ] Lazy load if off-screen
- [ ] Optimize images (< 200KB)
- [ ] Debounce event handlers if needed
- [ ] Cache data appropriately
- [ ] Test with Lighthouse
- [ ] Verify bundle size increase
- [ ] Check mobile performance
- [ ] Monitor memory usage

## Resources
- [Web Vitals Guide](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

---

**Performance is not a feature, it's a requirement.**
