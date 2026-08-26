export default function Landing() {
    console.log("Landing");
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Resolver</h1>
      <p>Track complaints. Resolve faster.</p>
      
      <div style={{ marginTop: "2rem" }}>
        <a href="/login" style={{ marginRight: "1rem", padding: "10px 20px", background: "blue", color: "white", textDecoration: "none" }}>
          Login
        </a>
        <a href="/register" style={{ padding: "10px 20px", background: "green", color: "white", textDecoration: "none" }}>
          Register
        </a>
      </div>
    </div>
  );
}