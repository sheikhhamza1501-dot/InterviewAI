import { useState } from "react";
import Navbar from "../component/Navbar";
import { createInterview } from "../services/InterviewService";
import { useNavigate } from "react-router-dom";


function CreateInterview() {

    const [jobRole, setJobRole] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        await createInterview({
            jobRole,
            experienceLevel
        });

        alert("Interview Created Successfully!");

        navigate("/dashboard");

    } catch (error) {

        console.log(error);

        alert("Failed to create interview");

    }

};

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Create Interview</h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Job Role
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            placeholder="Enter Job Role"
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Experience Level
                        </label>

                        <select
                            className="form-select"
                            value={experienceLevel}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Fresher">Fresher</option>
                            <option value="1-3 Years">1-3 Years</option>
                            <option value="3-5 Years">3-5 Years</option>
                            <option value="5+ Years">5+ Years</option>
                        </select>

                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Create Interview
                    </button>

                </form>

            </div>
        </>
    );
}

export default CreateInterview;