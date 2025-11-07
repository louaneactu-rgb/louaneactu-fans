// --- Configuration Auth0 ---
const auth0Config = {
  domain: "dev-bsj501o0317kud5u.us.auth0.com",
  clientId: "8JFDSFzNnp30XQjCNsDc9FzZruPy2jLA",
  authorizationParams: {
    redirect_uri: window.location.origin  // ✅ fonctionne sur Vercel et en local
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

let auth0Client = null;

// --- Vérification de la config ---
function validateAuth0Config() {
  if (!auth0Config.domain || !auth0Config.clientId) {
    throw new Error("❌ Auth0 configuration incorrecte. Vérifie ton domaine et ton Client ID.");
  }
  console.log("✅ Auth0 configuration validée");
}

// --- Initialisation du client Auth0 ---
async function initAuth0() {
  if (!auth0Client) {
    if (typeof auth0 === "undefined") {
      throw new Error("Auth0 SDK non chargé. Vérifie le script <script src='https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js'></script>");
    }

    validateAuth0Config();

    try {
      auth0Client = await auth0.createAuth0Client(auth0Config);
      console.log("✅ Client Auth0 initialisé");
    } catch (error) {
      console.error("Erreur d'initialisation Auth0:", error);
      alert("Impossible d'initialiser la connexion : " + error.message);
    }
  }
  return auth0Client;
}

// --- Connexion ---
async function login() {
  try {
    const client = await initAuth0();
    await client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });
  } catch (error) {
    alert("Erreur de connexion : " + error.message);
  }
}

// --- Inscription ---
async function signup() {
  try {
    const client = await initAuth0();
    await client.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        screen_hint: "signup",
      },
    });
  } catch (error) {
    alert("Erreur d’inscription : " + error.message);
  }
}

// --- Déconnexion ---
async function logout() {
  const client = await initAuth0();
  await client.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
}

// --- Récupération utilisateur ---
async function getUser() {
  const client = await initAuth0();
  const isAuthenticated = await client.isAuthenticated();
  if (isAuthenticated) {
    return await client.getUser();
  }
  return null;
}

// --- Gestion du retour de connexion ---
async function handleRedirectCallback() {
  const client = await initAuth0();
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    try {
      await client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Erreur lors du retour Auth0:", error);
    }
  }
}

// --- Mise à jour de l’interface selon connexion ---
async function updateUIBasedOnAuth() {
  const authenticated = await (await initAuth0()).isAuthenticated();
  const accountMenu = document.querySelector(".submenu#submenu-compte");

  if (authenticated && accountMenu) {
    const user = await getUser();
    accountMenu.innerHTML = `
      <a href="profil.html">👤 Mon profil</a>
      <a href="#" id="logout-btn">Déconnexion</a>
    `;
    document.getElementById("logout-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      await logout();
    });
  }
}

// --- Initialisation globale ---
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", async () => {
    await handleRedirectCallback();
    await updateUIBasedOnAuth();
  });
}
