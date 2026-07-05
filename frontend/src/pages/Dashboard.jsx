import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { deleteInterview } from "../services/InterviewService";
import { useNavigate } from "react-router-dom";


function Dashboard() {

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {

        setLoading(true);

        try {

            const response = await api.get("/interviews");

            console.log(response.data);

            setInterviews(response.data);

            setLoading(false);

        } catch (error) {

            console.log(error);
            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this interview?"
    );

    if (!confirmDelete) return;

    try {

        await deleteInterview(id);

        alert("Interview deleted successfully!");

        fetchInterviews();

    } catch (error) {

        console.log(error);

        alert("Failed to delete interview.");

    }

};

if (loading) {

    return (

        <>
            <Navbar />

            <div className="container text-center mt-5">

                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>

                <p className="mt-3">
                    Loading Interviews...
                </p>

            </div>

        </>

    );

}

const getTotalInterviews = () => {
    return interviews.length;
};

const getCompletedInterviews = () => {
    return interviews.filter(
        interview => interview.completed === true
    ).length;
};

const getPendingInterviews = () => {
    return interviews.filter(
        interview => !interview.completed
    ).length;
};
return (
    <>
        <Navbar />

        <div className="container mt-4">

          <div className="row mb-4">

    <div className="col-md-3">

        <div className="card shadow text-center">

            <div className="card-body">

                <h5>Total Interviews</h5>

                <h2>{getTotalInterviews()}</h2>

            </div>

        </div>

    </div>

    <div className="col-md-3">

        <div className="card shadow text-center">

            <div className="card-body">

                <h5>Completed</h5>

                <h2>{getCompletedInterviews()}</h2>

            </div>

        </div>

    </div>

    <div className="col-md-3">

        <div className="card shadow text-center">

            <div className="card-body">

                <h5>Pending</h5>

                <h2>{getPendingInterviews()}</h2>

            </div>

        </div>

    </div>

</div>  

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Dashboard
                    </h2>

                    <p className="text-muted">
                        Manage your interviews
                    </p>

                </div>

            </div>

            {
                interviews.length === 0 ?

                (

                    <div className="alert alert-info text-center">

                        <h4>No Interviews Found</h4>

                        <p>
                            Click "Create Interview" to create your first interview.
                        </p>

                    </div>

                )

                :

                (

                    interviews.map((interview) => (

                        <div
                            key={interview.id}
                            className="card shadow border-0 rounded-4 mb-4"
                        >

                            <div className="card-body p-4">

                                <h4>{interview.jobRole}</h4>

                                <p className="mb-2">
                                    <strong>Experience:</strong> {interview.experienceLevel}
                                </p>
                                <p className="mb-2">
    <strong>Status:</strong>{" "}

    {interview.completed ? (

        <span className="badge bg-success">
            Completed
        </span>

    ) : (

        <span className="badge bg-warning text-dark">
            Pending
        </span>

    )}

</p>
                                <p className="text-muted">
                                    <strong>Created:</strong>{" "}
                                    {new Date(interview.createdAt).toLocaleString()}
                                </p>

                                <button
                                    className="btn btn-primary me-2"
                                    onClick={() => navigate(`/interview/${interview.id}`)}
                                >
                                    View Details
                                </button>
                                <button
    className="btn btn-success ms-2"
    onClick={() => navigate(`/report/${interview.id}`)}
>
    View Report
</button>
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => navigate(`/edit/${interview.id}`)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(interview.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )
            }

        </div>

    </>
);
}

export default Dashboard;