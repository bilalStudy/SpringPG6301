import {BrowserRouter, json, Link, Route, Routes, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {employeeApi} from "./api/employeeApi.jsx";
import {EmployeeLoginDialog, EmployeeLoginForm, EmployeeLogin, EmployeeLoginPage} from "./component/employeeForm.jsx";
import {useCookies} from "react-cookie";
import {managerApi} from "./api/managerApi.jsx";
import {ManagerLoginDialog} from "./component/managerForm.jsx";
import {ManageEmployeePage} from "./pages/manageEmployee";
import {ManageActivityPage} from "./pages/manageActivity";
import {ManageActivityLogPage} from "./pages/manageActivityLog.jsx";
import {DepartmentActivitiesPage, ListDepartmentActivitiesPage} from "./pages/listDepartmentActivity";
import {ChatApplication} from "./pages/chatApp.jsx";

export function FrontPage({ onEmployeeLoggedIn }) {

    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
    const [employeeLoginDialogVisible, setEmployeeLoginDialogVisible] =
        useState(false);
    const [employee, setEmployee] = useState({
        fullname: "Sign in to see Employee name",
    });

    const setSignedInEmployee = (result) => {
        setCookie("employee", result.cookie);
        setEmployee(result.employee);
        onEmployeeLoggedIn(result.employee);
    };



    const signoutEmployee = () => {
        removeCookie("employee");
        setEmployee(null);
        document.location.reload();
    };

    useEffect(() => {
        (async () => {
            if (cookies["employee"]) {
                const employee = await employeeApi.getLoggedInEmployee();
                setEmployee(employee);
                onEmployeeLoggedIn(employee);
            }
        })();
    }, [cookies]);

    console.log(employee);
    return (
        <div>

            <h1> Welcome to the Company {employee.fullname}</h1>
            <ul>
                <li>
                    <Link to={"/activitylogmanagement"}> Manage your Activites </Link>
                </li>
                <li>
                    <Link to={"/relevantdepartment"}> list relevant activites for your department </Link>
                </li>
                <li>
                    <Link to={"/chatapp"}> Employee Chatapp </Link>
                </li>

                {!cookies.manager && (
                    <>
                        <li>
                            <a onClick={() => setEmployeeLoginDialogVisible(true)}>
                                Login
                            </a>
                        </li>
                        <li>
                            <a onClick={signoutEmployee}>Signout</a>
                        </li>
                    </>
                )}
            </ul>
            <EmployeeLoginDialog
                open={employeeLoginDialogVisible}
                setOpen={setEmployeeLoginDialogVisible}
                setSignedInEmployee={setSignedInEmployee}
            />

        </div>

    )
}

export function MainHeader(){
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
    const [employee, setEmployee] = useState()

    const navigate = useNavigate();

    const signOutManager = () => {
        removeCookie("manager");
        document.location.reload();
    };

    const signoutEmployee = () => {
        removeCookie("employee");
        setEmployee(null);
        document.location.reload();
    };

    const backToHomepage = () => {
        navigate("/")
    }

    return(
    <ul>
        <li>
            <a onClick={signoutEmployee}>Signout</a>
        </li>
        <li>
            <a onClick={signOutManager}>Signout(Manager)</a>
        </li>
        <li>
            <a onClick={backToHomepage}>Homepage</a>
        </li>

    </ul>
    )
}

export function ManagerFrontPage({setManager}){
    const [managerLoginDialogVisible, setManagerDialogVisible] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

    const signOutManager = () => {
        removeCookie("manager");
        document.location.reload();
    };

    if (!cookies["employee"]) {
        return (
            <>
                <footer>
                    <ul>
                        <li>
                            <a onClick={() => setManagerDialogVisible(true)}>Login(Manager)</a>
                        </li>
                        <li>
                            <Link to="/employeemanagement">Employee Management</Link>
                        </li>
                        <li>
                            <Link to="/activitymanagement">Activity Management</Link>
                        </li>
                        <li>
                            <a onClick={signOutManager}>Signout(Manager)</a>
                        </li>
                    </ul>
                </footer>
                <ManagerLoginDialog
                    setManager={setManager}
                    open={managerLoginDialogVisible}
                    setOpen={setManagerDialogVisible}
                />
            </>
        );
    }
}

export function Application() {
    const [employee, setEmployee] = useState();
    const [manager, setManager] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);



    const setManagerCallback = (result) => {
        setManager(result.manager);
        setCookie("manager", result.cookie);
    };



    useEffect(() => {
        (async () => {
            if (cookies["manager"]) {
                setManager(await managerApi.getLoggedInManager());
            }
        })();
    }, [cookies]);


    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route path={"/"} element={<><FrontPage onEmployeeLoggedIn={setEmployee}/> <ManagerFrontPage setManager={setManagerCallback}/></>} />
                    <Route path={"/loginpage"} element={<><MainHeader/><EmployeeLoginPage onEmployeeLoggedIn={setEmployee}/></> } />
                    <Route path={"/employeemanagement"} element={<><MainHeader/><ManageEmployeePage /></> } />
                    <Route path={"/activitymanagement"} element={<><MainHeader/><ManageActivityPage /></> } />
                    <Route path={"/activitylogmanagement"} element={<><MainHeader/><DepartmentActivitiesPage employee={employee} /> <ManageActivityLogPage /> </>} />
                    <Route path={"/relevantdepartment"} element={<><MainHeader/><DepartmentActivitiesPage employee={employee}/></> } />
                    <Route path={"/chatapp"} element={<><MainHeader/><ChatApplication onEmployeeLoggedIn={setEmployee}/></> } />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
