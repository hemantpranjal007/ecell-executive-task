import { useState, useEffect } from "react";
import "./App.css";

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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (isSignup && !form.name) {
      setMessage("Please enter your name.");
      return;
    }

    // Demo authentication
    localStorage.setItem("ecellLoggedIn", "true");
    if (isSignup) {
  localStorage.setItem("ecellUser", form.name);
}

    setIsLoggedIn(true);
    setMessage(
      isSignup
        ? "Account created successfully!"
        : "Login successful!"
    );

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
        switchMode={() => {
          setIsSignup(true);
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
        switchMode={() => {
          setIsSignup(false);
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

    const user = localStorage.getItem("ecellUser") || "Member";

    return (
      <div className="app">
        <header className="navbar">
          <div
            className="brand"
            onClick={() => setPage("dashboard")}
          >
            E-Cell
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
        <div
          className="brand"
          onClick={() => setPage("home")}
        >
          E-Cell
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
              {isSignup ? "Create Account →" : "Login →"}
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