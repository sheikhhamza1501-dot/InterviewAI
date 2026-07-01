import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditInterview() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [jobRole, setJobRole] = useState("");

    const [experienceLevel, setExperienceLevel] = useState("");

    useEffect(() => {
        fetchInterview();
    }, []);

    const fetchInterview = async () => {

        try {

            const response = await api.get(`/interviews/${id}`);

            setJobRole(response.data.jobRole);

            setExperienceLevel(response.data.experienceLevel);

        } catch (error) {

            console.log(error);

            alert("Failed to load interview.");

        }

    };

    const handleUpdate = async () => {

        try {

            await api.put(`/interviews/${id}`, {

                jobRole,

                experienceLevel

            });

            alert("Interview Updated Successfully!");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Update Failed");

        }

    };

    return (

        <div className="container mt-5" style={{ maxWidth: "500px" }}>

            <h2>Edit Interview</h2>

            <hr />

            <input
                className="form-control mb-3"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
            />

            <input
                className="form-control mb-3"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
            />

            <button
                className="btn btn-success w-100"
                onClick={handleUpdate}
            >
                Update Interview
            </button>

        </div>

    );

}

export default EditInterview;