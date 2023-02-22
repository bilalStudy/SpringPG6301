import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {employeeApi} from "../api/employeeApi.jsx";

export function EditEmployeeDialog({ open, setOpen, employee}) {

    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");

    const [department, setDepartment] = useState("");

    function refreshPage() {
        window.location.reload(false);
    }



    const onDishSubmit = async (e) => {
        e.preventDefault();

        if (
            await employeeApi.update({
                id: employee.id, username, fullname, department,
            })
        ) {
            setOpen(false);
        }
        refreshPage()
    };

    useEffect(() => {
        if (employee) {
            setUsername(employee.username);
            setFullname(employee.fullname);
            setDepartment(employee.department);
        }
    }, [employee]);

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>Edit - {fullname}</DialogTitle>
            <DialogContent>
                <form onSubmit={onDishSubmit} style={{ width: "350px" }}>
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
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            label="Department*"
                        />
                    </div>

                    <Button type="submit" variant="contained">
                        Update
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}