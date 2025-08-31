> ⏱️ **Last Updated:** August 31, 2025

# Toys Before Bed™ Website  

[![Deploy to GitHub Pages](https://img.shields.io/badge/🚀%20Live-GitHub%20Pages-7c0e0c?logo=github)](https://mrobinson102.github.io/toys-before-bed/)  

## 🌙 Brand Slogan
**Confidence After Dark. Comfort All Night.**  

## 🚀 Deployment
- Push to `main` branch → site auto-deploys to GitHub Pages.  
- CNAME set to `toysbeforebed.com`. Configure DNS accordingly.  

© 2025 Toys Before Bed™  
# toysbeforebed
Modern adult ecommerce web presence for Toys Before Bed™ — includes age verification, recruitment portal, product previews, email signup, and launch-ready branding. Built for future integration with Shopify, analytics, and marketing platforms. Private until public launch.



## 🌐 Custom Domain Setup (toysbeforebed.com)

To connect your custom domain to GitHub Pages:

1. **Log in to your domain registrar** (iPostal1 or the service where you purchased `toysbeforebed.com`).  
2. Go to **DNS Settings / Manage DNS** for your domain.  
3. Add these **A Records** (for the root domain):  

| Type | Host / Name | Value (Points To) | TTL |
|------|-------------|-------------------|-----|
| A    | @           | 185.199.108.153   | Auto / 1h |
| A    | @           | 185.199.109.153   | Auto / 1h |
| A    | @           | 185.199.110.153   | Auto / 1h |
| A    | @           | 185.199.111.153   | Auto / 1h |

4. Add this **CNAME Record** (for www):  

| Type  | Host / Name | Value (Points To)         | TTL |
|-------|-------------|---------------------------|-----|
| CNAME | www         | mrobinson102.github.io    | Auto / 1h |

5. Go to your GitHub repo → **Settings → Pages**.  
6. In the *Custom domain* field, enter:  

```
toysbeforebed.com
```

7. Save, then check **Enforce HTTPS** once the SSL certificate is ready (can take 15–60 minutes).  

Your site will then be available at both:  
- https://toysbeforebed.com  
- https://www.toysbeforebed.com  
