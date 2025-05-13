// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import BranchesPage from "./pages/Branch";
import MenuPage from "./pages/Menu";
import EmployeesPage from "./pages/Employee";
import OrdersPage from "./pages/Order";

function App() {
    // const [count, setCount] = useState(0)

    return (
        <BrowserRouter>
          <div className="flex">
            <Sidebar />
            <Routes>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees" element={<OrdersPage />} />
              <Route path="/" element={<div className="flex-1 p-6"><h2 className="text-2xl">Welcome to Dashboard</h2></div>} />
            </Routes>
          </div>
        </BrowserRouter>
    );
}

export default App;
