// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"EMPLOYEE" | "CUSTOMER">("EMPLOYEE");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = () => {
        setRole("EMPLOYEE")
        const result = login(username, password, role);
        // Redirect based on role
        result
            .then((value) => {
                if (value === "Branch_Manager") {
                    navigate("/manager");
                } else if (value === "Counter_Staff" || value === "Delivery_Staff") {
                    navigate("/employee-dashboard");
                } else (
                    navigate("/head-office")
                );
            })
            .catch((e) => alert(e));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Đăng nhập
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                            placeholder="Nhập email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 text-gray py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
