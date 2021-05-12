import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { DefaultAvatar } from "./Const";
import SocketContext from "./SocketContext";
import { Direction } from "./Const";
import RealtimeNotification from "./RealtimeNotification";
import RealtimeSetting from "./SettingContext";

export const StoreContext = React.createContext(null);

export const actions = {
	signIn: "SIGN_IN",
	signOut: "SIGN_OUT",
	signInWithToken: "SIGN_IN_WITH_TOKEN",
	getBillsRealTime: "GET_BILL_REAL_TIME",
	addMenu: "ADD_MENU",
	addFacility: "ADD_FACILITY",
	addStaff: "ADD_STAFF",
	addMessage: "ADD_MESSAGE",
	newMessage: "NEW_MESSAGE",
};

function setAxiosHeaderToken(token) {
	axios.defaults.headers.common["Authorization"] = token;
}
function setAxiosHeaderStoreId(storeid) {
	axios.defaults.headers.common["storeid"] = storeid;
}
const reducer = (state, action) => {
	switch (action.type) {
		case actions.signIn:
			var { user, token } = action.payload;
			if(user==null){
				return state;
			}
			setAxiosHeaderToken(token);
			localStorage.setItem("token", token);
			user.avatar = user.avatar == "" ? DefaultAvatar : user.avatar;
			return { ...state, user: user, token: token };

		case actions.signOut:
			setAxiosHeaderToken(null);
			localStorage.setItem("token", null);
			toast.warning("Bạn đã đăng xuất khỏi thiết bị này");
			return { ...state, user: null, token: null };

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
		case actions.addMessage:
			var { message } = action.payload;
			return { ...state, message };
		case actions.newMessage:
			var { newMessage } = action.payload;
			var messages = state.message.concat([]);
			const messageids = messages.map((message) => message.id);
			if (messageids.includes(newMessage.id)) {
				return { ...state };
			} else {
				messages.unshift(newMessage);
				return { ...state, message: messages };
			}

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
	message: [],
};

export default function StoreProvider({ children }) {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const socket = React.useContext(SocketContext);

	const router = useRouter();
	const { storeId } = router.query;

	const { action, SETTING } = React.useContext(RealtimeSetting);

	function notify(notification) {
		try {
			const noti = new RealtimeNotification({
				...notification,
				state: state,
			});
			console.log(noti);
			const setting = action.getSetting(noti.type);
			console.log(setting);
			if (
				setting == SETTING.STATE.SHOW ||
				setting == SETTING.STATE.SHOW_SOUND
			) {
				toast.info(noti.getMessage());
			}
			if (
				setting == SETTING.STATE.SOUND ||
				setting == SETTING.STATE.SHOW_SOUND
			) {
				const audio = new Audio('/system/sound/notification.mp3');
				audio.play();
			}
		} catch (e) {
			console.log(e);
		}
	}

	React.useEffect(() => {
		setAxiosHeaderStoreId(storeId);
		updateBillsRealTimes();
		updateMenu();
		updateFacility();
		updateStaff();
		updateMessage();

		if (storeId == null) {
			socket.emit("leave all");
		} else {
			socket.emit("leave all");
			socket.emit("join", Direction.SocketRoom(storeId));
		}
	}, [storeId]);

	React.useEffect(() => {
		socket.off("request-update-bills");
		socket.off("new-message");

		socket.on("request-update-bills", ({ bills, notification }) => {
			const payload = { bills: bills };
			dispatch({ type: actions.getBillsRealTime, payload });
			notify(notification);
		});

		socket.on("new-message", (data) => {
			const payload = { newMessage: data };
			dispatch({ type: actions.newMessage, payload });
			if (data.userid != state.user.id) {
				const notification = {
					type: RealtimeNotification.TYPE.NEW_MESSAGE,
					executor: data.userid,
					payload: { message: data.message },
					state: state,
				};
				notify(notification);
			}
		});
	}, [state]);

	React.useEffect(() => {
		if (state == null) {
			return;
		}
	}, [state]);
	React.useEffect(() => {
		if (state.user != null) {
			socket.emit("setInfo", state.user.id);
		}
	}, [state.user]);

	React.useEffect(() => {
		reloadToken();
	}, []);

	function reloadToken() {
		const savedToken = getSavedToken();
		setAxiosHeaderToken(savedToken);

		axios.post("/api/user/signInWithToken").then((res) => {
			if (res.status === 200) {
				const { message, user, token } = res.data;
				const payload = { user: user, token: token };
				dispatch({ type: actions.signIn, payload });
			}
		});
	}

	function getSavedToken() {
		return localStorage.getItem("token");
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

	function requestUpdateBills(notification) {
		if (storeId != null)
			socket.emit("update-bills", {
				storeid: storeId,
				notification: notification,
			});
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
	function updateMessage() {
		const data = {
			storeid: storeId,
		};
		axios
			.post("/api/store/message/getAllMessage", data)
			.then((res) => {
				if (res.status === 200) {
					const message = res.data;

					const payload = { message: message };
					dispatch({ type: actions.addMessage, payload: payload });
				} else {
					const payload = { message: [] };
					dispatch({ type: actions.addMessage, payload: payload });
				}
			})
			.catch((error) => console.log(error));
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
				updateStaff,
				updateMenu,
				updateFacility,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}
