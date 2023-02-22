import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {activityApi} from "../api/activityApi.jsx";

export function EditActivityDialog({ open, setOpen, activity }) {

    const [activityName, setActivityName] = useState("");
    const [department, setDepartment] = useState("");

    function refreshPage() {
        window.location.reload(false);
    }


    const onActivitySubmit = async (e) => {
        e.preventDefault();

        if (
            await activityApi.update({
                id: activity.id, activityName, department,
            })
        ) {
            setOpen(false);
        }
        refreshPage()
    };

    useEffect(() => {
        if (activity) {
            setActivityName(activity.activityName);
            setDepartment(activity.department);
        }
    }, [activity]);

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>Edit - {activityName}</DialogTitle>
            <DialogContent>
                <form onSubmit={onActivitySubmit} style={{ width: "350px" }}>
                    <div className="form-group">
                        <TextField
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            label="ActivityName*"
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