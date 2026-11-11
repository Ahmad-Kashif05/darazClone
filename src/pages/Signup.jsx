
import { Link } from "react-router-dom";

function Signup() {
  function handleSubmit(event) {
    event.preventDefault();
    alert(
      "Signup functionality backend ke saath aglay phase mein connect hogi."
    );
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
        <h1 style={{ textAlign: "center" }}>Create Account</h1>

        <p style={{ textAlign: "center", color: "#757575" }}>
          Join us and start shopping
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            minLength={2}
            required
            style={inputStyle}
          />

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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#f85606" }}>
            Login
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

export default Signup;
