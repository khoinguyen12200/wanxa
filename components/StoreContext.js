import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { DefaultAvatar } from "./Const";
import SocketContext from "./SocketContext";
import { Direction } from "./Const";
export const StoreContext = React.createContext(null);

export const actions = {
	signIn: "SIGN_IN",
	signOut: "SIGN_OUT",
	signInWithToken: "SIGN_IN_WITH_TOKEN",
	getBillsRealTime: "GET_BILL_REAL_TIME",
	addMenu: "ADD_MENU",
	addFacility: "ADD_FACILITY",
	addStaff: "ADD_STAFF",
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
			toast.warning("Bạn đã đăng xuất khỏi thiết bị này");
			return { ...state, user: null, token: null };
		case actions.signInWithToken:
			var { user, token } = action.payload;
			user.avatar = user.avatar == "" ? DefaultAvatar : user.avatar;
			return { ...state, user: user, token: token };

		case actions.getBillsRealTime:
			var { bills } = action.payload;
			return { ...state, bills: bills };
		case actions.addMenu:
			var { menu } = action.payload;
			return { ...state, menu: menu };
		case actions.addFacility:
			var { facility } = action.payload;
			return { ...state, facility };
		case actions.addStaff:
			var { staff } = action.payload;
			return { ...state, staff };

		default:
			return state;
	}
};

const initialState = {
	user: null,
	token: null,
	bills: [],
	menu: [],
	facility: [],
	staff: [],
};

export default function StoreProvider({ children }) {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const socket = React.useContext(SocketContext);

	const router = useRouter();
	const { storeId } = router.query;

	React.useEffect(() => {
		updateBillsRealTimes();
		updateMenu();
		updateFacility();
		updateStaff();

		if (storeId == null) {
			socket.emit("leave all");
		} else {
			socket.emit("leave all");
			console.log(Direction.SocketRoom(storeId))
			socket.emit("join", Direction.SocketRoom(storeId));
			

			socket.on("has join", (data) => {
				console.log(data);
			});
			socket.on("connection", (data) => {
				console.log(data);
			});
			socket.on("hello", (data) => {
				console.log(data);
			});
			socket.on("disconnect", (data) => {
				console.log("disconnect");
			});

			socket.on("request-update-bills", ({bills,message}) => {
				toast.dark(message);
				const payload = { bills:bills };
				dispatch({ type: actions.getBillsRealTime, payload });
			});
		}
	}, [storeId]);

	

	React.useEffect(() => {
		reloadToken();
	}, []);
	function reloadToken() {
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
	function getUserId() {
		const user = state ? state.user : null;
		return user ? user.id : null;
	}
	function getStorePrivileges(storeId) {
		const user = state ? state.user : null;
		const stores = user ? user.stores : [];
		for (let i = 0; i < stores.length; i++) {
			const store = stores[i];
			if (store.storeid == storeId) {
				return store.value;
			}
		}
		return -1;
	}

	function requestUpdateBills(message){
		if(storeId != null) socket.emit("update-bills",{storeid:storeId,message:message});
	}

	function updateBillsRealTimes() {
		if (storeId != null) {
			const data = {
				storeid: storeId,
			};
			axios
				.post("/api/store/real-time/get-bills", data)
				.then((res) => {
					if (res.status === 200) {
						const payload = { bills: res.data };
						dispatch({ type: actions.getBillsRealTime, payload });
					}
				})
				.catch((error) => console.log(error));
		} else {
			const payload = { bills: [] };
			dispatch({ type: actions.getBillsRealTime, payload });
		}
	}

	function updateMenu() {
		if (storeId != null) {
			const data = {
				storeid: storeId,
			};
			axios
				.post("/api/store/menu/api-get-group", data)
				.then((res) => {
					if (res.status === 200) {
						const menu = res.data;

						const payload = { menu: menu };
						dispatch({ type: actions.addMenu, payload: payload });
					}
				})
				.catch((error) => console.log(error));
		} else {
			const payload = { menu: [] };
			dispatch({ type: actions.addMenu, payload });
		}
	}

	function getMenuById(id) {
		for (let i in state.menu) {
			const group = state.menu[i];
			for (let j in group.items) {
				const item = group.items[j];
				if (item.id == id) {
					return item;
				}
			}
		}
		return { name: "" };
	}

	function updateFacility() {
		if (storeId != null) {
			const data = {
				storeid: storeId,
			};
			axios
				.post("/api/store/facility/api-get-facility", data)
				.then((res) => {
					if (res.status === 200) {
						const payload = { facility: res.data };
						dispatch({ type: actions.addFacility, payload });
					}
				})
				.catch((error) => console.log(error));
		} else {
			const payload = { facility: [] };
			dispatch({ type: actions.addFacility, payload });
		}
	}
	function getFacilityById(id) {
		for (let i in state.facility) {
			const group = state.facility[i];
			for (let j in group.tables) {
				const table = group.tables[j];
				if (table.id == id) {
					return table;
				}
			}
		}
		return null;
	}
	function updateStaff() {
		if (storeId != null) {
			const data = {
				storeid: storeId,
			};
			axios
				.post("/api/store/staff/api-get-staff", data)
				.then((res) => {
					if (res.status === 200) {
						const payload = { staff: res.data };
						dispatch({ type: actions.addStaff, payload });
					}
				})
				.catch((error) => console.log(error));
		} else {
			const payload = { staff: [] };
			dispatch({ type: actions.addStaff, payload });
		}
	}
	function getStaffById(staffId) {
		for (let i in state.staff) {
			const staff = state.staff[i];
			if (staff.id == staffId) {
				return staff;
			}
		}
		return null;
	}

	return (
		<StoreContext.Provider
			value={{
				state,
				dispatch,
				reloadToken,
				getSavedToken,
				getStorePrivileges,
				getUserId,
				requestUpdateBills,
				getMenuById,
				getFacilityById,
				getStaffById,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}
