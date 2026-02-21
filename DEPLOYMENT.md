# Deployment Guide

Complete guide for deploying IEA Portal to production.

## Current Deployment: GitHub Pages

IEA Portal is deployed on GitHub Pages at:
🔗 https://xzam730.github.io/PORTAL-IEA/

### GitHub Pages Deployment

#### Prerequisites
- GitHub account
- Repository with proper settings
- Branch set to `main` or `gh-pages`

#### Setup Steps

1. **Repository Settings**
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` (root directory)
   - Save

2. **CNAME for Custom Domain (Optional)**
   ```
   # Create CNAME file in root
   your-custom-domain.com
   ```

3. **DNS Configuration (Optional)**
   ```
   A Record: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   ```

#### Publishing Workflow

```bash
# 1. Commit changes locally
git add .
git commit -m "feat: add new features"

# 2. Push to GitHub
git push origin main

# 3. GitHub automatically deploys
# Check Actions tab for deployment status
```

#### Verification
- Visit https://xzam730.github.io/PORTAL-IEA/
- Check SEO meta tags in DevTools
- Verify Service Worker registration
- Test offline functionality

## Alternative Deployments

### 1. Netlify Deployment

#### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Connect project
netlify init

# Deploy
netlify deploy --prod
```

#### Features
- Zero configuration
- Automatic HTTPS
- Environment variables support
- Prebuilt previews for PRs

#### Configuration File (netlify.toml)
```toml
[build]
  publish = "."
  command = ""

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### 2. Vercel Deployment

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Configuration (vercel.json)
```json
{
  "buildCommand": "echo 'Static site, no build needed'",
  "outputDirectory": ".",
  "github": {
    "enabled": true,
    "silent": true,
    "autoAlias": true
  },
  "env": {
    "NASA_API_KEY": "@nasa_key"
  }
}
```

### 3. AWS S3 + CloudFront

#### Setup
```bash
# Install AWS CLI
aws configure

# Deploy to S3
aws s3 sync . s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### CloudFormation Template
```yaml
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: iea-portal
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: 404.html
  
  CloudFront:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        DefaultRootObject: index.html
        Origins:
          - DomainName: iea-portal.s3.amazonaws.com
```

## Pre-Deployment Checklist

- [ ] All code committed and pushed
- [ ] No console errors or warnings
- [ ] Lighthouse score 95+
- [ ] Service Worker works offline
- [ ] API keys not exposed (using DEMO_KEY)
- [ ] Images optimized
- [ ] Meta tags correct
- [ ] Sitemap.xml updated
- [ ] robots.txt configured
- [ ] Mobile responsive tested
- [ ] Cross-browser tested
- [ ] Performance monitor setup

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Lighthouse Configuration

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.95}],
        "categories:accessibility": ["error", {"minScore": 0.95}]
      }
    }
  }
}
```

## Environment Variables

### Setup .env File

```bash
# .env (never commit this)
NASA_API_KEY=your_production_api_key_here
FIREBASE_KEY=your_firebase_key_here
ANALYTICS_ID=your_analytics_id_here
```

### Loading in JavaScript

```javascript
// config.js
const API_KEY = await fetch('.env')
    .then(r => r.text())
    .then(text => {
        const match = text.match(/NASA_API_KEY=(.+)/);
        return match ? match[1] : 'DEMO_KEY';
    });
```

## SSL/TLS Certificate

### GitHub Pages (Automatic)
- GitHub automatically provisions SSL certificates
- All traffic is HTTPS

### Custom Domain
- Enable "Enforce HTTPS" in Settings
- Works with GitHub's issued certificates

## Monitoring & Analytics

### Error Tracking
```javascript
// Add to global error handler
window.addEventListener('error', (event) => {
    fetch('/logs', {
        method: 'POST',
        body: JSON.stringify({
            type: 'error',
            message: event.message,
            stack: event.error?.stack,
            timestamp: new Date().toISOString()
        })
    });
});
```

### Performance Monitoring
```javascript
// Send Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### Analytics Integration

#### Google Analytics
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

#### Plausible (Privacy-friendly)
```html
<script defer data-domain="xzam730.github.io" src="https://plausible.io/js/script.js"></script>
```

## Rollback Strategy

### GitHub Pages
```bash
# If deployment breaks, rollback to previous version
git revert HEAD --no-edit
git push origin main
# GitHub automatically redeploys
```

### Netlify
```bash
netlify deploy --prod --alias=rollback
```

## Status Monitoring

### Uptime Monitoring
- UptimeRobot.com (free tier available)
- Pingdom
- Statuspages.io

### Performance Monitoring
- Sentry.io (error tracking)
- DataDog (APM)
- New Relic

## Backup Strategy

```bash
# Weekly backup to GitHub Pages repository
git clone https://github.com/XZAM730/PORTAL-IEA.git backup-$(date +%Y-%m-%d)

# Or use GitHub's built-in backup options
# Regular commits serve as backups
```

## Security Considerations

1. **API Keys**: Never commit production keys
2. **HTTPS Only**: Always use HTTPS
3. **CSP Headers**: Implement Content Security Policy
4. **CORS**: Configure properly for API calls
5. **Dependencies**: Keep npm packages updated (when used)

### Example CSP Header
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://api.nasa.gov;
  style-src 'self' 'unsafe-inline';
  font-src https://fonts.gstatic.com
```

## Troubleshooting

### Deployment Failed
1. Check GitHub Actions logs
2. Verify repository settings
3. Ensure all files are committed
4. Check branch protection rules

### Performance Issues
1. Run Lighthouse audit
2. Check Service Worker caching
3. Monitor network requests
4. Profile with Chrome DevTools

### 404 Errors
1. Verify file paths
2. Check sitemap.xml
3. Ensure index.html exists
4. Check routing configuration

## Contact & Support

For deployment assistance:
- Create GitHub issue
- Check SECURITY.md for security concerns
- Review logs in GitHub Actions

---

**Next Deployment: [Date]**
**Last Deployed: 2026-02-21**
