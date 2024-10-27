import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const dispatch = useDispatch();
	useEffect(() => {
		const fetchAllPost = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}/post/all`, {
					withCredentials: true,
				});
				if (res.data.success) {
					console.log(res.data.posts);
					dispatch(setPosts(res.data.posts));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchAllPost();
	}, []);
};
export default useGetAllPost;
