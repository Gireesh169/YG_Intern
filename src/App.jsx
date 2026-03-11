import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "798632571978-31mnq3gjq31oqddheviqtimpe2j3knc3.apps.googleusercontent.com";

function App() {

  const handleLoginSuccess = async (credentialResponse) => {

    const token = credentialResponse.credential;

    try {

      const res = await fetch(
        "https://plain-resonance-9958.davaleswarapugireesh.workers.dev",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: token
          })
        }
      );

      const data = await res.json();

      console.log(data);

      alert("Login Successful!");

    } catch (err) {

      console.error(err);
      alert("API Error");

    }

  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <h1>Login System</h1>

        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Login Failed")}
        />

      </div>
    </GoogleOAuthProvider>
  );
}

export default App;