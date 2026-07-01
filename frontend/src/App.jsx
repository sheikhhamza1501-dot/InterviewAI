import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import InterviewDetails from "./pages/InterviewDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import EditInterview from "./pages/EditInterview";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard/>
                </ProtectedRoute>
               } 
               />

            <Route
                path="/create"
                element={
                 <ProtectedRoute>
                     <CreateInterview />
                 </ProtectedRoute>
               }
            />

            <Route
                path="/interview/:id"
                element={
                    <ProtectedRoute>
                         <InterviewDetails />
                    </ProtectedRoute>
              }
            />
<Route
    path="/edit/:id"
    element={
        <ProtectedRoute>
            <EditInterview />
        </ProtectedRoute>
    }
/>
        </Routes>

    );

}

export default App;