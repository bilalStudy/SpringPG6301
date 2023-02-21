import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { employeeApi} from "../api/employeeApi.jsx";

export function EmployeeRegisterDialog({ open, setOpen }) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Register - Employee</DialogTitle>
            <DialogContent>
                <EmployeeRegisterForm onRegistered={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

export function EmployeeRegisterForm({ onRegistered }) {
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if (
            await employeeApi.registerNewEmployee({
                username,
                fullname,
                password,
                department,
            })
        ) {
            onRegistered();
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <div className="form-group">
                <TextField
                    label="Full name*"
                    value={fullname}
                    type="text"
                    className="form-control"
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Fullname.."
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Username*"
                    value={username}
                    type="text"
                    className="form-control"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username.."
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Password*"
                    value={password}
                    className="form-control"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password.."
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Department"
                    value={department}
                    type="text"
                    className="form-control"
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department.."
                />
            </div>
            <Button variant="contained" type="submit" sx={{ width: "100%" }}>
                Register
            </Button>
        </form>
    );
}