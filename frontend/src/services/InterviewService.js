import api from "./api";

export const createInterview = async (interview) => {

    const response = await api.post("/interviews", interview);

    return response.data;

};
export const deleteInterview = async (id) => {

    const response = await api.delete(`/interviews/${id}`);

    return response.data;

};