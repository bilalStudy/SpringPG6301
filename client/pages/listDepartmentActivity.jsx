import React, { useEffect, useState } from "react";
import {activityApi} from "../api/activityApi.jsx";
import {useCookies} from "react-cookie";
import {NoAccessComponent} from "../noAccess.jsx";
import {ActivityLogManagement} from "./manageActivityLog.jsx";

export function DepartmentActivitiesPage({employee}) {
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

    if (cookies.employee) {
        return <ListDepartmentActivitiesPage employee={employee}/>;
    }

    return <NoAccessComponent />;
}

export function ListDepartmentActivitiesPage({ employee }) {
    const [departmentActivities, setDepartmentActivities] = useState([]);

    useEffect(() => {
        (async () => {
            setDepartmentActivities(await activityApi.departmentList());
        })();
    }, []);

    return (
        <div className={"employee-page"}>
            {employee && <h2>Welcome {employee.fullname}!</h2>}

            <h2>Departments</h2>

            <div className={"items"}>
                {departmentActivities.map((x) => (
                    <div key={x.id} className="departmentActivities">
                        <h3>Activity : {x.activityName} , Department : {x.department}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}