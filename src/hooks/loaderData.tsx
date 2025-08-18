import { useEffect, useState } from "react";
import axios from "axios";

// Define the shape of user data coming from backend
interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  // add more fields depending on your API response
}

export default function useLoaderData() {
  const [data, setData] = useState<User | null>(null);

  const getConnectedUserDetail = async () => {
    try {
      const response = await axios.get<User>("http://localhost:5000/api/user/getUserDetail", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("tonti_token")}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    }
  };

  useEffect(() => {
    getConnectedUserDetail();
  }, []);

  return data;
}
