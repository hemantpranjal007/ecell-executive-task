import { useState, useEffect } from "react";
import "./App.css";
import ecellLogo from "./assets/ecell-logo.webp";
import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { auth, googleProvider } from "./firebase"; 

function App() {
  const [page, setPage] = useState(
  window.location.hash.replace("#", "") || "home"
);

useEffect(() => {
  window.location.hash = page;
}, [page]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("ecellLoggedIn") === "true"
  );

  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // -------------------------
  // Authentication
  // -------------------------
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const additionalInfo = getAdditionalUserInfo(result);
const isNewUser = additionalInfo?.isNewUser;

    // LOGIN MODE
    if (!isSignup && isNewUser) {
      await auth.signOut();
      setMessage("No account found. Please sign up first.");
      return;
    }

    // SAVE USER
    localStorage.setItem(
      "ecellUser",
      JSON.stringify({
        name: user.displayName,
        email: user.email,
        password: "",
      })
    );

    localStorage.setItem("ecellLoggedIn", "true");

    setIsLoggedIn(true);

    setMessage(
      isSignup
        ? "Account created successfully!"
        : "Google sign-in successful!"
    );

    setTimeout(() => {
      setPage("dashboard");
      setMessage("");
    }, 700);
  } catch (error) {
    console.error("Google sign-in error:", error);
    setMessage("Google sign-in was cancelled or failed.");
  }
};
  const handleSubmit = (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    setMessage("Please fill in all required fields.");
    return;
  }

  // SIGNUP
  if (isSignup) {
    if (!form.name) {
      setMessage("Please enter your name.");
      return;
    }

    // Save account details
    localStorage.setItem(
      "ecellUser",
      JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    );

    localStorage.setItem("ecellLoggedIn", "true");

    setIsLoggedIn(true);

    setMessage("Account created successfully!");

    setTimeout(() => {
      setPage("dashboard");
      setMessage("");
    }, 700);

    return;
  }

  // LOGIN
  const savedUser = localStorage.getItem("ecellUser");

  if (!savedUser) {
    setMessage("No account found. Please sign up first.");
    return;
  }

  const user = JSON.parse(savedUser);

  if (form.email !== user.email || form.password !== user.password) {
    setMessage("Invalid email or password.");
    return;
  }

  localStorage.setItem("ecellLoggedIn", "true");

  setIsLoggedIn(true);

  setMessage("Login successful!");

  setTimeout(() => {
    setPage("dashboard");
    setMessage("");
  }, 700);
};

  const handleLogout = () => {
    localStorage.removeItem("ecellLoggedIn");


    setIsLoggedIn(false);
    setPage("home");
    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  // -------------------------
  // Login / Signup
  // -------------------------
  if (page === "login") {
    return (
      <AuthPage
        isSignup={false}
        form={form}
        setForm={setForm}
        message={message}
        handleSubmit={handleSubmit}
        handleGoogleLogin={handleGoogleLogin}
        switchMode={() => {
  setIsSignup(true);
  setPage("signup");
  setMessage("");
}}
        goHome={() => setPage("home")}
      />
    );
  }

  if (page === "signup") {
    return (
      <AuthPage
        isSignup={true}
        form={form}
        setForm={setForm}
        message={message}
        handleSubmit={handleSubmit}
        handleGoogleLogin={handleGoogleLogin}
       switchMode={() => {
  setIsSignup(false);
  setPage("login");
  setMessage("");
}}
        goHome={() => setPage("home")}
      />
    );
  }

  // -------------------------
  // Dashboard
  // -------------------------
  if (page === "dashboard") {
    if (!isLoggedIn) {
      setPage("login");
      return null;
    }

   const savedUser = localStorage.getItem("ecellUser");
const user = savedUser ? JSON.parse(savedUser).name : "Member";

    return (
      <div className="app">
        <header className="navbar">
         <div className="brand" onClick={() => setPage("dashboard")}>
  <img src={ecellLogo} alt="E-Cell Logo" />
</div>

          <button className="nav-login" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="dashboard">
          <div className="dashboard-card">
            <div className="success-icon">✓</div>

            <span className="eyebrow">
              AUTHENTICATION SUCCESSFUL
            </span>

            <h1>
              Welcome, <span>{user}</span>
            </h1>

            <p>
              You have successfully authenticated with E-Cell.
            </p>

            <div className="dashboard-box">
              <div>
                <strong>Dashboard</strong>
                <p>Your authentication flow is complete.</p>
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={() => setPage("home")}
            >
              Back to Home →
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // -------------------------
  // Landing Page
  // -------------------------
  return (
    <div className="app">
      <header className="navbar">
      <div className="brand" onClick={() => setPage("home")}>
  <img src={ecellLogo} alt="E-Cell Logo" />
  <span>E-Cell</span>
</div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <button
              className="nav-login"
              onClick={() => setPage("dashboard")}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                className="nav-link"
                onClick={() => {
                  setIsSignup(false);
                  setPage("login");
                }}
              >
                Login
              </button>

              <button
                className="nav-signup"
                onClick={() => {
                  setIsSignup(true);
                  setPage("signup");
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main className="hero">
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="eyebrow">
            ENTREPRENEURSHIP • INNOVATION • LEADERSHIP
          </div>

          <h1>
            Build.
            <span> Innovate.</span>
            <br />
            Lead.
          </h1>

          <p>
            Empowering students to transform ideas into impactful
            ventures through innovation, collaboration and
            entrepreneurship.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => {
                if (isLoggedIn) {
                  setPage("dashboard");
                } else {
                  setIsSignup(true);
                  setPage("signup");
                }
              }}
            >
              Get Started →
            </button>

            <button
              className="secondary-btn"
              onClick={() => {
                if (isLoggedIn) {
                  setPage("dashboard");
                } else {
                  setIsSignup(false);
                  setPage("login");
                }
              }}
            >
              {isLoggedIn ? "Open Dashboard" : "Login"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// -------------------------
// Authentication Component
// -------------------------
function AuthPage({
  isSignup,
  form,
  setForm,
  message,
  handleSubmit,
  handleGoogleLogin,
  switchMode,
  goHome,
}) {
  return (
    <div className="auth-page">
      <div className="auth-glow"></div>

      <div className="auth-container">
        <button className="back-btn" onClick={goHome}>
          ← Back
        </button>

        <div className="auth-card">
          <div className="auth-brand">E-Cell</div>

          <span className="eyebrow">
            {isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </span>

          <h1>
            {isSignup ? "Join E-Cell." : "Welcome back."}
          </h1>

          <p className="auth-description">
            {isSignup
              ? "Create your account and become part of the innovation ecosystem."
              : "Login to continue to your E-Cell dashboard."}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {message && (
              <div className="form-message">
                {message}
              </div>
            )}

            <button className="auth-btn" type="submit">
  {isSignup ? "Create Account" : "Login"}
</button>

<div className="auth-divider">
  <span>OR</span>
</div>

<button
  type="button"
  className="google-btn"
  onClick={handleGoogleLogin}
>
  <span className="google-icon">G</span>
  Continue with Google
</button>

</form>
          <div className="switch-auth">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button onClick={switchMode}>
              {isSignup ? " Login" : " Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------
// Footer
// -------------------------
function Footer() {
  return (
    <footer className="footer">
      <div>
        © 2026 E-Cell. All rights reserved.
      </div>

      <div className="footer-links">
        <a href="#instagram">Instagram</a>
        <a href="#linkedin">LinkedIn</a>
        <a href="mailto:ecell@example.com">Email</a>
      </div>
    </footer>
  );
}

export default App;