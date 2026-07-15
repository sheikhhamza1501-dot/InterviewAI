import api from "./api";

export const login = async (email, password) => {

    const response = await api.post("/auth/login", {
        email,
        password
    });
 console.log("LOGIN RESPONSE:", response.data);
    return response.data;
};

export const register = async (fullName, email, password) => {

    const response = await api.post("/auth/register", {
        fullName,
        email,
        password
    });

    return response.data;
};