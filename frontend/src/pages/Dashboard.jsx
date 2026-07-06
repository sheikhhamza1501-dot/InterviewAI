import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { deleteInterview } from "../services/InterviewService";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/interviewService";

function Dashboard() {

    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInterviews();
         fetchDashboardStats();
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

    const fetchDashboardStats = async () => {

    try {

        const data = await getDashboardStats();

        setStats(data);

    } catch (error) {

        console.log(error);

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


return (
    <>
        <Navbar />

        <div className="container mt-4">

            {stats && (

    <div className="row g-3 mb-4 justify-content-center">

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">

          <div className="card shadow-lg border-0 rounded-4 text-center h-100">

                <div className="card-body">

                    <div className="mb-2">

    <span style={{ fontSize: "2rem" }}>
        📊
    </span>

</div>

<h6 className="fw-bold">
    Total Interviews
</h6>

                    <h2>{stats.totalInterviews}</h2>

                </div>

            </div>

        </div>

      <div className="col-lg-2 col-md-4 col-sm-6 mb-3">

            <div className="card shadow-lg border-0 rounded-4 text-center h-100">

                <div className="card-body">

                    <div className="mb-2">

    <span style={{ fontSize: "2rem" }}>
        ✅
    </span>

</div>

<h6 className="fw-bold">
    Completed
</h6>

                    <h2 className="text-success">
                        {stats.completedInterviews}
                    </h2>

                </div>

            </div>

        </div>

      <div className="col-lg-2 col-md-4 col-sm-6 mb-3">

          <div className="card shadow-lg border-0 rounded-4 text-center h-100">

                <div className="card-body">

                    <div className="mb-2">

    <span style={{ fontSize: "2rem" }}>
        ⏳
    </span>

</div>

<h6 className="fw-bold">
    Pending
</h6>

                    <h2 className="text-warning">
                        {stats.pendingInterviews}
                    </h2>

                </div>

            </div>

        </div>

       <div className="col-lg-2 col-md-4 col-sm-6 mb-3">

           <div className="card shadow-lg border-0 rounded-4 text-center h-100">

                <div className="card-body">

                  <div className="mb-2">

    <span style={{ fontSize: "2rem" }}>
        ⭐
    </span>

</div>

<h6 className="fw-bold">
    Average Score
</h6>

                    <h2 className="text-primary">

                        {stats.averageScore
                            ? stats.averageScore.toFixed(1)
                            : "0.0"}

                        /10

                    </h2>

                </div>

            </div>
</div>

           <div className="col-lg-2 col-md-4 col-sm-6 mb-3">

   <div className="card shadow-lg border-0 rounded-4 text-center h-100">

        <div className="card-body">

            <div className="mb-2">

    <span style={{ fontSize: "2rem" }}>
        🏆
    </span>

</div>

<h6 className="fw-bold">
    Best Score
</h6>

            <h2 className="text-success">

                {stats.bestScore
                    ? stats.bestScore.toFixed(1)
                    : "0.0"}

                /10

            </h2>

        </div>

    </div>

</div>
</div>
            )}

            {stats && (

<div className="card shadow-lg border-0 rounded-4 mb-4">

    <div className="card-body">

        <h5 className="mb-3">
            📈 Interview Progress
        </h5>

        <div className="progress" style={{ height: "25px" }}>

            <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                    width: `${
                        stats.totalInterviews > 0
                            ? (stats.completedInterviews / stats.totalInterviews) * 100
                            : 0
                    }%`
                }}
            >

                {stats.totalInterviews > 0
                    ? Math.round(
                        (stats.completedInterviews / stats.totalInterviews) * 100
                    )
                    : 0
                }%

            </div>

        </div>

        <p className="mt-3 mb-0 text-muted">

            {stats.completedInterviews} of {stats.totalInterviews} interviews completed

        </p>

    </div>

</div>

)}

{stats && (

<div className="card shadow-lg border-0 rounded-4 mb-4">

    <div className="card-body text-center">

        <h5 className="mb-3">
            🎯 Performance
        </h5>

        {

            stats.averageScore >= 8 ?

            (

                <span className="badge bg-success fs-6 p-3">

                    🟢 Excellent Performance

                </span>

            )

            :

            stats.averageScore >= 6 ?

            (

                <span className="badge bg-warning text-dark fs-6 p-3">

                    🟡 Good Performance

                </span>

            )

            :

            (

                <span className="badge bg-danger fs-6 p-3">

                    🔴 Needs Improvement

                </span>

            )

        }

    </div>

</div>

)}
<div className="card shadow-lg border-0 rounded-4 mb-4">

    <div className="card-body">

        <h5 className="mb-3">
            🕒 Recent Activity
        </h5>

        {

            interviews.length === 0 ?

            (

                <p className="text-muted">
                    No recent interviews.
                </p>

            )

            :

            (

                interviews
                    .slice(0, 3)
                    .map((interview) => (

                        <div
                            key={interview.id}
                            className="border-bottom pb-2 mb-2"
                        >

                            <strong>

                                {interview.jobRole}

                            </strong>

                            <br />

                            <small className="text-muted">

                                {interview.experienceLevel}

                                {" • "}

                                {new Date(
                                    interview.createdAt
                                ).toLocaleString()}

                            </small>

                        </div>

                    ))

            )

        }

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

    <div>

        <button
            className="btn btn-success me-2"
            onClick={() => navigate("/create")}
        >
            ➕ Create Interview
        </button>

        <button
            className="btn btn-primary"
            onClick={() => {
                fetchInterviews();
                fetchDashboardStats();
            }}
        >
            🔄 Refresh
        </button>

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
                                className="card shadow border-0 rounded-4 mb-4 interview-card"
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
    className="btn btn-primary btn-sm me-2"
    onClick={() => navigate(`/interview/${interview.id}`)}
>
    👁 View
</button>

<button
    className="btn btn-success btn-sm me-2"
    onClick={() => navigate(`/report/${interview.id}`)}
>
    📄 Report
</button>

<button
    className="btn btn-warning btn-sm me-2"
    onClick={() => navigate(`/edit/${interview.id}`)}
>
    ✏ Edit
</button>

<button
    className="btn btn-danger btn-sm"
    onClick={() => handleDelete(interview.id)}
>
    🗑 Delete
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