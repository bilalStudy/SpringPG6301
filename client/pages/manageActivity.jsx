import { useCookies } from "react-cookie";
import {NoAccessComponent} from "../noAccess.jsx"
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { activityApi} from "../api/activityApi.jsx";
import { NewActivityDialog} from "../component/newActivity.jsx";
import { EditActivityDialog} from "../component/editActivity.jsx";

export function ManageActivityPage() {
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

    if (!cookies.employee) {
        if (cookies.manager) {
            return <ActivityManagement/>;
        }
    }

    return <NoAccessComponent />;
}

export function ActivityManagement() {
    const [newActivityDialogVisible, setNewActivityDialogVisible] = useState(false);
    const [editActivityDialogVisible, setEditActivityDialogVisible] = useState(false);
    const [activities, setActivities] = useState([]);
    const [editActivity, setEditActivity] = useState(null);

    const deleteActivity = async (activity) => {
        if (await activityApi.delete(activity.id)) {
            await fetchActivities();
            console.log("Testing Delete Employee Function");
        }
    };

    const fetchActivities = async () => {
        setActivities(await activityApi.listAll());
    };

    const openEditDialog = async (activity) => {
        setEditActivity(activity);
        setEditActivityDialogVisible(true);
    };

    useEffect(() => {
        (async () => {
            await fetchActivities();
        })();
    }, [newActivityDialogVisible]);


    return (
        <div className="page activity-management">
            <div className="header">
                <h2>Edit Activities</h2>
                <Button
                    variant="contained"
                    onClick={() => setNewActivityDialogVisible(true)}
                >
                    Register New Activity here
                </Button>
            </div>

            <div className="activity-management">
                <h2>Click on Activity name to update the activity</h2>
                <div className="activities">
                    {activities.map((x) => (
                        <div className="activity" key={x.id}>
                            <button
                                className="delete-icon"
                                onClick={async () => await deleteActivity(x)}
                            >
                                X
                            </button>
                            <label onClick={() => openEditDialog(x)}>activity name : {x.activityName}</label>
                        </div>
                    ))}
                </div>

                <NewActivityDialog
                    onNewActivityInserted={fetchActivities}
                    setOpen={setNewActivityDialogVisible}
                    open={newActivityDialogVisible}
                />

                <EditActivityDialog
                    activity={editActivity}
                    setOpen={setEditActivityDialogVisible}
                    open={editActivityDialogVisible}
                />
            </div>
        </div>
    );

}