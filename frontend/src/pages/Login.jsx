import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
const handleLogin = async () => {
    

    try {

       const token = await login(email, password);
console.log("JWT Token:",token);
// Save JWT token
localStorage.setItem("token",token);
console.log("Saved:", localStorage.getItem("token"));

alert("Login Successful!");
 navigate("/dashboard"); 

    } catch (error) {
console.log(error);

    console.log(error.response);

    console.log(error.response?.data);

    alert("Login Failed");

    }
};
    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>

            <h2 className="mb-4">Login</h2>
<p className="text-center mt-3">

    Don't have an account?

    <button
        className="btn btn-link"
        onClick={() => navigate("/register")}
    >
        Register
    </button>

</p>
            <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

          <button
    className="btn btn-primary w-100"
    onClick={handleLogin}
>
    Login
</button>

        </div>
    );
}

export default Login;