# Contributing to IEA Portal

Thank you for your interest in contributing to IEA Portal! We welcome contributions from everyone. This document provides guidelines to ensure smooth collaboration.

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and adhere to our community standards.

## How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/PORTAL-IEA.git
cd PORTAL-IEA
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# Or for bug fixes:
git checkout -b bugfix/issue-description
```

### 3. Make Your Changes
- Follow the [code style guide](#code-style)
- Keep changes focused on one feature/bug
- Write meaningful commit messages

### 4. Test Your Changes
```bash
# Open index.html in browser
# Or use local server:
npx serve .
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add descriptive message"
git push origin feature/your-feature-name
```

### 6. Submit Pull Request
- Provide clear description of changes
- Link related issues if any
- Wait for review and feedback

## Code Style

### HTML
- Use semantic HTML5 elements
- 4-space indentation
- Proper heading hierarchy (h1, h2, h3...)
- Always include alt text for images

```html
<section>
    <h2>Section Title</h2>
    <img src="image.jpg" alt="Descriptive text">
</section>
```

### CSS
- Use CSS Grid/Flexbox for layouts
- Mobile-first responsive design
- Group related styles together
- Use meaningful class names

```css
.component-name {
    display: flex;
    gap: 1rem;
    /* Layout styles */
}

.component-name__child {
    /* Child element styles */
}

@media (max-width: 768px) {
    /* Mobile styles */
}
```

### JavaScript
- Use vanilla JS (no unnecessary dependencies)
- Use ES6+ syntax (const, let, arrow functions)
- Add JSDoc comments for functions
- Handle errors gracefully

```javascript
/**
 * Fetch NASA astronomy data
 * @param {string} apiKey - NASA API key
 * @returns {Promise<Object>} Astronomy data
 */
async function fetchNASAData(apiKey) {
    try {
        const response = await fetch(`https://api.nasa.gov/...?api_key=${apiKey}`);
        if (!response.ok) throw new Error('API_ERROR');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch NASA data:', error);
        return null;
    }
}
```

### Markdown
- Use heading hierarchy properly
- Add code blocks with language specification
- Link to relevant docs/issues
- Keep lines under 100 characters

## File Structure

```
PORTAL-IEA/
├── index.html              # Main entry point
├── manifest.json           # PWA configuration
├── sw.js                   # Service Worker
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
├── pages/                  # Sub-pages
├── assets/                 # Images & static files
└── docs/                   # Documentation
    ├── CONTRIBUTING.md
    ├── PERFORMANCE.md
    ├── DEPLOYMENT.md
    └── ACCESSIBILITY.md
```

## Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test addition/modification

**Examples:**
```
feat(api): add retry mechanism for NASA API calls
fix(sw): resolve caching issue for offline mode
docs: update API configuration guide
refactor(js): simplify event handlers
```

## Testing

- Test in modern browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Test offline functionality (DevTools > Offline)
- Check performance (Lighthouse)

## Documentation

- Update README.md if adding features
- Add comments to complex code
- Update CHANGELOG.md with your changes
- Keep API documentation current

## Issues & Bug Reports

When reporting issues:
1. Check if issue already exists
2. Provide clear description
3. Include steps to reproduce
4. Attach screenshots if relevant
5. Specify browser/device info

**Example:**
```
Title: Dark mode button not working on Firefox

Description:
When clicking the dark mode toggle, nothing happens.

Steps:
1. Open index.html
2. Click theme toggle button
3. Expected: Dark mode activates
4. Actual: Nothing happens

Environment:
- Browser: Firefox 120
- OS: Windows 11
```

## Security

- Never commit API keys or secrets
- Use .env for sensitive data
- Report security issues privately to maintainers
- Follow SECURITY.md guidelines

## Questions?

- Open an issue with `question` label
- Add to Discussions tab
- Check existing documentation first

## Recognition

Contributors will be:
- Added to README.md contributors list
- Mentioned in CHANGELOG.md
- Credited in commit history

---

**Thank you for contributing to make IEA Portal better! 🚀**
