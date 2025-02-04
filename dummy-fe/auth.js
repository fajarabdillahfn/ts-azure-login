const clientId = "your-client-id"; // Replace with your Azure AD client ID
const tenantId = "your-tenant-id"; // Replace with your tenant ID

// MSAL configuration
const msalConfig = {
    auth: {
        clientId: clientId, 
        authority: "https://login.microsoftonline.com/" + tenantId, 
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

// MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Login request object
const loginRequest = {
    scopes: ["openid", "profile", "email"]
};

let jwtToken = null;

// Elements
const loginSection = document.getElementById('loginSection');
const authenticatedSection = document.getElementById('authenticatedSection');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const helloButton = document.getElementById('helloButton');
const responseDiv = document.getElementById('response');
const loadingDiv = document.getElementById('loading');

// Handle the response from Azure AD
async function handleResponse(response) {
    if (response !== null) {
        try {
            loadingDiv.classList.remove('hidden');
            const tokenResponse = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: response.account
            });
            
            // Send the token to your NestJS backend
            const backendResponse = await fetch('http://localhost:3300/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: tokenResponse.accessToken
                })
            });
            
            const data = await backendResponse.json();
            jwtToken = data.accessToken;
            console.log('Response:', response);
            console.log('Token Response:', tokenResponse);
            console.log('Access Token:', data.accessToken);
            
            // Show authenticated section
            loginSection.classList.add('hidden');
            authenticatedSection.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            responseDiv.innerHTML = `
                <p style="color: red;">Error during authentication</p>
            `;
        } finally {
            loadingDiv.classList.add('hidden');
        }
    }
}

// Initialize
msalInstance.handleRedirectPromise()
    .then(handleResponse)
    .catch(error => {
        console.error(error);
    });

// Login function
function signIn() {
    msalInstance.loginRedirect(loginRequest);
}

// Logout function
async function signOut() {
    const logoutRequest = {
        account: msalInstance.getAllAccounts()[0]
    };
    
    await msalInstance.logoutRedirect(logoutRequest);
}

// Get hello world message
async function getHelloMessage() {
    if (!jwtToken) {
        responseDiv.innerHTML = '<p class="error">Not authenticated</p>';
        return;
    }

    try {
        loadingDiv.classList.remove('hidden');
        const response = await fetch('http://localhost:3300/api/hello', {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get hello message');
        }

        const data = await response.json();
        responseDiv.innerHTML = `
            <p><strong>Message:</strong> ${data.message}</p>
            <p><strong>User:</strong></p>
            <pre>${JSON.stringify(data.user, null, 2)}</pre>
        `;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = `
            <p class="error">Error: ${error.message}</p>
        `;
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

// Add event listeners
loginButton.addEventListener('click', signIn);
logoutButton.addEventListener('click', signOut);
helloButton.addEventListener('click', getHelloMessage);
