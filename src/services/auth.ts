import { identity } from "../utils/request";

const _login = async (data: any) => {
    try {
        const result = await identity("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        // showError(error);
        console.error("Login error:", error);
        throw error;
    }
};

const _logout = async () => {
    try {
        const result = await identity("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify({
                token: localStorage.getItem("accessToken"),
            }),
        });
        return result;
    } catch (error: any) {
        console.error("Logout error:", error);
        throw error;
    }
}

export { _login, _logout };