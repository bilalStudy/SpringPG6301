export const activityApi = {
    listAll: async () => {
        const result = await fetch("/api/activities");
        const json = result.json();

        return json;
    },
    insert: async ({ activityName, department}) => {
        const res = await fetch("/api/activities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({activityName, department}),
        });

        return res.ok;
    },
    update: async ({ id, activityName, department }) => {
        const res = await fetch("/api/activities", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id, activityName, department}),
        });

        return res.ok;
    },
    delete: async (id) => {
        const res = await fetch("/api/activities", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id,}),
        });

        return res.ok;
    },
}