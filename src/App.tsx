// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import BranchesPage from "./pages/Branch";
import MenuPage from "./pages/Menu";
import EmployeesPage from "./pages/Employee";
import OrdersPage from "./pages/Order";
import Login from "./pages/Login";
import Staff from "./pages/Staff";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    // const [count, setCount] = useState(0)

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    {/* Manager Routes */}
                    <Route
                        path="/manager-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <div className="flex-1 p-6">
                                        <h2 className="text-2xl">Manager Dashboard</h2>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/branches"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <BranchesPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employees"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <EmployeesPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    {/* Employee Routes */}
                    <Route
                        path="/employee-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <Staff />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <div className="flex">
                                    <Sidebar />
                                    <OrdersPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/menu"
                        element={
                            <ProtectedRoute allowedRoles={['employee', 'manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <MenuPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
