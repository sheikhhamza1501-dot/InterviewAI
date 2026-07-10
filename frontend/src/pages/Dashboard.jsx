import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { deleteInterview } from "../services/InterviewService";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/interviewService";
import axios from "axios";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
} from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
function Dashboard() {

    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("Newest");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scoreTrend, setScoreTrend] = useState([]);
    const [performanceHistory, setPerformanceHistory] = useState([]);
    const dashboardRef = useRef(null);
    const interviewsPerPage = 5;

    useEffect(() => {
        fetchInterviews();
        fetchDashboardStats();
        fetchScoreTrend();
        fetchPerformanceHistory();
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
    const fetchScoreTrend = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(

                "http://localhost:8080/api/interviews/dashboard/score-trend",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setScoreTrend(response.data);

        } catch (error) {

            console.error(error);

        }

    };
    const fetchPerformanceHistory = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/interviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPerformanceHistory(response.data);

        } catch (error) {

            console.error(error);

        }

    };

const exportDashboardPDF = () => {

    const element = dashboardRef.current;

    const options = {
        margin: [12,10,12,10],
        filename: "InterviewAI_Dashboard.pdf",
        image: {
            type: "png",
            quality: 1
        },
        html2canvas: {
               scale: 1.5,
    useCORS: true,
    letterRendering: true,
    scrollY: 0
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        },
        pagebreak: {
            mode: ["avoid-all", "css", "legacy"]
        }
    };

    html2pdf().set(options).from(element).save();

};
    console.log(interviews);
    interviews.forEach((interview) => {
        console.log(interview);
    });
    const excellent = interviews.filter(
        interview => interview.averageScore >= 8
    ).length;

    const good = interviews.filter(
        interview =>
            interview.averageScore >= 6 &&
            interview.averageScore < 8
    ).length;

    const poor = interviews.filter(
        interview => interview.averageScore < 6
    ).length;

    const chartData = {
        labels: [
            "Excellent",
            "Good",
            "Needs Improvement"
        ],
        datasets: [
            {
                data: [
                    excellent,
                    good,
                    poor
                ],
                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545"
                ],
                borderWidth: 2
            }
        ]
    };
    const lineChartData = {

        labels: scoreTrend.map(item => item.date),

        datasets: [

            {

                label: "Average Score",

                data: scoreTrend.map(item => item.score),

                borderColor: "#0d6efd",

                backgroundColor: "rgba(13,110,253,0.2)",

                fill: true,
                tension: 0.4,

                pointRadius: 6,

                pointHoverRadius: 8

            }

        ]

    };


    const fetchDashboardStats = async () => {

        try {

            const data = await getDashboardStats();

            setStats(data);

        } catch (error) {

            console.log(error);

        }

    };

    const difficultyData = {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
            {
                data: [
                    interviews.filter(i => i.difficulty === "Easy").length,
                    interviews.filter(i => i.difficulty === "Medium").length,
                    interviews.filter(i => i.difficulty === "Hard").length,
                ],
                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545",
                ],
            },
        ],
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this interview?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await deleteInterview(id);
            setDeletingId(null);

            setMessage("Interview deleted successfully!");
            setMessageType("success");

            setTimeout(() => {
                setMessage("");
            }, 3000);

            fetchInterviews();

        } catch (error) {

            console.log(error);
            setDeletingId(null);
            setMessage("Failed to delete interview.");
            setMessageType("danger");

            setTimeout(() => {
                setMessage("");
            }, 3000);

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

    const filteredInterviews = interviews
        .filter((interview) => {

            const matchesSearch = interview.jobRole
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                (statusFilter === "Completed" && interview.completed) ||
                (statusFilter === "Pending" && !interview.completed);

            return matchesSearch && matchesStatus;

        })
        .sort((a, b) => {

            if (sortOrder === "Newest") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            return new Date(a.createdAt) - new Date(b.createdAt);

        });

    const indexOfLastInterview = currentPage * interviewsPerPage;

    const indexOfFirstInterview =
        indexOfLastInterview - interviewsPerPage;

    const currentInterviews =
        filteredInterviews.slice(
            indexOfFirstInterview,
            indexOfLastInterview
        );

    const totalPages = Math.ceil(
        filteredInterviews.length / interviewsPerPage
    );

    // Calculate Interview Streak
    const sortedInterviews = [...interviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    let streak = 0;
    let previousDate = null;

    sortedInterviews.forEach((interview) => {
        const currentDate = new Date(interview.createdAt)
            .toISOString()
            .split("T")[0];

        if (!previousDate) {
            streak++;
            previousDate = currentDate;
        } else {
            const diff =
                (new Date(previousDate) - new Date(currentDate)) /
                (1000 * 60 * 60 * 24);

            if (diff === 1) {
                streak++;
                previousDate = currentDate;
            }
        }
    });
    let streakMessage = "";

    if (streak === 0) {
        streakMessage = "😊 Take your first interview today!";
    } else if (streak < 3) {
        streakMessage = "🚀 Great Start! Keep Going!";
    } else if (streak < 7) {
        streakMessage = "💪 Keep Practicing!";
    } else {
        streakMessage = "🔥 Amazing Interview Streak!";
    }

    const avgScore = stats?.averageScore || 0;

    let performanceBadge = "";
    let performanceColor = "";

    if (avgScore >= 9) {
        performanceBadge = "🏆 Expert";
        performanceColor = "success";
    } else if (avgScore >= 8) {
        performanceBadge = "🥇 Advanced";
        performanceColor = "primary";
    } else if (avgScore >= 7) {
        performanceBadge = "🥈 Intermediate";
        performanceColor = "warning";
    } else if (avgScore >= 6) {
        performanceBadge = "🥉 Beginner";
        performanceColor = "secondary";
    } else {
        performanceBadge = "📚 Keep Practicing";
        performanceColor = "danger";
    }

    const scores = interviews
        .map(interview => interview.averageScore || 0);

    const highestScore =
        scores.length > 0 ? Math.max(...scores) : 0;

    const lowestScore =
        scores.length > 0 ? Math.min(...scores) : 0;

    console.log(scoreTrend);
    console.log(lineChartData);
    return (
        <div>
            <Navbar />
            {message && (

                <div className={`alert alert-${messageType} text-center m-3`}>

                    {message}

                </div>

            )}

            <div
                className="container mt-4"
                ref={dashboardRef}
            >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                    <div className="mb-3 mb-md-0">

                        <h1 className="fw-bold mb-1">
                            Dashboard
                        </h1>

                        <p className="text-muted mb-0">
                            Manage your interviews
                        </p>
                    </div>

                    <div className="d-flex flex-wrap gap-2">

                        <button
                            className="btn btn-success"
                            onClick={() => navigate("/create")}
                        >
                            ➕ Create Interview
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={fetchInterviews}
                        >
                            🔄 Refresh
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={exportDashboardPDF}
                        >
                            📄 Export Dashboard
                        </button>

                    </div>

                </div>
                {stats && (

                    <div className="row g-3 mb-4 justify-content-center">
                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h2 className="fw-bold">
                                    Welcome Back 👋
                                </h2>

                                <p className="text-muted mb-0">
                                    Here's your interview performance overview.
                                </p>

                            </div>

                        </div>
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

                                    <span className={`badge bg-${performanceColor} fs-6 mt-2`}>
                                        {performanceBadge}
                                    </span>

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

                        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">

                            <div className="card shadow-lg border-0 rounded-4 text-center h-100">

                                <div className="card-body">

                                    <div className="mb-2">

                                        <span style={{ fontSize: "2rem" }}>
                                            🔥
                                        </span>

                                    </div>

                                    <h6 className="fw-bold">
                                        Interview Streak
                                    </h6>

                                    <h2 className="text-danger">
                                        {streak}
                                    </h2>

                                    <small className="text-muted">
                                        Consecutive Days
                                    </small>

                                    <p
                                        className="mt-2 mb-0"
                                        style={{
                                            fontSize: "0.85rem",
                                            color: "#0d6efd",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {streakMessage}
                                    </p>


                                </div>

                            </div>

                        </div>

                        <div className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h4 className="mb-0">
                                    📊 Performance Distribution
                                </h4>

                                <span className="badge bg-primary fs-6">
                                    {interviews.length} Interviews
                                </span>

                            </div>

                            <div
                                className="d-flex justify-content-center"
                                style={{
                                    width: "320px",
                                    margin: "0 auto",
                                }}
                            >
                                <Doughnut
                                    data={{
                                        labels: [
                                            "Excellent (8-10)",
                                            "Good (5-7.9)",
                                            "Needs Improvement (<5)",
                                        ],
                                        datasets: [
                                            {
                                                data: [
                                                    excellent,
                                                    good,
                                                    poor,
                                                ],
                                                backgroundColor: [
                                                    "#22c55e",
                                                    "#facc15",
                                                    "#ef4444",
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }}
                                />
                            </div>
                        </div>
                        <div className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                📈 Score Trend
                            </h4>

                            <Line
                                data={lineChartData}
                                options={{
                                    responsive: true,
                                    scales: {
                                        y: {
                                            min: 0,
                                            max: 10
                                        }
                                    }
                                }}
                            />

                        </div>
                        <div className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                📋 Interview Performance History
                            </h4>

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>Date</th>

                                            <th>Job Role</th>

                                            <th>Average Score</th>
                                            <th>Status</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {performanceHistory.map((item) => (

                                            <tr key={item.id}>

                                                <td>
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    {item.jobRole}
                                                </td>
                                                <td>

                                                    ⭐ {item.averageScore?.toFixed(1) || "0.0"}

                                                </td>

                                                <td>

                                                    {item.completed ? (

                                                        <span className="badge bg-success">

                                                            Completed

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-warning text-dark">

                                                            Pending

                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        <div className="mt-4">

                            <div className="d-flex justify-content-between align-items-center mb-2">

                                <span className="text-success fw-bold">
                                    🟢 Excellent
                                </span>

                                <span className="badge bg-success">
                                    {excellent}
                                </span>

                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2">

                                <span className="text-warning fw-bold">
                                    🟡 Good
                                </span>

                                <span className="badge bg-warning text-dark">
                                    {good}
                                </span>

                            </div>

                            <div className="d-flex justify-content-between align-items-center">

                                <span className="text-danger fw-bold">
                                    🔴 Needs Improvement
                                </span>

                                <span className="badge bg-danger">
                                    {poor}
                                </span>

                            </div>

                        </div>
                        <div className="text-center mt-4">

                            <h6 className="text-muted">
                                Overall Average Score
                            </h6>

                            <h3 className="fw-bold text-primary">
                                {stats?.averageScore?.toFixed(1) || "0.0"} / 10
                            </h3>

                        </div>
                        <div className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                📌 Performance Insights
                            </h4>

                            <div className="row">

                                <div className="col-md-4">

                                    <div className="card text-center border-success">

                                        <div className="card-body">

                                            <h6>🏆 Best Score</h6>

                                            <h3 className="text-success">
                                                {highestScore.toFixed(1)}
                                            </h3>

                                        </div>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="card text-center border-danger">

                                        <div className="card-body">

                                            <h6>📉 Lowest Score</h6>

                                            <h3 className="text-danger">
                                                {lowestScore.toFixed(1)}
                                            </h3>

                                        </div>

                                    </div>

                                </div>

                                <div className="col-md-4">

                                    <div className="card text-center border-primary">

                                        <div className="card-body">

                                            <h6>📊 Total Interviews</h6>

                                            <h3 className="text-primary">
                                                {interviews.length}
                                            </h3>

                                        </div>

                                    </div>

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
                                        width: `${stats.totalInterviews > 0
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
                                                <h6 className="mb-1">
                                                    ✔ {interview.jobRole}
                                                </h6>
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





                <div className="row g-3 mb-5">

                    <div className="col-lg-5 col-md-6">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 Search by Job Role..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                    </div>

                    <div className="col-lg-2 col-md-3">

                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >

                            <option value="All">All Interviews</option>

                            <option value="Completed">Completed</option>

                            <option value="Pending">Pending</option>

                        </select>

                    </div>
                    <div className="col-lg-2 col-md-3">

                        <select
                            className="form-select"
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value);
                                setCurrentPage(1);
                            }}
                        >

                            <option value="Newest">Newest First</option>
                            <option value="Oldest">Oldest First</option>

                        </select>

                    </div>
                    <div className="col-lg-2 col-md-3 d-grid">

                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("All");
                                setSortOrder("Newest");
                                setCurrentPage(1);
                            }}
                        >
                            Reset
                        </button>

                    </div>
                </div>


                <p className="text-muted mb-3">

                    Showing <strong>{filteredInterviews.length}</strong> of{" "}
                    <strong>{interviews.length}</strong> interviews

                </p>

                {
                    filteredInterviews.length === 0 ?

                        (

                            <div className="alert alert-warning text-center">

                                <h4>🔍 No Interviews Found</h4>

                                <p>
                                    Try changing your search or filter.
                                </p>

                            </div>

                        )

                        :

                        (

                            currentInterviews

                                .map((interview) => (

                                    <div
                                        key={interview.id}
                                        className="card shadow border-0 rounded-4 mb-4 interview-card"
                                    >

                                        <div className="card-body p-4">

                                            <h4 className="fw-bold text-primary">
                                                {interview.jobRole}
                                            </h4>

                                            <p className="mb-2 text-muted">

                                                💼 <strong>Experience:</strong> {interview.experienceLevel}

                                            </p>
                                            <p className="mb-3">

                                                <strong>Status:</strong>{" "}

                                                {interview.completed ? (

                                                    <span className="badge bg-success rounded-pill px-3 py-2">

                                                        ✅ Completed

                                                    </span>

                                                ) : (

                                                    <span className="badge bg-warning text-dark rounded-pill px-3 py-2">

                                                        ⏳ Pending

                                                    </span>

                                                )}

                                            </p>
                                            <p className="text-muted">
                                                📅 <strong>Created:</strong> {" "}
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
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(interview.id)}
                                                disabled={deletingId === interview.id}
                                            >
                                                {deletingId === interview.id ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                        ></span>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    "🗑 Delete"
                                                )}
                                            </button>


                                        </div>


                                    </div>

                                ))

                        )
                }

                {totalPages > 1 && (

                    <div className="d-flex justify-content-center mt-4">

                        <button
                            className="btn btn-outline-primary me-2"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (

                            <button
                                key={index}
                                className={
                                    currentPage === index + 1
                                        ? "btn btn-primary me-2"
                                        : "btn btn-outline-primary me-2"
                                }
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>

                        ))}

                        <button
                            className="btn btn-outline-primary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>


                )}


            </div>
        </div>



    );
}

export default Dashboard;