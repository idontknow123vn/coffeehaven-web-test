// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import BranchesPage from "./pages/head_office/Branch";
import MenuPage from "./pages/branch_manager/Menu";
import EmployeesPage from "./pages/branch_manager/Employee";
import OrdersPage from "./pages/Order";
import Login from "./pages/Login";
import Staff from "./pages/Staff";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MenuItemPage from "./pages/head_office/MenuItem";
import Shift from "./pages/branch_manager/Shift";
import BranchDetailsPage from "./pages/branch_manager/BranchDetail";

function App() {
    // const [count, setCount] = useState(0)

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Head Office Routes */}
                    <Route
                        path="/head-office"
                        element={
                            <ProtectedRoute allowedRoles={['Head_Office']}>
                                <div className="flex">
                                    <Sidebar />
                                    <div className="flex-1 p-6">
                                        <h2 className="text-2xl">Head Office Dashboard</h2>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/head-office/branches"
                        element={
                            <ProtectedRoute allowedRoles={['Head_Office']}>
                                <div className="flex">
                                    <Sidebar />
                                    <BranchesPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/head-office/menu"
                        element={
                            <ProtectedRoute allowedRoles={['Head_Office']}>
                                <div className="flex">
                                    <Sidebar />
                                    <MenuItemPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Manager Routes */}
                    <Route
                        path="/manager-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['Branch_Manager']}>
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
                            <ProtectedRoute allowedRoles={['Branch_Manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <BranchDetailsPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/employees"
                        element={
                            <ProtectedRoute allowedRoles={['Branch_Manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <EmployeesPage />
                                </div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/shift"
                        element={
                            <ProtectedRoute allowedRoles={['Branch_Manager']}>
                                <div className="flex">
                                    <Sidebar />
                                    <Shift />
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    {/* Employee Routes */}
                    <Route
                        path="/employee-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['Counter_Staff', 'Delivery_Staff']}>
                                <Staff />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute allowedRoles={['Branch_Manager', 'Counter_Staff', 'Delivery_Staff']}>
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
                            <ProtectedRoute allowedRoles={["Branch_Manager", "Counter_Staff"]}>
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
