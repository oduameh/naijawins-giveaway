# NaijaWins - Giveaway Landing Page

A high-conversion giveaway landing page designed for traffic arbitrage. Built to capture email leads while monetizing traffic through Google AdSense.

## 🎯 Features

- **Mobile-First Design**: Optimized for Nigerian users on mobile devices
- **High-Conversion Layout**: Clear CTAs, trust signals, and social proof
- **Email Capture**: Form with validation and Terms/Privacy agreement
- **AdSense Ready**: Pre-positioned ad slots following Google policies
- **Compliance Built-In**: Privacy Policy, Terms, and required disclaimers
- **Social Sharing**: Share buttons for WhatsApp, Facebook, and X (Twitter)
- **Fast Loading**: Static HTML/CSS/JS - no framework overhead

## 📁 File Structure

```
├── index.html      # Main landing page
├── success.html    # Post-signup confirmation page
├── privacy.html    # Privacy Policy (required for AdSense)
├── terms.html      # Terms and Conditions
├── styles.css      # All styles (mobile-first)
├── script.js       # Form handling & interactions
└── README.md       # This file
```

## 🚀 Quick Start

### 1. Download/Clone the Files

Copy all files to your project folder.

### 2. Customize Content

Edit `index.html` to update:
- Prize amount (currently ₦100,000)
- Brand name (currently "NaijaWins")
- Contact email
- Social meta tags (og:image, og:url, etc.)

### 3. Set Up Email Collection

Choose one of these options:

#### Option A: Formspree (Easiest)
1. Go to [formspree.io](https://formspree.io) and create an account
2. Create a new form and get your Form ID
3. In `script.js`, update the `formEndpoint`:
```javascript
formEndpoint: 'https://formspree.io/f/YOUR_ACTUAL_FORM_ID',
```

#### Option B: Google Sheets
1. Create a Google Sheet with columns: email, name, newsletter, timestamp, source, referrer
2. Go to Extensions > Apps Script
3. Paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.email,
    data.name,
    data.newsletter,
    data.timestamp,
    data.source,
    data.referrer,
    new Date()
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Copy the deployment URL to `script.js`

#### Option C: Your Own Backend
Set `formEndpoint` to your API endpoint that accepts POST requests with JSON body.

### 4. Set Up Google AdSense

1. Apply for AdSense at [adsense.google.com](https://www.adsense.google.com)
2. Once approved, get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
3. In `index.html`, uncomment and update the AdSense script in `<head>`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
```

4. Create ad units in AdSense dashboard
5. Replace the ad placeholders with your ad code:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 5. Deploy

#### Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop your project folder to deploy
3. Set up a custom domain

#### Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your project
3. Deploy with one click

#### Shared Hosting
1. Upload all files to your `public_html` folder via FTP
2. Ensure your domain points to the hosting

## ⚙️ Configuration

### script.js Settings

```javascript
const CONFIG = {
    formEndpoint: 'YOUR_ENDPOINT',  // Email collection endpoint
    successRedirect: 'success.html', // Redirect after signup
    validateEmail: true,             // Frontend email validation
    baseEntryCount: 2847,           // Starting entry count display
    drawDayOfWeek: 0                // 0 = Sunday (countdown target)
};
```

### Customizing the Design

All styling is in `styles.css` using CSS custom properties:

```css
:root {
    --color-primary: #00A859;      /* Main green color */
    --color-accent: #FF6B35;       /* CTA button color */
    --bg-page: #FAFBFC;            /* Page background */
    /* ... more variables */
}
```

## 📊 Tracking & Analytics

### Google Analytics 4

Add this before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Facebook Pixel

Add this before `</head>`:

```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

### UTM Tracking

The site automatically captures UTM parameters from URLs. Use links like:
```
https://yourdomain.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=giveaway
```

## ✅ AdSense Compliance Checklist

- [x] Privacy Policy page included
- [x] Terms and Conditions page included
- [x] "No purchase necessary" disclaimer displayed
- [x] Platform non-endorsement disclaimer in footer
- [x] Ads placed away from form submission buttons
- [x] No incentivized ad clicks
- [x] No misleading ad placements
- [x] Clear content above the fold
- [x] Mobile-responsive ad placements

## 🔒 Legal Compliance

**Important**: Before launching, ensure you:

1. **Update contact information** in Privacy Policy and Terms
2. **Review local laws** regarding giveaways in Nigeria
3. **Have a genuine prize fulfillment process**
4. **Keep records of all entrants and winners**
5. **Actually conduct the giveaway fairly**

## 📱 Social Media Ad Tips

### Facebook/Instagram
- Use eye-catching images with prize amount
- Target Nigerian audience 18+
- Avoid misleading claims
- Link directly to landing page

### TikTok
- Create engaging video content
- Use trending sounds
- Include clear call-to-action
- Link in bio or ads

### X (Twitter)
- Tweet regularly about the giveaway
- Use relevant Nigerian hashtags
- Engage with potential entrants

## 🔄 Scaling to Multiple Sites

To create variations of this site:

1. Duplicate the entire project folder
2. Change branding (logo, colors, name)
3. Update prize amounts
4. Create new AdSense ad units
5. Set up new email collection form
6. Deploy to a new domain

## 🛠 Troubleshooting

### Form not submitting
- Check browser console for errors
- Verify form endpoint URL is correct
- Ensure CORS is enabled on your backend

### AdSense not showing
- Wait 24-48 hours after adding code
- Ensure site is approved by AdSense
- Check for ad blockers during testing

### Slow loading
- Optimize any images you add
- Use a CDN for static assets
- Enable caching on your hosting

## 📞 Support

For questions about this template, please review the code comments and this documentation.

---

**Disclaimer**: This template is provided for legitimate giveaway purposes. Ensure you conduct real giveaways with genuine prizes and follow all applicable laws and platform policies.

