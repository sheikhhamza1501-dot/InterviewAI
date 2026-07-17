import api from "./api";

export const createInterview = async (interview) => {

    const response = await api.post("/api/interviews", interview);

    return response.data;

};
export const deleteInterview = async (id) => {

    const response = await api.delete(`/api/interviews/${id}`);

    return response.data;

};
export const getDashboardStats = async () => {

    const response = await api.get("/api/interviews/dashboard/stats");

    return response.data;

};
export const toggleFavorite = async (id) => {
    return await api.put(`/api/interviews/${id}/favorite`);
};