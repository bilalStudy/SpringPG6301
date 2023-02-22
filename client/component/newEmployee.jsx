import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {employeeApi} from "../api/employeeApi.jsx";

export function NewEmployeeDialog({ open, setOpen, onRegistered }) {

    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");



    const onEmployeeSubmit = async (e) => {
        e.preventDefault();

        if (
            await employeeApi.registerNewEmployee({
                username,
                fullname,
                password,
                department,
            })
        ) {
            setOpen(false);
            await onRegistered;
        }
    };

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>New Employee</DialogTitle>
            <DialogContent>
                <form onSubmit={onEmployeeSubmit} style={{ width: "350px" }}>
                    <div className="form-group">
                        <TextField
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            label="Username*"
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            label="Fullname*"
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
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            label="Department*"
                        />
                    </div>

                    <Button type="submit" variant="contained">
                        Register
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}