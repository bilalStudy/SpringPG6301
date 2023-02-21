export const managerApi = {
    managerLogin: async (username, password) => {
        const res = await fetch("/api/managers/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        return res.ok ? await res.json() : null;
    },
    getLoggedInManager: async () => {
        const res = await fetch("/api/managers/logged-in");

        return res.ok ? await res.json() : null;
    },
}