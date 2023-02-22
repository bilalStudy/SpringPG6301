import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {activityLoggerApi} from "../api/activityLoggerApi.jsx";

export function NewActivityLogDialog({ open, setOpen, onNewActivityLogInserted }) {

    const [employeeName, setEmployeeName] = useState("");
    const [activityName, setActivityName] = useState("");
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("");



    const onActivitySubmit = async (e) => {
        e.preventDefault();

        if (
            await activityLoggerApi.insert({
                employeeName,
                activityName,
                date,
                hours,
            })
        ) {
            setOpen(false);
            await onNewActivityLogInserted;
        }
    };

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>New ActivityLog</DialogTitle>
            <DialogContent>
                <form onSubmit={onActivitySubmit} style={{ width: "350px" }}>
                    <div className="form-group">
                        <TextField
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            label="employeeName"
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            label="ActivityName*"
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            label="Date"
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            label="Hours"
                        />
                    </div>


                    <Button type="submit" variant="contained">
                        Create
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}