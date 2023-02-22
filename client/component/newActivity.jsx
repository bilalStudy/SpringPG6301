import { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {activityApi} from "../api/activityApi.jsx";

export function NewActivityDialog({ open, setOpen, onNewActivityInserted }) {

    const [activityName, setActivityName] = useState("");
    const [department, setDepartment] = useState("");



    const onActivitySubmit = async (e) => {
        e.preventDefault();

        if (
            await activityApi.insert({
                activityName,
                department,
            })
        ) {
            setOpen(false);
            await onNewActivityInserted;
        }
    };

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>New Activity</DialogTitle>
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
                            label="Department"
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