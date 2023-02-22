export const activityLoggerApi = {
    list : async () => {
        const res = await fetch("/api/activitylogs");

        return await res.json();
    },
    update: async ({ id, employeeName, activityName, date, hours }) => {
        const res = await fetch("/api/activitylogs", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id, employeeName, activityName, date, hours }),
        });

        return res.ok;
    },
    insert: async ({employeeName, activityName, date, hours}) => {
        const res = await fetch("/api/activitylogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employeeName,
                activityName,
                date,
                hours,
            }),
        });

        return res.ok
    },
    delete: async (id) => {
        const res = await fetch("/api/activitylogs", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id,}),
        });

        return res.ok;
    },
}