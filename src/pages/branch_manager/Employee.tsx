import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getEmployeesByBranch } from "../../services/manager";

const EmployeesPage: React.FC = () => {
      const [employeeFilter, setEmployeeFilter] = useState<string>('Toàn bộ nhân viên');
      const [employees, setEmployees] = useState<any[]>([]);
      const {id: branchId} = useAuth();

      useEffect(() => {
        // Fetch employees data based on the selected filter
        // This is a placeholder for actual data fetching logic
        const fetchEmployees = async () => {
          try {
            if (branchId) {
              const response = await getEmployeesByBranch(branchId);
              setEmployees(response.data.data);
              console.log("Employees data:", response.data);
            }
          } catch (error) {
            console.error("Error fetching employees:", error);
          }
        }
        fetchEmployees();
      }, []);

      const employeesData = [
        { name: 'Nguyễn Văn A', role: 'Nhân viên tại quầy', phone: '0332065084', orders: 32, status: 'Đang làm' },
        { name: 'Trần Văn B', role: 'Nhân viên vận chuyển', phone: '0994365132', orders: 54, status: 'Nghỉ' },
        { name: 'Nguyễn Văn C', role: 'Nhân viên vận chuyển', phone: '0444525484', orders: 12, status: 'Đang làm' },
      ];

      return (
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Quản lý nhân viên - Chi nhánh Đa Năng</h2>
            <div className="flex items-center space-x-4">
              <span>Xin chào, User</span>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">JW</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option>Toàn bộ nhân viên</option>
              <option>Nhân viên tại quầy</option>
              <option>Nhân viên vận chuyển</option>
            </select>
            <button className="bg-orange-500 text-white px-4 py-2 rounded">Thêm nhân viên</button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Tên nhân viên</th>
                <th className="p-2 text-left">Vai trò</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Số đơn</th>
                <th className="p-2 text-left">Trạng thái</th>
                <th className="p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">{employee.role}</td>
                  <td className="p-2">{employee.email}</td>
                  <td className="p-2">{employee.orders}</td>
                  <td className="p-2">
                    <span className={employee.status === 'Đang làm' ? 'text-green-500' : 'text-red-500'}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="p-2">👁️</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
export default EmployeesPage;