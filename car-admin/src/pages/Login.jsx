import React from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import {Link, useNavigate} from "react-router-dom"
import { useAuthstore } from "../store/auth";
import { api } from "../api/axios";

function Login() {
    const navigate = useNavigate();
    const setToken = useAuthstore((s) => s.setToken);

    const onFinish = async (values) => {
        try{
            const res = await api.post("/api/Auth/login", values);
            const data = res.data
        }
    }
}