import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {useEffect, useState} from "react";
import { employeeApi} from "../api/employeeApi.jsx";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export function EmployeeLoginDialog({ open, setOpen, setSignedInEmployee }) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Login - Employee</DialogTitle>
            <DialogContent>
                <EmployeeLoginForm
                    onLoginSuccess={() => setOpen(false)}
                    setSignedInEmployee={setSignedInEmployee}
                />

            </DialogContent>
        </Dialog>
    );
}


export function EmployeeLoginForm({ setSignedInEmployee, onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onFormSubmit = async (e) => {
        e.preventDefault();

        const result = await employeeApi.employeeLogin(username, password);

        if (result) {
            setSignedInEmployee(result);
            onLoginSuccess();
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <div className="form-group">
                <TextField
                    value={username}
                    type="text"
                    className="form-control"
                    label="Username*"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username.."
                />
            </div>
            <div className="form-group">
                <TextField
                    value={password}
                    type="password"
                    label="Password*"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password.."
                />
            </div>
            <Button variant="contained" type="submit" sx={{width: "100%"}}>
                Login
            </Button>
        </form>
    );
}

export function EmployeeLoginPage({onEmployeeLoggedIn}){
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
    const [employee, setEmployee] = useState({
        fullname: "Sign in to see Employee name",
    });

    const setSignedInEmployee = (result) => {
        setCookie("employee", result.cookie);
        setEmployee(result.employee);
        onEmployeeLoggedIn(result.employee);
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

    return(
        <EmployeeLoginForm2 setSignedInEmployee={setSignedInEmployee}/>
    )
}

export function EmployeeLogin({ setSignedInEmployee}){
    return(
        <EmployeeLoginForm2 setSignedInEmployee={setSignedInEmployee}/>
    )
}

export function EmployeeLoginForm2({ setSignedInEmployee}){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();


        const result = await employeeApi.employeeLogin(username, password);

        if (result) {
            setSignedInEmployee(result);
        }


    };



    return(
        <form onSubmit={handleSubmit}>
            <div>
            <label>
                <strong>Username</strong>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </label>
            </div>
            <div>
            <label>
                <strong>Password</strong>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            </div>
            <button> Submit </button>
        </form>
    )
}