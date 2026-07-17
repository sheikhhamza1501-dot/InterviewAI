import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";

function InterviewReport() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchReport();
    }, []);

    const cleanMarkdown = (text = "") => {
    return text
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, "")

        // Remove headings
        .replace(/^#{1,6}\s*/gm, "")

        // Remove bold
        .replace(/\*\*(.*?)\*\*/g, "$1")

        // Remove italic
        .replace(/\*(.*?)\*/g, "$1")

        // Remove backticks
        .replace(/`/g, "")

        // Remove markdown bullets
        .replace(/^\s*[\*\-]\s+/gm, "• ")

        // Remove extra blank lines
        .replace(/\n{3,}/g, "\n\n")

        .trim();
};
    const handleDownloadPDF = () => {

        const doc = new jsPDF();

        // Title
        doc.setFillColor(33, 150, 243);
        doc.rect(0, 0, 210, 35, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);

        doc.text("Interview AI", 20, 18);

        doc.setFontSize(12);

        doc.text("AI Mock Interview Assessment Report", 20, 28);
        doc.setTextColor(0, 0, 0);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
        doc.text(`Job Role: ${report.jobRole}`, 20, 60);
        doc.text(`Experience: ${report.experienceLevel}`, 20, 70);

        doc.text(
            `Average Score: ${report.averageScore !== null
                ? report.averageScore.toFixed(1)
                : "N/A"
            }/10`,
            20,
            80
        );

        let performance = "";

        if (report.averageScore >= 9) {
            performance = "Excellent";
        } else if (report.averageScore >= 8) {
            performance = "Very Good";
        } else if (report.averageScore >= 7) {
            performance = "Good";
        } else if (report.averageScore >= 6) {
            performance = "Average";
        } else {
            performance = "Needs Improvement";
        }

        doc.setFont(undefined, "bold");
        doc.setTextColor(33, 150, 243);

        doc.text(
            `Performance: ${performance}`,
            20,
            90
        );

        let recommendation = "";

        if (report.averageScore >= 8) {
            recommendation = "Recommended for Interview";
        } else if (report.averageScore >= 6) {
            recommendation = "Recommended with Improvements";
        } else {
            recommendation = "Needs More Practice";
        }

        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 120, 0);

        doc.text(
            `Recommendation: ${recommendation}`,
            20,
            98
        );

        doc.setFont(undefined, "normal");
        doc.setTextColor(0, 0, 0);

        // Divider
        doc.line(20, 110, 190, 110);

        // =======================
        // Report Summary
        // =======================

        const excellentAnswers = report.questions.filter(
            q => parseFloat(q.score) >= 8
        ).length;

        const averageAnswers = report.questions.filter(
            q => parseFloat(q.score) >= 6 && parseFloat(q.score) < 8
        ).length;

        const poorAnswers = report.questions.filter(
            q => parseFloat(q.score) < 6
        ).length;

        doc.setFontSize(15);
        doc.setTextColor(33, 150, 243);
        doc.text("Summary", 20, 125);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(` Total Questions : ${report.totalQuestions}`, 20, 140);

        doc.setTextColor(0, 140, 0);
        doc.text(` Excellent Answers : ${excellentAnswers}`, 20, 152);

        doc.setTextColor(220, 140, 0);
        doc.text(` Average Answers : ${averageAnswers}`, 20, 164);

        doc.setTextColor(200, 0, 0);
        doc.text(` Needs Improvement : ${poorAnswers}`, 20, 176);

        doc.setTextColor(0, 0, 0);


        let y = 195;

        const pageHeight = doc.internal.pageSize.getHeight();

        const checkPage = (requiredHeight = 10) => {
            if (y + requiredHeight > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }
        };

        doc.setFontSize(16);
        doc.text("Interview Questions", 20, y);

        y += 10;

        doc.setFontSize(12);

        report.questions.forEach((question, index) => {

            // -------------------
            // Question Title
            // -------------------

            checkPage(20);

            doc.setFont(undefined, "bold");
            doc.setTextColor(33, 150, 243);
            doc.text(`Question ${index + 1}`, 20, y);

            y += 8;

            // -------------------
            // Question
            // -------------------

            doc.setTextColor(0, 0, 0);

            const questionLines = doc.splitTextToSize(
                `Q: ${question.question}`,
                170
            );

            questionLines.forEach(line => {
                checkPage(7);
                doc.text(line, 20, y);
                y += 7;
            });

            // -------------------
            // Answer
            // -------------------

            const answerLines = doc.splitTextToSize(
                `Answer: ${question.answer}`,
                170
            );

            answerLines.forEach(line => {
                checkPage(7);
                doc.text(line, 20, y);
                y += 7;
            });

            // -------------------
            // Score
            // -------------------

            checkPage(10);

            doc.setFont(undefined, "bold");
            doc.text(`Score: ${question.score}`, 20, y);

            y += 10;

            // -------------------
            // Strengths
            // -------------------

            checkPage(10);

            doc.setTextColor(0, 128, 0);
            doc.text("Strengths:", 20, y);

            y += 7;

            doc.setFont(undefined, "normal");

            (question.strengths || []).forEach(item => {

                const lines = doc.splitTextToSize(
                    `• ${item}`,
                    165
                );

                lines.forEach(line => {
                    checkPage(6);
                    doc.text(line, 25, y);
                    y += 6;
                });

            });

            // -------------------
            // Weaknesses
            // -------------------

            checkPage(10);

            doc.setTextColor(200, 0, 0);
            doc.setFont(undefined, "bold");
            doc.text("Weaknesses:", 20, y);

            y += 7;

            doc.setFont(undefined, "normal");

            (question.weaknesses || []).forEach(item => {

                const lines = doc.splitTextToSize(
                    `• ${item}`,
                    165
                );

                lines.forEach(line => {
                    checkPage(6);
                    doc.text(line, 25, y);
                    y += 6;
                });

            });

            // -------------------
            // Correct Answer
            // -------------------

            checkPage(10);

            doc.setTextColor(0, 0, 180);
            doc.setFont(undefined, "bold");
            doc.text("Correct Answer:", 20, y);

            y += 8;

            doc.setFont(undefined, "normal");

            const answer = cleanMarkdown(question.correctAnswer || "N/A");

            // Split the lines instead of sentences
            const lines = answer.split("\n");

            lines.forEach((line) => {

                let text = line.trim();

               if (!text) {
        y += 4;
        return;
    }
      text = text.replace(/###/g, "");
    text = text.replace(/\*\*/g, "");
    text = text.replace(/`/g, "");
    text = text.replace(/^[-*]\s*/, "• ");

    const wrapped = doc.splitTextToSize(text, 165);

    wrapped.forEach((part) => {

        checkPage(6);

        doc.text(part, 25, y);

        y += 6;

    });

            });

            doc.setTextColor(0, 0, 0);

            y += 12;

        });
        checkPage(50);

        doc.setFontSize(16);
        doc.setTextColor(33, 150, 243);
        doc.setFont(undefined, "bold");

        doc.text("Final Conclusion", 20, y);

        y += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        doc.setTextColor(0, 0, 0);

        let conclusion = "";

        if (report.averageScore >= 8) {
            conclusion =
                "Excellent performance. The candidate demonstrated strong technical knowledge, good communication skills, and confidence during the interview.";
        }
        else if (report.averageScore >= 6) {
            conclusion =
                "Good performance with room for improvement. Continue practicing technical concepts and communication to become interview-ready.";
        }
        else {
            conclusion =
                "The candidate should spend more time improving technical fundamentals, communication, and problem-solving before attempting interviews.";
        }

        const conclusionLines = doc.splitTextToSize(conclusion, 170);

        conclusionLines.forEach((line) => {
            checkPage(6);
            doc.text(line, 20, y);
            y += 6;
        });
        const totalPages = doc.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {

            doc.setPage(i);

            doc.setFontSize(8);

            doc.setTextColor(150);

            doc.text(
                "© 2026 Interview AI - Generated using AI Evaluation",
                20,
                284
            );

            doc.setFontSize(10);

            doc.text(
                `Interview AI Report | Confidential | Page ${i} of ${totalPages}`,
                20,
                290
            );

        }
        doc.save(
            `${report.jobRole}_Interview_Report.pdf`
        );

    };

    const fetchReport = async () => {

        try {

            const response = await api.get(`/api/interviews/${id}/report`);

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

            <button
                className="btn btn-danger mb-3"
                onClick={handleDownloadPDF}
            >
                📄 Download PDF
            </button>

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
                                className={`badge ${parseFloat(question.score) >= 8
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