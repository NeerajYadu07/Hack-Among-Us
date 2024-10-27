// import { setMessages } from "@/redux/chatSlice";
// import { setPosts } from "@/redux/postSlice";
// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const useGetAllMessage = () => {
// 	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// 	const dispatch = useDispatch();
// 	const { selectedUser } = useSelector((store) => store.auth);
// 	useEffect(() => {
// 		const fetchAllMessage = async () => {
// 			try {
// 				const res = await axios.get(
// 					`${API_BASE_URL}/message/all/${selectedUser?._id}`,
// 					{ withCredentials: true }
// 				);
// 				if (res.data.success) {
// 					dispatch(setMessages(res.data.messages));
// 				}
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		};
// 		fetchAllMessage();
// 	}, [selectedUser]);
// };
// export default useGetAllMessage;

import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { decrypt } from "@/lib/utils";

const useGetAllMessage = () => {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const dispatch = useDispatch();
	const { selectedUser } = useSelector((store) => store.auth);

	

	useEffect(() => {
		const fetchAllMessage = async () => {
			try {
				const res = await axios.get(
					`${API_BASE_URL}/message/all/${selectedUser?._id}`,
					{ withCredentials: true }
				);
				console.log(res.data);
				
				if (res.data.success) {
					// Decrypt each message in the list
					const decryptedMessages = res.data.messages.map((msg) => ({
						...msg,
						message: decrypt(msg.message),
					}));
					console.log(decryptedMessages);
					
					dispatch(setMessages(decryptedMessages));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchAllMessage();
	}, [selectedUser]);
};

export default useGetAllMessage;
