import axios from "axios";

const API = axios.create({ baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api` });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const signupUser = (data) => API.post("/auth/signup", data);

export const fetchProblems = () => API.get("/problems");
export const createProblem = (data) =>
  API.post("/problems", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const addSolution = (problemId, data) =>
  API.post(`/solutions/${problemId}`, data);

export const createSolution = (data) => API.post("/solutions", data);

export const getSolutions = (problemId) => API.get(`/solutions/${problemId}`);

export const upvoteSolution = (solutionId) =>
  API.post(`/solutions/${solutionId}/upvote`);

export const commentSolution = (solutionId, text) =>
  API.post(`/solutions/${solutionId}/comment`, { text });
