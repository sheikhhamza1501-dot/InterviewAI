import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function InterviewReport() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {

        try {

            const response = await api.get(`/interviews/${id}/report`);

            setReport(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load report");

        }

    };

    if (!report) {

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    return (

        <div className="container mt-4">

            <h2>Interview Report</h2>

            <hr />

            <div className="card shadow p-4">

                <h3>{report.jobRole}</h3>

                <p>
                    <strong>Experience:</strong> {report.experienceLevel}
                </p>

                <p>
                    <strong>Created:</strong> {report.createdAt}
                </p>

            </div>

            <div className="row mt-4">

    <div className="col-md-6">

        <div className="card text-center shadow">

            <div className="card-body">

                <h5>Total Questions</h5>

                <h2>{report.totalQuestions}</h2>

            </div>

        </div>

    </div>

    <div className="col-md-6">

        <div className="card text-center shadow">

            <div className="card-body">

                <h5>Average Score</h5>

            <div>

    <h3>

        {report.averageScore >= 9
            ? "⭐⭐⭐⭐⭐"
            : report.averageScore >= 8
            ? "⭐⭐⭐⭐☆"
            : report.averageScore >= 7
            ? "⭐⭐⭐☆☆"
            : report.averageScore >= 6
            ? "⭐⭐☆☆☆"
            : "⭐☆☆☆☆"}

    </h3>

    <h2>

        {report.averageScore !== null
            ? `${report.averageScore.toFixed(1)}/10`
            : "Not Calculated"}

    </h2>

</div>

            </div>

        </div>

    </div>

</div>

            <div className="mt-4">

    <h3>Questions</h3>

    <hr />

    {report.questions.map((question, index) => (

        <div key={index} className="card shadow mb-3 p-3">

            <h5>
                Question {index + 1}
            </h5>

            <p>
                <strong>Question:</strong>
                <br />
                {question.question}
            </p>

            <p>
                <strong>Your Answer:</strong>
                <br />
                {question.answer}
            </p>
<p>

    <strong>Score:</strong>{" "}

    <span
        className={`badge ${
            parseFloat(question.score) >= 8
                ? "bg-success"
                : parseFloat(question.score) >= 6
                ? "bg-warning text-dark"
                : "bg-danger"
        }`}
    >

        {question.score}

    </span>

</p>
<div className="alert alert-success mt-3">

    <h6>✅ Strengths</h6>

    <ul className="mb-0">

        {question.strengths &&
            question.strengths.map((item, index) => (

                <li key={index}>
                    {item}
                </li>

            ))}

    </ul>

</div>

<div className="alert alert-danger">

    <h6>❌ Weaknesses</h6>

    <ul className="mb-0">

        {question.weaknesses &&
            question.weaknesses.map((item, index) => (

                <li key={index}>
                    {item}
                </li>

            ))}

    </ul>

</div>
<div className="alert alert-primary">

    <h6>📘 Correct Answer</h6>

    <p className="mb-0">

        {question.correctAnswer}

    </p>

</div>

        </div>

    ))}

</div>

<div className="text-center mt-4">

    <button
        className="btn btn-secondary"
        onClick={() => navigate("/dashboard")}
    >
        ← Back to Dashboard
    </button>

</div>
        </div>

    );

}

export default InterviewReport;