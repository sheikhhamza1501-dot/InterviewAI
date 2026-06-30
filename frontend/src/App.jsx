import { useEffect } from "react";
import api from "./services/api";

function App() {

    useEffect(() => {

        api.get("/interviews")
            .then((response) => {
                console.log("Protected API Success");
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        <div className="container mt-5">
            <h1>Interview AI</h1>
            <p>JWT Authentication Test</p>
        </div>
    );
}

export default App;