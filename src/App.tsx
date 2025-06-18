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
import RevenueSum from "./pages/branch_manager/RevenueSum";
import NotFound from "./pages/NotFound";
import Profile from "./pages/branch_manager/Profile";
import Overall from "./pages/head_office/Overall";
import DiscountPage from "./pages/head_office/Discount";
import DiscountInBranch from "./pages/branch_manager/DiscountInBranch";
import HeadOfficeEmployeePage from "./pages/head_office/Employee";
import HeadOfficeLayout from "./layouts/HeadOfficeLayout";
import ManagerLayout from "./layouts/ManagerLayout";

import ForgotPassword from './pages/ForgotPassword';

function App() {
    // const [count, setCount] = useState(0)

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Head Office Routes */}
                    <Route
                        path="/head-office"
                        element={
                            <ProtectedRoute allowedRoles={['Head_Office']}>
                                <HeadOfficeLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Overall />} />
                        <Route path="branches" element={<BranchesPage />} />
                        <Route path="menu" element={<MenuItemPage />} />
                        <Route path="employees" element={<HeadOfficeEmployeePage />} />
                        <Route path="discounts" element={<DiscountPage />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>

                    {/* Manager Routes */}
                    <Route
                        path="/manager"
                        element={
                            <ProtectedRoute allowedRoles={['Branch_Manager']}>
                                <ManagerLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<RevenueSum />} />
                        <Route path="branches" element={<BranchDetailsPage />} />
                        <Route path="employees" element={<EmployeesPage />} />
                        <Route path="shift" element={<Shift />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="discounts" element={<DiscountInBranch />} />
                        <Route path="menu" element={<MenuPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                    </Route>

                    {/* Employee Routes */}
                    <Route
                        path="/employee-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['Counter_Staff', 'Delivery_Staff', 'Barista', 'Server']}>
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

                    {/* 404 Not Found Route */}
                    <Route path="*" element={<NotFound />} />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
