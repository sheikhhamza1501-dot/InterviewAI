import api from "./api";

export const createInterview = async (interview) => {

    const response = await api.post("/interviews", interview);

    return response.data;

};
export const deleteInterview = async (id) => {

    const response = await api.delete(`/interviews/${id}`);

    return response.data;

};
export const getDashboardStats = async () => {

    const response = await api.get("/interviews/dashboard/stats");

    return response.data;

};
export const toggleFavorite = async (id) => {
    return await api.put(`/interviews/${id}/favorite`);
};