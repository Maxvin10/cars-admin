import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthstore } from "../store/auth";


function Protected({children}) {
    const token = useAuthstore((s) => s.token);
    if (!token) return <Navigate to = "/login" replace />;
    return children
}

export default Protected;