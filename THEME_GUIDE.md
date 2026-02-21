# 🎨 UNIFIED THEME SYSTEM - IMPLEMENTATION GUIDE

## Overview
Semua halaman di Portal IEA sekarang menggunakan **Unified Theme System** yang konsisten, namun tetap mempertahankan fitur masing-masing halaman.

## CSS Load Order (Per Page)
```
1. theme.css              ← Core color system & variables
2. compatibility.css      ← Bridge for old CSS to new variables
3. [page-specific-css]    ← Calculate.css, style.css, etc
4. Inline <style> tags    ← Page-specific overrides
```

## Theme Color Palette

### Primary Colors
- **Purple (Primary)**: `var(--primary)` → `#a855f7`
- **Orange (Secondary)**: `var(--secondary)` → `#f97316`

### Additional Accents
- **Cyan**: `var(--accent-cyan)` → `#06b6d4`
- **Green**: `var(--accent-green)` → `#10b981`
- **Red**: `var(--accent-red)` → `#ef4444`
- **Gold**: `var(--accent-gold)` → `#f59e0b`

### Background Colors
- **Darkest**: `var(--bg-darkest)` → `#0a0a0f`
- **Dark**: `var(--bg-dark)` → `#1a1a2e`
- **Medium**: `var(--bg-medium)` → `#16213e`

### Text Colors (Dark Mode)
- **Primary**: `var(--text-primary)` → `#e0e0e0`
- **Secondary**: `var(--text-secondary)` → `#a0a0a0`
- **Muted**: `var(--text-muted)` → `#666666`

### Text Colors (Light Mode)
- **Primary**: Available via theme override
- **Secondary**: Available via theme override
- **Muted**: Available via theme override

### Glass Effects
- **Glass**: `var(--glass)` - Semi-transparent with backdrop blur
- **Glass Border**: `var(--glass-border)` - Subtle border color

## Font Families
- **Display**: `var(--font-display)` - Orbitron (headers)
- **Sans**: `var(--font-sans)` - Inter (body text)
- **Mono**: `var(--font-mono)` - JetBrains Mono (code)

## Files Changed

### New Files Created
- ✅ `css/theme.css` - Core unified theme system
- ✅ `css/compatibility.css` - Bridge for backward compatibility

### Updated Files
- ✅ `index.html` - Added theme.css & compatibility.css imports
- ✅ `pages/information.html` - Added theme imports
- ✅ `pages/live.html` - Added theme imports with local variable overrides
- ✅ `pages/calculate.html` - Added theme imports  
- ✅ `pages/mind.html` - Added theme imports
- ✅ `pages/library.html` - Added theme imports
- ✅ `pages/admin.html` - Added theme imports

### Preserved Files (No Changes Needed)
- `css/style.css` - Still works with new variables
- `css/calculate.css` - Still works with new variables
- `css/inline-styles.css` - Still works with new variables
- All JavaScript files - No changes required

## Light Mode Support
Users can toggle light mode by adding `data-theme="light"` to `<html>` tag:
```html
<html data-theme="light">
```

All colors automatically adjust based on theme attribute.

## Feature Preservation

### ✅ Index.html
- Status pill indicator
- Theme toggle
- NASA daily widget
- Search functionality
- Modal dialogs
- FAB menu
- All animations

### ✅ Information.html
- React components
- Dynamic content loading
- Interactive documentation
- Responsive design

### ✅ Live.html  
- Leaflet map integration
- Telemetry data display
- Real-time updates
- Custom map styling

### ✅ Calculate.html
- Scientific calculator
- Matrix canvas animations
- System stats
- Sound effects

### ✅ Mind.html
- KaTeX math rendering
- Mermaid diagrams
- Article content
- Search functionality

### ✅ Library.html
- Archive system
- Cinzel typography
- Grid layouts
- Content categorization

### ✅ Admin.html
- Admin controls
- Dashboard components
- Management functions
- Statistics display

## Migration Tips for Future Development

When adding new styles:
1. **Use CSS variables** instead of hardcoding colors
   ```css
   /* Good */
   color: var(--text-primary);
   background: var(--primary);
   
   /* Avoid */
   color: #e0e0e0;
   background: #a855f7;
   ```

2. **Use spacing variables** for consistent spacing
   ```css
   padding: var(--spacing-md);
   margin: var(--spacing-lg);
   ```

3. **Use transition variables** for animations
   ```css
   transition: all var(--transition-normal);
   ```

4. **Reference theme variables** in light mode overrides
   ```css
   [data-theme="light"] .my-element {
     color: var(--text-primary-light);
   }
   ```

## Troubleshooting

### Colors not reflecting?
1. Check CSS load order - theme.css must come first
2. Verify `data-theme` attribute on `<html>` tag
3. Clear browser cache

### Old styles conflicting?
1. Check CSS specificity
2. Ensure compatibility.css is loaded
3. Use `!important` only as last resort

### Missing colors in light mode?
1. Add light mode variable in theme.css `:root`
2. Add override in `[data-theme="light"]` selector
3. Test with theme toggle

## Future Enhancements
- [ ] Dark/Light mode toggle on all pages
- [ ] Additional theme variants (Midnight, Aurora, etc)
- [ ] CSS-in-JS for dynamic theming
- [ ] Automatic theme detection from system preferences
- [ ] Theme customization panel

---
**Generated**: February 21, 2026
**Version**: 1.1.0 (Unified Theme)
