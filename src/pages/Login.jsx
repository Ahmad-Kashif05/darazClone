
import { Link } from "react-router-dom";

function Login() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Login functionality backend ke saath aglay phase mein connect hogi.");
  }

  return (
    <main className="container" style={{ padding: "40px 0" }}>
      <section
        style={{
          maxWidth: "430px",
          margin: "0 auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px #0000000d",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Welcome Back</h1>
        <p style={{ textAlign: "center", color: "#757575" }}>
          Login to your account
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            style={inputStyle}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#f85606" }}>
            Sign up
          </Link>
        </p>

        <p style={{ textAlign: "center" }}>
          <Link to="/" style={{ color: "#757575" }}>
            Back to Home
          </Link>
        </p>
      </section>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  margin: "8px 0 18px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "#f85606",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default Login;
