import { useCookies } from "react-cookie";
import {NoAccessComponent} from "../noAccess.jsx"
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { NewActivityLogDialog} from "../component/newActivityLog.jsx";
import { EditActivityLogDialog} from "../component/editActivityLog.jsx";
import {activityLoggerApi} from "../api/activityLoggerApi.jsx";

export function ManageActivityLogPage() {
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

    if (cookies.employee) {
            return <ActivityLogManagement/>;
    }

    return <NoAccessComponent />;
}

export function ActivityLogManagement() {
    const [newActivityLogDialogVisible, setNewActivityLogDialogVisible] = useState(false);
    const [editActivityLogDialogVisible, setEditActivityLogDialogVisible] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [editActivityLog, setEditActivityLog] = useState(null);

    const deleteActivityLog = async (activitylogs) => {
        if (await activityLoggerApi.delete(activitylogs.id)) {
            await fetchActivityLogs();
            console.log("Testing Delete Employee Function");
        }
    };

    const fetchActivityLogs = async () => {
        setActivityLogs(await activityLoggerApi.list());
    };

    const openEditDialog = async (activitylogs) => {
        setEditActivityLog(activitylogs);
        setEditActivityLogDialogVisible(true);
    };

    useEffect(() => {
        (async () => {
            await fetchActivityLogs();
        })();
    }, [newActivityLogDialogVisible]);


    return (
        <div className="page activity-management">
            <div className="header">
                <h2>Edit Activitylogs</h2>
                <Button
                    variant="contained"
                    onClick={() => setNewActivityLogDialogVisible(true)}
                >
                    Register New Activity here
                </Button>
            </div>

            <div className="activity-management">
                <h2>Click on Activity name to update the activity</h2>
                <div className="activities">
                    {activityLogs.map((x) => (
                        <div className="activity" key={x.id}>
                            <button
                                className="delete-icon"
                                onClick={async () => await deleteActivityLog(x)}
                            >
                                X
                            </button>
                            <label onClick={() => openEditDialog(x)}>activity name : {x.activityName} employee name : {x.employeeName} date : {x.date} hours : {x.hours}</label>
                        </div>
                    ))}
                </div>

                <NewActivityLogDialog
                    onNewActivityLogInserted={fetchActivityLogs}
                    setOpen={setNewActivityLogDialogVisible}
                    open={newActivityLogDialogVisible}
                />

                <EditActivityLogDialog
                    activityLog={editActivityLog}
                    setOpen={setEditActivityLogDialogVisible}
                    open={editActivityLogDialogVisible}
                />
            </div>
        </div>
    );

}