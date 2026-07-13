import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../component/Navbar";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/interviewService";
import axios from "axios";
import {
    deleteInterview,
    toggleFavorite
} from "../services/InterviewService";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import { useRef } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement
} from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
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
    const [rolePerformance, setRolePerformance] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const scoreTrendRef = useRef(null);
    const performanceDistributionRef = useRef(null);
    const rolewisePerformanceRef = useRef(null);
    const monthlyInterviewRef = useRef(null);
    const weeklyActivityRef = useRef(null);
    const [dateFilter, setDateFilter] = useState("ALL");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const interviewsPerPage = 5;

    useEffect(() => {
        fetchInterviews();
        fetchDashboardStats();
        fetchScoreTrend();
        fetchPerformanceHistory();
        fetchRolePerformance();
        fetchMonthlyStats();
        fetchWeeklyActivity();
    }, [dateFilter]);

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

            let url =
                "http://localhost:8080/api/interviews/dashboard/score-trend";

            if (dateFilter !== "ALL") {

                url += `?days=${dateFilter}`;

            }

            const response = await axios.get(url, {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });
            console.log(response.data);
            setScoreTrend(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleToggleFavorite = async (id) => {

    try {

        await toggleFavorite(id);

        fetchInterviews();          // Refresh interview list
        fetchDashboardStats();      // Refresh dashboard counts if needed

    } catch (error) {

        console.error(error);

    }

};
    const fetchRolePerformance = async () => {

        try {

            const token = localStorage.getItem("token");

            let url = "http://localhost:8080/api/interviews/role-performance";

            if (dateFilter !== "ALL") {
                url += `?days=${dateFilter}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Role Performance:", response.data);
            setRolePerformance(response.data);

        } catch (error) {

            console.error(error);

        }

    };
    const fetchMonthlyStats = async () => {

        try {

            const token = localStorage.getItem("token");

            let url =
                "http://localhost:8080/api/interviews/monthly-stats";

            if (dateFilter !== "ALL") {

                url += `?days=${dateFilter}`;

            }

            const response = await axios.get(url, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            setMonthlyStats(response.data);

        } catch (error) {

            console.error(error);

        }

    };
const fetchWeeklyActivity = async () => {

    try {

        const token = localStorage.getItem("token");

        let url =
            "http://localhost:8080/api/interviews/dashboard/weekly-activity";

        if (dateFilter !== "ALL") {
            url += `?days=${dateFilter}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setWeeklyActivity(response.data);

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
            margin: [12, 10, 12, 10],
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
    const exportToCSV = () => {

        const headers = [
            "Job Role",
            "Experience Level",
            "Average Score",
            "Status",
            "Created Date"
        ];

        const rows = interviews.map(interview => [

            interview.jobRole,

            interview.experienceLevel,

            interview.averageScore ?? "0.0",

            interview.completed ? "Completed" : "Pending",

            new Date(interview.createdAt).toLocaleDateString("en-GB")

        ]);

        const csvContent = [

            headers.join(","),

            ...rows.map(row => row.join(","))

        ].join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        saveAs(blob, "InterviewAI_Dashboard.csv");

    };
    const downloadScoreTrend = async () => {

        if (!scoreTrendRef.current) return;

        try {

            const dataUrl = await htmlToImage.toPng(scoreTrendRef.current);

            const link = document.createElement("a");

            link.download = "Score_Trend.png";

            link.href = dataUrl;

            link.click();

        } catch (error) {

            console.error(error);

        }

    };
    const downloadPerformanceDistribution = async () => {

        if (!performanceDistributionRef.current) return;

        try {

            const dataUrl = await htmlToImage.toPng(performanceDistributionRef.current);

            const link = document.createElement("a");

            link.download = "Performance_Distribution.png";

            link.href = dataUrl;

            link.click();

        } catch (error) {

            console.error(error);

        }

    };
    const downloadrolewisePerformance = async () => {

        if (!rolewisePerformanceRef.current) return;

        try {

            const dataUrl = await htmlToImage.toPng(rolewisePerformanceRef.current);

            const link = document.createElement("a");

            link.download = "Role-wise_Performance.png";

            link.href = dataUrl;

            link.click();

        } catch (error) {

            console.error(error);

        }

    };

    const downloadmonthlyInterview = async () => {

        if (!monthlyInterviewRef.current) return;

        try {

            const dataUrl = await htmlToImage.toPng(monthlyInterviewRef.current);

            const link = document.createElement("a");

            link.download = "Monthly Interview Statistics.png";

            link.href = dataUrl;

            link.click();

        } catch (error) {

            console.error(error);

        }

    };
    const downloadweeklyActivity = async () => {

        if (!weeklyActivityRef.current) return;

        try {

            const dataUrl = await htmlToImage.toPng(weeklyActivityRef.current);

            const link = document.createElement("a");

            link.download = "Weekly Activity.png";

            link.href = dataUrl;

            link.click();

        } catch (error) {

            console.error(error);

        }


    };
    const getFilteredInterviews = () => {
let filtered=[...interviews];
        if (dateFilter !=="ALL"){

        const days = Number(dateFilter);

        const today = new Date();

        return interviews.filter(interview => {

            const created = new Date(interview.createdAt);

            const diff =
                (today - created) / (1000 * 60 * 60 * 24);

            return diff <= days;

        });
    }
       if (showFavoritesOnly) {

        filtered = filtered.filter(
            interview => interview.favorite
        );

    }

    return filtered;

    };

    const getMostPracticedRole = () => {
        const interviews = getFilteredInterviews();

        if (interviews.length === 0) {
            return {
                role: "No Data",
                count: 0
            };
        }

        const roleCount = {};

        interviews.forEach(interview => {

            const role = interview.jobRole;

            roleCount[role] = (roleCount[role] || 0) + 1;

        });

        let mostRole = "";
        let maxCount = 0;

        Object.entries(roleCount).forEach(([role, count]) => {

            if (count > maxCount) {

                maxCount = count;
                mostRole = role;

            }

        });

        return {
            role: mostRole,
            count: maxCount
        };

    };

    console.log(interviews);
    interviews.forEach((interview) => {
        console.log(interview);
    });
    const mostPracticedRole = getMostPracticedRole();

    const filteredDashboardInterviews = getFilteredInterviews();
    const excellent = filteredDashboardInterviews.filter(
        interview => interview.averageScore >= 8
    ).length;

    const good = filteredDashboardInterviews.filter(
        interview =>
            interview.averageScore >= 6 &&
            interview.averageScore < 8
    ).length;

    const poor = filteredDashboardInterviews.filter(
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

        labels: scoreTrend.map(item =>
            new Date(item.date).toLocaleDateString("en-GB")
        ),

        datasets: [

            {

                label: "Average Score",

                data: scoreTrend.map(item =>
                    item.score
                ),

                borderColor: "#0d6efd",

                backgroundColor: "rgba(13,110,253,0.2)",

                fill: true,
                tension: 0.4,

                pointRadius: 6,

                pointHoverRadius: 8

            }

        ]

    };
    const roleChartData = {

        labels: rolePerformance.map(item => item.jobRole),

        datasets: [

            {

                label: "Average Score",

                data: rolePerformance.map(item => item.averageScore),

                backgroundColor: "#0d6efd",

                borderRadius: 8,

            },

        ],

    };
    const monthlyChartData = {

        labels: monthlyStats.map(item => item.month),

        datasets: [

            {

                label: "Interviews",

                data: monthlyStats.map(item => item.count),

                borderColor: "#198754",

                backgroundColor: "#198754",

                fill: false,

                tension: 0.4,

                pointRadius: 5,

            },

        ],

    };
    const weeklyChartData = {

        labels: weeklyActivity.map(item => item.day),

        datasets: [

            {

                label: "Interviews",

                data: weeklyActivity.map(item => item.count),

                backgroundColor: "#fd7e14",

                borderRadius: 8,

            },

        ],

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

    const bestRole =
        rolePerformance.length > 0
            ? [...rolePerformance].sort(
                (a, b) => b.averageScore - a.averageScore
            )[0]
            : null;

    const weakestRole =
        rolePerformance.length > 0
            ? [...rolePerformance].sort(
                (a, b) => a.averageScore - b.averageScore
            )[0]
            : null;
    const topPerformers = [...rolePerformance]
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5);

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

    const filteredInterviews = getFilteredInterviews()
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

    switch (sortOrder) {

        case "Newest":
            return new Date(b.createdAt) - new Date(a.createdAt);

        case "Oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);

        case "Highest Score":
            return (b.averageScore || 0) - (a.averageScore || 0);

        case "Lowest Score":
            return (a.averageScore || 0) - (b.averageScore || 0);

        case "A-Z":
            return a.jobRole.localeCompare(b.jobRole);

        case "Z-A":
            return b.jobRole.localeCompare(a.jobRole);

        default:
            return 0;
    }

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

    console.log("bestRole:", bestRole);
    console.log("worstRole:", weakestRole);
    console.log("rolePerformance:", rolePerformance);
    console.log("topPerformers:", topPerformers);
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
                            className="btn btn-success"
                            onClick={exportToCSV}
                        >
                            📄 Export Excel
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
                        <div className="col-lg-3 col-md-6 mb-3">

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

                        <div className="col-lg-3 col-md-6 mb-3">

                            <div className="card text-center border-info">

                                <div className="card-body">

                                    <h6>🎯 Most Practiced Role</h6>

                                    <h5 className="text-info fw-bold">
                                        {mostPracticedRole.role}
                                    </h5>

                                    <p className="mb-0">
                                        {mostPracticedRole.count} Interviews
                                    </p>

                                </div>

                            </div>

                        </div>



                        <div className="col-lg-3 col-md-6 mb-3">

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

                        <div className="col-lg-3 col-md-6 mb-3">

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

                        <div className="col-lg-3 col-md-6 mb-3">

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

                        <div className="col-lg-3 col-md-6 mb-3">

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

                        <div className="col-lg-3 col-md-6 mb-3">

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
                        <div className="d-flex justify-content-end mb-3">

                            <select
                                className="form-select"
                                style={{ width: "220px" }}
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >

                                <option value="7">Last 7 Days</option>

                                <option value="30">Last 30 Days</option>

                                <option value="90">Last 90 Days</option>

                                <option value="ALL">All Time</option>

                            </select>

                        </div>

                        <div
                            ref={performanceDistributionRef}
                            className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <h4 className="mb-0">
                                    📊 Performance Distribution
                                </h4>

                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={downloadPerformanceDistribution}
                                >
                                    📷 Download
                                </button>

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

                        <div
                            ref={scoreTrendRef}
                            className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                📈 Score Trend
                            </h4>

                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={downloadScoreTrend}
                            >
                                📷 Download
                            </button>

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
                        <div
                            ref={rolewisePerformanceRef}
                            className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                📊 Role-wise Performance
                            </h4>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={downloadrolewisePerformance}
                            >
                                📷 Download
                            </button>

                            <Bar
                                data={roleChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            min: 0,
                                            max: 10,
                                        },
                                    },
                                }}
                            />

                        </div>
                        <div
                            ref={monthlyInterviewRef}
                            className="card shadow-lg border-0 rounded-4 mt-4 p-4">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={downloadmonthlyInterview}
                            >
                                📷 Download
                            </button>
                            <h4 className="mb-4">
                                📅 Monthly Interview Statistics
                            </h4>


                            <Line
                                data={monthlyChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: true,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />

                        </div>
                        <div
                            ref={weeklyActivityRef}
                            className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                📅 Weekly Activity
                            </h4>

                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={downloadweeklyActivity}
                            >
                                📷 Download
                            </button>

                            <Bar
                                data={weeklyChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />

                        </div>

                        <div className="row mt-4">

                            <div className="col-md-6 mb-3">

                                <div className="card shadow-lg border-success h-100">

                                    <div className="card-body text-center">

                                        <h4>🏆 Best Performing Role</h4>

                                        <h3 className="text-success">
                                            {bestRole?.jobRole || "-"}
                                        </h3>

                                        <h4>
                                            ⭐ {bestRole?.averageScore?.toFixed(1) || "0.0"} /10
                                        </h4>

                                    </div>

                                </div>

                            </div>

                            <div className="col-md-6 mb-3">

                                <div className="card shadow-lg border-danger h-100">

                                    <div className="card-body text-center">

                                        <h4>⚠️ Needs Improvement</h4>

                                        <h3 className="text-danger">
                                            {weakestRole?.jobRole || "-"}
                                        </h3>

                                        <h4>
                                            ⭐ {weakestRole?.averageScore?.toFixed(1) || "0.0"} /10
                                        </h4>

                                    </div>

                                </div>

                            </div>

                        </div>
                        <div className="card shadow-lg border-0 rounded-4 mt-4 p-4">

                            <h4 className="mb-4">
                                🏅 Top Performing Roles
                            </h4>

                            <table className="table table-hover">

                                <thead>

                                    <tr>

                                        <th>Rank</th>

                                        <th>Role</th>

                                        <th>Average Score</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {topPerformers.map((item, index) => (

                                        <tr key={index}>

                                            <td>#{index + 1}</td>

                                            <td>{item.jobRole}</td>

                                            <td>⭐ {item.averageScore.toFixed(1)}</td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

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
                                                {filteredDashboardInterviews.length}
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

                                    filteredDashboardInterviews
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
    <option value="Newest">🆕 Newest First</option>
    <option value="Oldest">📅 Oldest First</option>
    <option value="Highest Score">⭐ Highest Score</option>
    <option value="Lowest Score">📉 Lowest Score</option>
    <option value="A-Z">🔤 A-Z</option>
    <option value="Z-A">🔠 Z-A</option>
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
                     <div className="col-lg-2 col-md-3 d-grid">

                    <button
    className={`btn ${showFavoritesOnly ? "btn-warning" : "btn-outline-warning"} ms-2`}
    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
>
    {showFavoritesOnly ? "⭐ Showing Favorites" : "☆ Show Favorites"}
</button>

</div>
                </div>


                <p className="text-muted mb-3">

                    Showing <strong>{filteredInterviews.length}</strong> of{" "}
                    <strong>{filteredDashboardInterviews.length}</strong> interviews

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
    className={`btn btn-sm me-2 ${
        interview.favorite ? "btn-warning" : "btn-outline-warning"
    }`}
    onClick={() => handleToggleFavorite(interview.id)}
>
    {interview.favorite ? "⭐ Favorited" : "☆ Favorite"}
</button>

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