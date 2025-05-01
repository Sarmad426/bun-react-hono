const API_URL = "http://localhost:3000";

export const getTodos = async () => {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }
    return response.json();
}