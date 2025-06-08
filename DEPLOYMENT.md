# Jump Bird - Farcaster Mini App Deployment Guide

## Overview
Jump Bird is a fully integrated Farcaster Mini App that uses the official @farcaster/frame-sdk. This guide covers deployment to Vercel and publishing to the Farcaster ecosystem.

## Prerequisites
1. A Farcaster account with FID
2. Vercel account
3. Domain name (optional but recommended)

## Deployment Steps

### 1. Deploy to Vercel

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jump-bird-farcaster)

#### Option B: Manual Deploy
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Environment Configuration
No environment variables required for basic functionality. The app works in standalone mode and Farcaster mode.

### 3. Domain Setup
1. Add your custom domain in Vercel dashboard
2. Update manifest file at `client/public/.well-known/farcaster.json`
3. Update meta tags in `client/index.html`

### 4. Farcaster Integration Setup

#### Generate Account Association
1. Install Farcaster CLI or use online tools
2. Sign domain with your Farcaster custody address
3. Update `accountAssociation` in manifest

```bash
# Example using farcaster-auth-kit or similar
farcaster-cli sign-domain yourdomain.com --fid YOUR_FID
```

#### Update Manifest
Replace the placeholder values in `client/public/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "YOUR_SIGNED_HEADER",
    "payload": "YOUR_SIGNED_PAYLOAD", 
    "signature": "YOUR_SIGNATURE"
  },
  "frame": {
    "version": "1",
    "name": "Jump Bird",
    "iconUrl": "https://yourdomain.com/splash.svg",
    "homeUrl": "https://yourdomain.com/",
    "imageUrl": "https://yourdomain.com/og-image.svg",
    "buttonTitle": "🐦 Play Game",
    "splashImageUrl": "https://yourdomain.com/splash.svg",
    "splashBackgroundColor": "#3B82F6",
    "webhookUrl": "https://yourdomain.com/api/webhook"
  }
}
```

### 5. Testing

#### Local Testing
```bash
npm install
npm run dev
# Test at http://localhost:5000
```

#### Production Testing
1. Verify manifest is accessible: `https://yourdomain.com/.well-known/farcaster.json`
2. Test frame embed meta tags
3. Verify webhook endpoint: `POST https://yourdomain.com/api/webhook`

### 6. Publishing to Farcaster

#### Create Frame Embed
Your app automatically includes the frame embed meta tag. When users share your domain in a cast, it will render as a Mini App.

#### Distribution
1. Share your domain URL in Farcaster casts
2. Users can click "🐦 Play Game" to launch the Mini App
3. App can be added to user's Mini App collection

## Features

### Farcaster SDK Integration
- ✅ Proper SDK initialization with fallback
- ✅ Haptic feedback for interactions
- ✅ Cast composition for sharing scores
- ✅ Wallet connection support
- ✅ Context awareness (knows when running in Farcaster)

### Game Features
- ✅ Physics-based bird jumping mechanics
- ✅ Procedural pipe generation
- ✅ Score tracking and leaderboards
- ✅ Responsive mobile-first design
- ✅ Progressive Web App capabilities

### Mini App Compliance
- ✅ Proper manifest file structure
- ✅ Frame embed meta tags
- ✅ Webhook endpoint for notifications
- ✅ Splash screen configuration
- ✅ Account association for verification

## File Structure
```
├── client/
│   ├── public/
│   │   ├── .well-known/farcaster.json    # Mini App manifest
│   │   ├── og-image.svg                  # Social preview image
│   │   └── splash.svg                    # App splash screen
│   └── src/
│       ├── lib/farcaster.ts              # SDK integration
│       ├── components/game/              # Game components
│       └── pages/game.tsx                # Main game page
├── server/
│   ├── routes.ts                         # API endpoints + webhook
│   └── storage.ts                        # Score persistence
└── vercel.json                           # Deployment configuration
```

## API Endpoints
- `GET /api/scores` - Get top scores
- `POST /api/scores` - Save new score
- `GET /api/users/:id/best-score` - Get user's best score
- `POST /api/webhook` - Farcaster webhook events

## Troubleshooting

### Common Issues
1. **Manifest not accessible**: Ensure `.well-known` folder is served by Vercel
2. **Frame not rendering**: Verify meta tag format and image URLs
3. **SDK errors**: App falls back gracefully to standalone mode
4. **Webhook failures**: Check endpoint accessibility and payload format

### Debugging
- Check browser console for SDK initialization
- Verify network requests to API endpoints
- Test manifest accessibility directly

## Next Steps
1. Deploy to production
2. Generate proper account association
3. Share in Farcaster for testing
4. Submit to Mini App directories
5. Monitor webhook events and user engagement