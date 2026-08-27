import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents the blank space thing?
    try { 
        console.log("Attempting login with:", email, password);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
            "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
        throw new Error("something wong", response.status,response.message);
        }
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
        console.log("Login successful");
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}