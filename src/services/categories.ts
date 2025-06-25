const getCategoryById = async (id: string) => {
    try {
        const response = await fetch(`/api/categories/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching category with ID ${id}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

export {getCategoryById};