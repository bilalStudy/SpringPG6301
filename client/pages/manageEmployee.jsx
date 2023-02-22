import { useCookies } from "react-cookie";
import {NoAccessComponent} from "../noAccess.jsx"
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { employeeApi} from "../api/employeeApi.jsx";
import { NewEmployeeDialog} from "../component/newEmployee.jsx";
import { EditEmployeeDialog} from "../component/editEmployee.jsx";
import {useNavigate} from "react-router-dom";

export function ManageEmployeePage() {
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

    if (!cookies.employee) {
        if (cookies.manager) {
            return <EmployeeManagement/>;
        }
    }

    return <NoAccessComponent />;
}

export function EmployeeManagement() {
    const [newEmployeeDialogVisible, setNewEmployeeDialogVisible] = useState(false);
    const [editEmployeeDialogVisible, setEditEmployeeDialogVisible] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [editEmployee, setEditEmployee] = useState(null);
    const deleteEmployee = async (employee) => {
        if (await employeeApi.delete(employee.id)) {
            await fetchEmployees();
            console.log("Testing Delete Employee Function");
        }
    };

    const fetchEmployees = async () => {
        setEmployees(await employeeApi.listAll());
    };

    const openEditDialog = (employee) => {
        setEditEmployee(employee);
        setEditEmployeeDialogVisible(true);
    };

    useEffect(() => {
        (async () => {
            await fetchEmployees();
        })();
    }, [newEmployeeDialogVisible]);



    return (
        <div className="page employee-management">
            <div className="header">
                <h2>Edit Employees</h2>
                <Button
                    variant="contained"
                    onClick={() => setNewEmployeeDialogVisible(true)}
                >
                    Register New Employee here
                </Button>
            </div>

            <div className="employee-management">
                <h2>Click on employee name to update the employee</h2>
                <div className="employees">
                    {employees.map((x) => (
                        <div className="employee" key={x.id}>
                            <button
                                className="delete-icon"
                                onClick={async () => await deleteEmployee(x)}
                            >
                                X
                            </button>
                            <label onClick={() => openEditDialog(x)}>fullname : {x.fullname} , username : {x.username}</label>
                        </div>
                    ))}
                </div>

                <NewEmployeeDialog
                    onNewEmployeeInserted={fetchEmployees}
                    setOpen={setNewEmployeeDialogVisible}
                    open={newEmployeeDialogVisible}
                />

                <EditEmployeeDialog
                    employee={editEmployee}
                    setOpen={setEditEmployeeDialogVisible}
                    open={editEmployeeDialogVisible}
                />
            </div>
        </div>
    );
}