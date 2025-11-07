# Auth0 Configuration Guide for Louane Actu Fans

## Overview
This document provides instructions for configuring Auth0 authentication for the Louane Actu fan site.

## Prerequisites
- An Auth0 account (sign up at https://auth0.com)
- Access to the Auth0 Dashboard

## Setup Instructions

### 1. Create an Auth0 Application

1. Log in to your Auth0 Dashboard
2. Navigate to **Applications** > **Applications**
3. Click **Create Application**
4. Name: "Louane Actu Fans"
5. Application Type: Select **Single Page Application (SPA)**
6. Click **Create**

### 2. Configure Application Settings

In your application settings, configure the following:

**Allowed Callback URLs:**
```
http://localhost:8888/index.html, https://your-netlify-domain.netlify.app/index.html
```

**Allowed Logout URLs:**
```
http://localhost:8888/index.html, https://your-netlify-domain.netlify.app/index.html
```

**Allowed Web Origins:**
```
http://localhost:8888, https://your-netlify-domain.netlify.app
```

**Allowed Origins (CORS):**
```
http://localhost:8888, https://your-netlify-domain.netlify.app
```

### 3. Update Configuration File

Edit the `auth-config.js` file and replace the placeholder values:

```javascript
const auth0Config = {
  domain: "YOUR_AUTH0_DOMAIN.auth0.com",        // Replace with your Auth0 domain
  clientId: "YOUR_AUTH0_CLIENT_ID",              // Replace with your Client ID
  authorizationParams: {
    redirect_uri: window.location.origin + "/index.html",
    audience: "YOUR_AUTH0_AUDIENCE"              // Optional: API audience
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};
```

**Where to find these values:**
- **Domain**: Found in your application settings (e.g., `dev-abc123.eu.auth0.com`)
- **Client ID**: Found in your application settings
- **Audience**: Optional, needed only if you have an Auth0 API configured

### 4. Environment Variables (Optional)

For production deployments on Netlify, you can set environment variables:

1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Add the following:
   - `AUTH0_DOMAIN`: Your Auth0 domain
   - `AUTH0_CLIENT_ID`: Your Auth0 Client ID
   - `AUTH0_AUDIENCE`: Your Auth0 API audience (if applicable)

Note: You'll need to modify `auth-config.js` to read from environment variables if using this approach.

### 5. Customize Login/Signup Experience (Optional)

In your Auth0 Dashboard:
1. Navigate to **Branding** > **Universal Login**
2. Customize colors, logo, and text to match the Louane Actu brand
3. Primary color suggestion: `#ab47bc` (purple theme)

### 6. Enable Social Connections (Optional)

To allow users to log in with social providers:
1. Navigate to **Authentication** > **Social**
2. Enable desired providers (Google, Facebook, etc.)
3. Configure each provider with their required credentials

## Features Implemented

### Authentication Pages
- **connexion.html**: Login page with Auth0 integration
- **inscription.html**: Signup page with Auth0 integration
- **profil.html**: User profile page (requires authentication)

### Authentication Functions
- `login()`: Redirects to Auth0 login
- `signup()`: Redirects to Auth0 signup
- `logout()`: Logs out user and returns to homepage
- `getUser()`: Retrieves authenticated user information
- `isAuthenticated()`: Checks if user is logged in
- `updateUIBasedOnAuth()`: Updates menu based on authentication state

### User Experience
- Authenticated users see their profile link and logout option in the menu
- Non-authenticated users see login and signup options
- Profile page redirects to login if user is not authenticated
- Seamless redirect handling after authentication

## Testing Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Netlify dev server:
   ```bash
   netlify dev
   ```

3. Navigate to `http://localhost:8888`
4. Test login/signup flows

## Deployment to Netlify

1. Ensure all Auth0 configuration is correct
2. Update Allowed Callback URLs, Logout URLs, and Origins in Auth0 with your production domain
3. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

## Security Notes

- Never commit your Auth0 credentials to version control
- Use environment variables for sensitive configuration in production
- Keep the Auth0 SDK up to date
- Enable MFA (Multi-Factor Authentication) in Auth0 for enhanced security

## Support

For Auth0-related issues:
- Documentation: https://auth0.com/docs
- Community: https://community.auth0.com

For site-specific issues:
- Contact: Louane Actu team
