const auth0Config = {
  domain: "dev-bsj501o0317kud5u.us.auth0.com",
  clientId: "8JFDSFzNnp30XQjCNsDc9FzZruPy2jLA",
  authorizationParams: {
    redirect_uri: window.location.origin + "/index.html"
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

let auth0Client = null;

function validateAuth0Config() {
  const errors = [];
  
  if (!auth0Config.domain) {
    errors.push("Auth0 domain is missing");
  }
  
  if (!auth0Config.clientId) {
    errors.push("Auth0 client ID is missing");
  }
  
  if (errors.length > 0) {
    throw new Error("Auth0 configuration error: " + errors.join(", "));
  }
  
  console.log("Auth0 config validated successfully");
  console.log("Redirect URI:", auth0Config.authorizationParams.redirect_uri);
}

async function initAuth0() {
  if (!auth0Client) {
    if (typeof auth0 === 'undefined') {
      throw new Error('Auth0 SDK not loaded. Please check if the script is properly loaded.');
    }
    
    validateAuth0Config();
    
    try {
      auth0Client = await auth0.createAuth0Client(auth0Config);
      console.log("Auth0 client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Auth0 client:", error);
      throw new Error("Impossible d'initialiser Auth0: " + error.message);
    }
  }
  return auth0Client;
}

async function login() {
  try {
    console.log("Starting login process...");
    const client = await initAuth0();
    console.log("Redirecting to Auth0 login...");
    await client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin + "/index.html"
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    alert('❌ Une erreur s\'est produite lors de la connexion: ' + error.message);
    throw error;
  }
}

async function signup() {
  try {
    console.log("Starting signup process...");
    const client = await initAuth0();
    console.log("Redirecting to Auth0 signup...");
    await client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin + "/index.html",
        screen_hint: 'signup'
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    alert('❌ Une erreur s\'est produite lors de la création du compte: ' + error.message);
    throw error;
  }
}

async function logout() {
  const client = await initAuth0();
  await client.logout({
    logoutParams: {
      returnTo: window.location.origin + "/index.html"
    }
  });
}

async function getUser() {
  const client = await initAuth0();
  const isAuthenticated = await client.isAuthenticated();
  if (isAuthenticated) {
    return await client.getUser();
  }
  return null;
}

async function isAuthenticated() {
  const client = await initAuth0();
  return await client.isAuthenticated();
}

async function handleRedirectCallback() {
  const client = await initAuth0();
  
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    try {
      await client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error handling redirect callback:", error);
    }
  }
}

async function updateUIBasedOnAuth() {
  const authenticated = await isAuthenticated();
  const accountLinks = document.querySelectorAll('a[href="connexion.html"], a[href="inscription.html"]');
  const accountMenu = document.querySelector('.submenu#submenu-compte');
  
  if (authenticated) {
    const user = await getUser();
    
    if (accountMenu) {
      accountMenu.innerHTML = `
        <a href="profil.html">👤 Mon profil</a>
        <a href="#" id="logout-btn">Déconnexion</a>
      `;
      
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          await logout();
        });
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', async () => {
    await handleRedirectCallback();
    await updateUIBasedOnAuth();
  });
}
