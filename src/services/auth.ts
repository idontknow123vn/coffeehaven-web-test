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
                token: sessionStorage.getItem("accessToken"),
            }),
        });
        return result;
    } catch (error: any) {
        console.error("Logout error:", error);
        throw error;
    }
}

const _updateProfile = async (data: any) => {
    try {
        const result = await identity("/update-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        console.error("Update profile error:", error);
        throw error;
    }
};

const _resetToken = async (token: string) => {
    try {
        const result = await identity("/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify({ token }),
        });
        return result;
    }
    catch (error: any) {
        console.error("Reset token error:", error);
        throw error;
    }
}

const _forgotPassword = async (email: string) => {
    try {
        const result = await identity("/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify({ email, purpose: "FORGOT_PASSWORD" }),
        });
        return result;
    } catch (error: any) {
        console.error("Forgot password error:", error);
        throw error;
    }
}

const _resetPassword = async (email: string, otp: string) => {
    try {
        const result = await identity("/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify({ email, otp, userType: "EMPLOYEE"}),
        });
        return result;
    } catch (error: any) {
        console.error("Reset password error:", error);
        throw error;
    }
};

export { _login, _logout, _updateProfile, _forgotPassword, _resetPassword, _resetToken };