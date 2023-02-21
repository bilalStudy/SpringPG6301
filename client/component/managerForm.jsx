import { useState } from "react";
import { managerApi} from "../api/managerApi.jsx";

import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

export function ManagerLoginForm({ setManager, onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onFormSubmit = async (e) => {
        e.preventDefault();

        const result = await managerApi.managerLogin(username, password);

        if (result) {
            setManager(result);
            onLogin();
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <div className="form-group">
                <TextField
                    label="Username*"
                    value={username}
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username.."
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Password*"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password.."
                />
            </div>
            <Button variant="contained" type="submit" sx={{ width: "100%" }}>
                Login
            </Button>
        </form>
    );
}

export function ManagerLoginDialog({ open, setOpen, setManager }) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Login Manager</DialogTitle>
            <DialogContent>
                <ManagerLoginForm setManager={setManager} onLogin={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}