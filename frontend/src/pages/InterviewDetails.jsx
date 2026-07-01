import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function InterviewDetails() {

    const { id } = useParams();

    const [interview, setInterview] = useState(null);

    useEffect(() => {
        fetchInterview();
    }, []);

    const fetchInterview = async () => {

        try {

            const response = await api.get(`/interviews/${id}`);

            setInterview(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load interview.");

        }

    };

    if (!interview) {

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    return (

        <div className="container mt-4">

            <h2>Interview Details</h2>

            <hr />

            <div className="card shadow p-4">

                <h3>{interview.jobRole}</h3>

                <p>

                    <strong>Experience:</strong>

                    {" "}

                    {interview.experienceLevel}

                </p>

                <p>

                    <strong>Created:</strong>

                    {" "}

                    {new Date(interview.createdAt).toLocaleString()}

                </p>

            </div>

        </div>

    );

}

export default InterviewDetails;