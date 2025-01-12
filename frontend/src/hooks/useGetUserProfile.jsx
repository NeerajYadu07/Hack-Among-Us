import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const dispatch = useDispatch();
	// const [userProfile, setUserProfile] = useState(null);
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await axios.get(
					`${API_BASE_URL}/user/${userId}/profile`,
					{ withCredentials: true }
				);
				if (res.data.success) {
					dispatch(setUserProfile(res.data.user));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchUserProfile();
	}, [userId]);
};
export default useGetUserProfile;
