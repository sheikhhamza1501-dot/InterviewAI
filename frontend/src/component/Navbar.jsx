import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

let email = "";

if (token) {

    try {

        email = JSON.parse(atob(token.split(".")[1])).sub;

    } catch (error) {

        email = "";

    }

}

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

 return (

<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">

<div className="container">

<Link className="navbar-brand fw-bold" to="/dashboard">

Interview AI

</Link>

<div className="d-flex align-items-center">

<span className="text-white me-3">

{email}

</span>

<Link
className="btn btn-outline-light me-2"
to="/dashboard"
>

Dashboard

</Link>

<Link
className="btn btn-success me-2"
to="/create"
>

Create Interview

</Link>

<button
className="btn btn-danger"
onClick={handleLogout}
>

Logout

</button>

</div>

</div>

</nav>

);

}

export default Navbar;