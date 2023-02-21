import {BrowserRouter, json, Link, Route, Routes} from "react-router-dom";
import {fetchJSON} from "./misc/fetchJSON.jsx";
import {useEffect, useState} from "react";
import {employeeApi} from "./api/employeeApi.jsx";
import {EmployeeRegisterDialog} from "./component/registerForm.jsx";
import {EmployeeLoginDialog, EmployeeLoginForm, EmployeeLogin, EmployeeLoginPage} from "./component/employeeForm.jsx";
import {useCookies} from "react-cookie";
import {managerApi} from "./api/managerApi.jsx";
import {ManagerLoginDialog} from "./component/managerForm.jsx";

export function FrontPage({ onEmployeeLoggedIn }) {

    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
    const [employeeLoginDialogVisible, setEmployeeLoginDialogVisible] =
        useState(false);
    const [employeeRegisterDialogVisible, setEmployeeRegisterDialogVisible] =
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

            <h1> Welcome to the webapp {employee.fullname}</h1>
            <ul>
                <li>
                    <Link to={"/register/new"}> Register User </Link>
                </li>
                <li>
                    <Link to={"/register/list"}> List Existing Users </Link>
                </li>
                <li>
                    <Link to={"/loginpage"}> Login Here </Link>
                </li>
                <li>
                    <Link to={"/loggedinuser"}> Check your username </Link>
                </li>
                <li>
                    <Link to={"/order"}> Order Food here </Link>
                </li>
                <li>
                    <Link to={"/menuitems"}> Look at our menu here </Link>
                </li>
                {!cookies.manager && (
                    <>
                        <li>
                            <a onClick={() => setEmployeeLoginDialogVisible(true)}>
                                Login
                            </a>
                        </li>
                        <li>
                            <a onClick={() => setEmployeeRegisterDialogVisible(true)}>
                                Register
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

            <EmployeeRegisterDialog
                open={employeeRegisterDialogVisible}
                setOpen={setEmployeeRegisterDialogVisible}
            />
            <EmployeeLogin setSignedInEmployee={setSignedInEmployee}/>
        </div>

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
                            <Link to="/managerpage">Management</Link>
                        </li>
                        <li>
                            <Link to="/manager-chat">Support</Link>
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
                    <Route path={"/loginpage"} element={<EmployeeLoginPage onEmployeeLoggedIn={setEmployee}/> } />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
