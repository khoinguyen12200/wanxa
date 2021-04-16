import React from "react";
import axios from "axios";
import {useRouter} from 'next/router';
import { toast } from "react-toastify";
import { DefaultAvatar } from "./Const";
export const StoreContext = React.createContext(null);

export const actions = {
	signIn: "SIGN_IN",
	signOut: "SIGN_OUT",
	signInWithToken: "SIGN_IN_WITH_TOKEN",
	getBillsRealTime: "GET_BILL_REAL_TIME",

};
const reducer = (state, action) => {
	switch (action.type) {
		case actions.signIn:
			var { user, token, save } = action.payload;
			const saveTime = save ? 30 : 1;
			const availableTo =
				1000 * 60 * 60 * 24 * saveTime + new Date().getTime();
			localStorage.setItem("token", token);
			localStorage.setItem("expires_at", JSON.stringify(availableTo));
			user.avatar = user.avatar == "" ? DefaultAvatar : user.avatar;
			return { ...state, user: user, token: token };

		case actions.signOut:
			localStorage.setItem("token", token);
			localStorage.setItem("expires_at", "0");
			toast.warning("Bạn đã đăng xuất khỏi thiết bị này")
			return {...state,user:null,token:null};
		case actions.signInWithToken:
			var { user, token } = action.payload;
			user.avatar = user.avatar == "" ? DefaultAvatar : user.avatar;
			return { ...state, user: user, token: token };

		case actions.getBillsRealTime:
			var { bills } = action.payload;
			return { ...state, bills: bills};

		default:
			return state;
	}
};

const initialState = {
	user: null,
	token: null,
	bills: [],
};
export default function StoreProvider({ children }) {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	

	const router = useRouter();
	const {storeId} = router.query;

	React.useEffect(()=>{
		updateBillsRealTimes();
	},[storeId])
	
	React.useEffect(() => {
		reloadToken();
	}, []);
	function reloadToken(){
		const savedToken = getSavedToken();
		var formData = new FormData();
		formData.append("token", savedToken);
		axios.post("/api/user/signInWithToken", formData).then((res) => {
			if (res.status === 200) {
				const { message, user } = res.data;
				const payload = { user: user, token: savedToken };
				dispatch({ type: actions.signInWithToken, payload });
			}
		});
	}
	function getSavedToken() {
		const time = JSON.parse(localStorage.getItem("expires_at"));
		if (new Date().getTime() > time) {
			return null;
		} else {
			return localStorage.getItem("token");
		}
	}
	function getUserId(){
		const user = state ? state.user : null;
		return user ? user.id : null;
	}
	function getStorePrivileges(storeId){
		const user = state ? state.user : null;
		const stores = user ? user.stores : [];
		for(let i = 0; i < stores.length; i++){
			const store = stores[i];
			if(store.storeid == storeId){
				return store.value;
			}
		}
		return -1;

	}
	
	function updateBillsRealTimes(){

		if(storeId != null){
			const data = {
				storeid: storeId,
			}
			axios
			.post("/api/store/real-time/get-bills", data)
			.then((res) => {
				if (res.status === 200) {
					const payload = { bills:res.data };
					dispatch({ type: actions.getBillsRealTime, payload });
				}
			})
			.catch((error) => console.log(error));
		}
	}
	function getBills(){
		if(state.bills != null){
			return state.bills;
		}
		return [];
	}

	return (
		<StoreContext.Provider value={{state, dispatch,reloadToken,getSavedToken,getStorePrivileges,getUserId,updateBillsRealTimes,getBills}}>
			{children}
		</StoreContext.Provider>
	);
}

