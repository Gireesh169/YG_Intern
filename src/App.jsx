import { useEffect, useState } from "react";

const GOOGLE_CLIENT_ID =
  "798632571978-31mnq3gjq31oqddheviqtimpe2j3knc3.apps.googleusercontent.com";

function App() {
  const [GoogleOAuthProviderComponent, setGoogleOAuthProviderComponent] =
    useState(null);
  const [GoogleLoginComponent, setGoogleLoginComponent] = useState(null);
  const [sdkError, setSdkError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadGoogleSdk = async () => {
      try {
        const googleModule = await import("@react-oauth/google");

        if (!isMounted) {
          return;
        }

        setGoogleOAuthProviderComponent(() => googleModule.GoogleOAuthProvider);
        setGoogleLoginComponent(() => googleModule.GoogleLogin);
      } catch (error) {
        if (isMounted) {
          setSdkError(
            "Google login is unavailable right now. Please refresh and try again."
          );
        }

        console.error(error);
      }
    };

    loadGoogleSdk();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      alert("No credential received from Google.");
      return;
    }

    const { jwtDecode } = await import("jwt-decode");

    const user = jwtDecode(credentialResponse.credential);

    console.log("User Info:", user);

    const name = user.name;
    const email = user.email;

    try {

      const response = await fetch(
        "https://plain-resonance-9958.davaleswarapugireesh.workers.dev",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email
          })
        }
      );

      const data = await response.text();

      console.log("API Response:", data);

      alert("Login Successful!");

    } catch (error) {

      console.error(error);
      alert("API Error");

    }

  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "12px",
        backgroundColor: "#f8fafc",
        color: "#111827",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
      }}
    >
      <h1>Login System</h1>

      {sdkError && <p>{sdkError}</p>}

      {!sdkError && !GoogleLoginComponent && <p>Loading Google login...</p>}

      {GoogleOAuthProviderComponent && GoogleLoginComponent && (
        <GoogleOAuthProviderComponent clientId={GOOGLE_CLIENT_ID}>
          <GoogleLoginComponent
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
          />
        </GoogleOAuthProviderComponent>
      )}
    </div>
  );
}

export default App;