import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
function InterviewDetails() {

    const { id } = useParams();

    const [interview, setInterview] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState({});

    const [evaluations, setEvaluations] = useState({});

    useEffect(() => {
        fetchInterview();
        fetchQuestions();
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

    const fetchQuestions = async () => {

    try {

        const response = await api.get(`/questions/interview/${id}`);

        setQuestions(response.data);

    } catch (error) {

        console.log(error);

    }

};

const handleAnswerChange = (questionId, value) => {

    setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
    }));

};

const saveAnswer = async (questionId) => {

    try {

        await api.put(`/questions/${questionId}/answer`, {
            answer: answers[questionId],
        });

        alert("Answer saved successfully!");

    } catch (error) {

        console.log(error);

        alert("Failed to save answer.");

    }

};

const evaluateAnswer = async (questionId) => {

    try {

        const response = await api.post(
            `/questions/${questionId}/evaluate`
        );

        setEvaluations((prev) => ({
            ...prev,
            [questionId]: response.data,
        }));

    } catch (error) {

        console.log(error);

        alert("Evaluation failed.");

    }

};

    if (!interview) {

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    const getAverageScore = () => {

    const values = Object.values(evaluations);

    if (values.length === 0) return "0.0";

    const total = values.reduce((sum, evaluation) => {

        const score = parseFloat(
            evaluation.score.split("/")[0]
        );

        return sum + score;

    }, 0);

    return (total / values.length).toFixed(1);
};

const getTotalEvaluated = () => {
    return Object.keys(evaluations).length;
};

const getProgress = () => {

    if (questions.length === 0) return 0;

    return Math.round(
        (getTotalEvaluated() / questions.length) * 100
    );
};


    return (

        <div className="container mt-4">

<div className="card shadow-sm mb-4">

    <div className="card-body text-center">

        <h3>Overall Interview Score</h3>

        <h1 className="text-success">

            {getAverageScore()}/10

        </h1>

        <p>

            Questions Evaluated: {getTotalEvaluated()}

        </p>
        <div className="progress mt-3">

    <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: `${getProgress()}%` }}
    >
        {getProgress()}%
    </div>

</div>

    </div>

</div>

<hr />

<div className="row text-center">

    <div className="col-md-4">

        <h5>Total Questions</h5>

        <h3>{questions.length}</h3>

    </div>

    <div className="col-md-4">

        <h5>Evaluated</h5>

        <h3>{getTotalEvaluated()}</h3>

    </div>

    <div className="col-md-4">

        <h5>Average Score</h5>

        <h3>{getAverageScore()}/10</h3>

    </div>

</div>

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

<hr />

<h3 className="mt-4">
    Interview Questions
</h3>

{
    questions.length === 0 ? (

        <div className="alert alert-warning mt-3">
            No questions generated yet.
        </div>

    ) : (

        questions.map((question, index) => (

            <div
                key={question.id}
                className="card shadow-sm mt-3"
            >

                <div className="card-body">

                    <h5>
                        Question {index + 1}
                    </h5>

                    <p>
                        {question.questionText}
                    </p>

<textarea
    className="form-control mt-3"
    rows="4"
    placeholder="Type your answer here..."
   value={answers[question.id] ?? question.answer ?? ""}
    onChange={(e) =>
        handleAnswerChange(question.id, e.target.value)
    }
/>

<button
    className="btn btn-success mt-3"
    onClick={() => saveAnswer(question.id)}
>
    Save Answer
</button>

<button
    className="btn btn-primary mt-3 ms-2"
    onClick={() => evaluateAnswer(question.id)}
>
    Evaluate
</button>

{
    evaluations[question.id] && (

        <div className="card mt-3 border-success">

            <div className="card-body">

                <h5>AI Evaluation</h5>

               <h5 className="mb-3">
    <span className="badge bg-success fs-6">
        Score: {evaluations[question.id].score}
    </span>
</h5>
              <h5 className="text-success">Strengths</h5>

<ul className="list-group mb-3">

    {evaluations[question.id].strengths.map((item, index) => (

        <li
            key={index}
            className="list-group-item list-group-item-success"
        >
            ✅ {item}
        </li>

    ))}

</ul>

             <h5 className="text-danger">Weaknesses</h5>

<ul className="list-group mb-3">

    {evaluations[question.id].weaknesses.map((item, index) => (

        <li
            key={index}
            className="list-group-item list-group-item-danger"
        >
            ❌ {item}
        </li>

    ))}

</ul>

               <h5 className="mt-3">Correct Answer</h5>
 

              <div
    className="border rounded p-3 mt-2 bg-light"
>

    <ReactMarkdown>

        {evaluations[question.id].correctAnswer}

    </ReactMarkdown>

</div>

            </div>

        </div>

    )
}
                </div>

            </div>

        ))

    )
}

</div>

        

    );

}


export default InterviewDetails;