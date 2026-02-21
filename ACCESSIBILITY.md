# Accessibility Guide

Ensuring IEA Portal is accessible to all users, including those with disabilities.

## WCAG 2.1 Compliance

IEA Portal aims for **WCAG 2.1 Level AA** compliance.

### Compliance Checklist
- [ ] Level A: Basic accessibility
- [ ] Level AA: Enhanced accessibility
- [ ] Level AAA: Maximum accessibility

## Current Accessibility Features

### 1. Semantic HTML

```html
<!-- ✅ Use semantic elements -->
<nav>Navigation here</nav>
<main>Main content</main>
<section>Section content</section>
<article>Article content</article>
<footer>Footer content</footer>

<!-- ❌ Avoid generic divs -->
<div class="nav">...</div>
<div class="main">...</div>
```

**Benefit**: Screen readers understand page structure

### 2. Alt Text for Images

```html
<!-- ✅ Descriptive alt text -->
<img src="nasa.jpg" alt="NASA Mars rover discovery">

<!-- ❌ Unhelpful alt text -->
<img src="nasa.jpg" alt="image">
<img src="nasa.jpg" alt="">
```

**Benefit**: Visually impaired users understand images

### 3. ARIA Labels

```html
<!-- ✅ Label form inputs -->
<label for="username">Username:</label>
<input id="username" type="text">

<!-- ✅ Extra context with aria-label -->
<button aria-label="Close menu">×</button>

<!-- ✅ Describe relationships -->
<h2 id="section-title">Discoveries</h2>
<div role="region" aria-labelledby="section-title">
    Content here
</div>
```

### 4. Keyboard Navigation

```javascript
// ✅ Keyboard accessible buttons
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target === document.activeElement) {
            handleClick(e);
        }
    }
});

// ✅ Tab order is logical
// Use tabindex only when necessary
<button tabindex="0">Primary Action</button>
```

### 5. Color Contrast

```css
/* ✅ WCAG AA minimum: 4.5:1 for text */
color: #00f3ff;      /* Cyan on dark background = 8:1 */
background-color: #0a0a0f;

/* ✅ AAA enhanced: 7:1 */
color: #0a0a0f;
background-color: #ffffff;
```

**Testing**: WebAIM Contrast Checker

### 6. Focus Indicators

```css
/* ✅ Visible focus outline */
button:focus {
    outline: 2px solid #00f3ff;
    outline-offset: 2px;
}

/* ❌ Never remove outline without replacement */
button:focus {
    outline: none; /* BAD! */
}
```

### 7. Form Accessibility

```html
<!-- ✅ Associated labels -->
<fieldset>
    <legend>Theme Preference</legend>
    
    <input id="dark" type="radio" name="theme" value="dark">
    <label for="dark">Dark Mode</label>
    
    <input id="light" type="radio" name="theme" value="light">
    <label for="light">Light Mode</label>
</fieldset>

<!-- ✅ Error messages linked to inputs -->
<input id="email" type="email" aria-describedby="email-error">
<span id="email-error" role="alert">Invalid email format</span>
```

## Testing for Accessibility

### 1. Automated Testing

#### Browser Extensions
- **axe DevTools**: Free accessibility checker
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in Chrome DevTools

#### Running Axe
```javascript
// In Chrome DevTools Console
// After installing axe extension:
axe.run((err, results) => {
    if (err) throw err;
    console.log(results.violations);
});
```

### 2. Manual Testing

#### Keyboard Navigation
- [ ] Can reach all interactive elements with Tab
- [ ] Focus order is logical
- [ ] Focus indicator is visible
- [ ] Can close dialogs with Escape

#### Screen Reader Testing
- [ ] Install NVDA (Windows) or VoiceOver (Mac)
- [ ] Test navigation
- [ ] Verify alt text readability
- [ ] Check form labels

#### Mobile Accessibility
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Can pinch to zoom
- [ ] Text is readable without zooming

### 3. Performance Check

```bash
# Run Lighthouse with accessibility focus
# DevTools > Lighthouse > Accessibility
# Target score: 95+
```

## Accessible Component Patterns

### Modal Dialog

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure?</p>
    <button>Cancel</button>
    <button>Confirm</button>
</div>
```

### Alert/Toast

```html
<div role="alert" aria-live="polite" aria-atomic="true">
    ✓ Changes saved successfully
</div>
```

### Skip Link

```html
<!-- At top of page, hidden until focused -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
    .skip-link {
        position: absolute;
        left: -9999px;
    }
    
    .skip-link:focus {
        left: 0;
        top: 0;
        z-index: 1000;
    }
</style>

<main id="main-content">Main content here</main>
```

### Loading State

```html
<!-- Announce loading to screen readers -->
<div aria-live="polite" aria-busy="true">
    Loading data...
</div>

<!-- Update when done -->
<div aria-live="polite" aria-busy="false">
    Data loaded successfully
</div>
```

## ARIA Best Practices

### Do's ✅
- Use semantic HTML first
- Use aria-label for icon buttons
- Use aria-describedby for detailed descriptions
- Use role="alert" for urgent messages
- Test with screen readers

### Don'ts ❌
- Don't use aria to fix bad markup
- Don't use role="button" on divs (use button element)
- Don't add aria-hidden="true" carelessly
- Don't create elements purely for screen readers
- Don't announce trivial changes

## Color & Contrast

### WCAG Standards
```
Level AA: 4.5:1 contrast for text
Level AAA: 7:1 contrast for text
Level AA: 3:1 contrast for UI components
```

### Testing Tools
- WebAIM Contrast Checker
- Stark (Design tool plugin)
- Chrome DevTools DevTools > Rendering > Emulate CSS media feature

### IEA Portal Colors
```css
/* Primary: Cyan on Dark */
color: #00f3ff;           /* Readable */
background: #0a0a0f;      /* Good contrast */

/* Secondary: Light Blue on Dark */
color: #88ccff;
background: #0a0a0f;      /* Good contrast */

/* Text: Light on Dark */
color: #ffffff;
background: #0a0a0f;      /* Perfect contrast */
```

## Mobile & Touch Accessibility

### Touch Target Size
```css
/* Minimum 44x44px for interactive elements */
button {
    min-width: 44px;
    min-height: 44px;
    padding: 10px 16px;
}

/* Spacing between touch targets */
button {
    margin: 8px;
}
```

### Responsive Text
```css
/* Readable without zooming */
body {
    font-size: 16px; /* Good baseline */
}

h1 { font-size: 24px; }
h2 { font-size: 20px; }

@media (max-width: 600px) {
    body { font-size: 18px; }
}
```

## Accessibility Checklist

- [ ] Semantic HTML used throughout
- [ ] Alt text for all images
- [ ] Form labels connected to inputs
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast 4.5:1 minimum
- [ ] No color as only means of info
- [ ] ARIA labels where helpful
- [ ] Skip links present
- [ ] Mobile touch targets 44x44px+
- [ ] Tested with screen reader
- [ ] Tested with keyboard only
- [ ] Lighthouse accessibility 95+
- [ ] Animations not auto-playing
- [ ] Flashing content < 3 times/sec

## Resources

### Learning
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM](https://webaim.org/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Accessibility is not optional—it's essential.**
