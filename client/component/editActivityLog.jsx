import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {activityLoggerApi} from "../api/activityLoggerApi.jsx";

export function EditActivityLogDialog({ open, setOpen, activityLog }) {

    const [employeeName, setEmployeeName] = useState("");
    const [activityName, setActivityName] = useState("");
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("");

    function refreshPage() {
        window.location.reload(false);
    }


    const onActivityLogSubmit = async (e) => {
        e.preventDefault();

        if (
            await activityLoggerApi.update({
                id: activityLog.id, employeeName, activityName, date, hours,
            })
        ) {
            setOpen(false);
        }
        refreshPage()
    };

    useEffect(() => {
        if (activityLog) {
            setEmployeeName(activityLog.employeeName)
            setActivityName(activityLog.activityName);
            setDate(activityLog.date);
            setHours(activityLog.hours);
        }
    }, [activityLog]);

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>Edit - {activityName}</DialogTitle>
            <DialogContent>
                <form onSubmit={onActivityLogSubmit} style={{ width: "350px" }}>
                    <div className="form-group">
                        <TextField
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            label="Department*"
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
                            label="Date*"
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            label="Hours*"
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