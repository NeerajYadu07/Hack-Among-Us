import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const dispatch = useDispatch();
	useEffect(() => {
		const fetchSuggestedUsers = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}/user/suggested`, {
					withCredentials: true,
				});
				if (res.data.success) {
					dispatch(setSuggestedUsers(res.data.users));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchSuggestedUsers();
	}, []);
};
export default useGetSuggestedUsers;
