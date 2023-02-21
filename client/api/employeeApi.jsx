export const employeeApi = {
    getLoggedInEmployee: async () => {
        const res = await fetch("/api/employees/logged-in");

        return res.ok ? await res.json() : null;
    },
    registerNewEmployee: async (employee) => {
        const res = await fetch("/api/employees/register", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employee),
        })

        return res.ok;
    },
    employeeLogin : async (username, password) => {
        const res = await fetch("/api/employees/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })

        return res.ok ? await res.json() : null
    },
    update: async ({ id, username, fullname, department }) => {
        const res = await fetch("/api/employees", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id, username, fullname, department}),
        });

        return res.ok;
    },
    delete: async (id) => {
        const res = await fetch("/api/employees", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id,}),
        });

        return res.ok;
    },
}