import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {

        try {

            const response = await register(fullName, email, password);

            alert(response);

            navigate("/");

        } catch (error) {

            console.log(error);

            alert("Registration Failed");

        }
    };

    return (

        <div className="container mt-5" style={{ maxWidth: "450px" }}>

            <h2 className="mb-4">Register</h2>

            <input
                className="form-control mb-3"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />

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
                className="btn btn-success w-100"
                onClick={handleRegister}
            >
                Register
            </button>

        </div>
    );
}

export default Register;