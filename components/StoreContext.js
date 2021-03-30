import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const StoreContext = React.createContext(null);

export const actions = {
	signIn: "SIGN_IN",
	signOut: "SIGN_OUT",
	signInWithToken: "SIGN_IN_WITH_TOKEN",
};
const reducer = (state, action) => {
	switch (action.type) {
		case actions.signIn:
			var { user, token, save } = action.payload;
			const availableTo = 1000 * 60 * 60 * 24 * 1 + new Date().getTime();
			if (save) {
				localStorage.setItem("token", token);
				localStorage.setItem("expires_at", JSON.stringify(availableTo));
			}

			return { ...state, user: user, token: token };

		case actions.signOut:
			localStorage.setItem("token", token);
			localStorage.setItem("expires_at", "0");
			state.user = null;
			state.token = null;
			console.log(state);
		case actions.signInWithToken:
			var { user, token } = action.payload;
			return { ...state, user: user, token: token };
		default:
			return state;
	}
};

const initialState = {
	user: null,
	token: null,
};
export default function StoreProvider({ children }) {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	React.useEffect(() => {
		const savedToken = getSavedToken();
		var formData = new FormData();
		formData.append("token", savedToken);

		if (savedToken) {
			axios
				.post("/api/user/signInWithToken", formData)
				.then((res) => {
					if (res.status === 200) {
						const { message, user } = res.data;
						toast.success(message,{autoClose:2000});
						const payload = { user: user, token: savedToken };
						dispatch({
							type: actions.signInWithToken,
							payload: payload,
						});
					}
				})
				.catch((error) => console.log(error));
		}
	}, []);
	return (
		<StoreContext.Provider value={[state, dispatch]}>
			{children}
		</StoreContext.Provider>
	);
}

function getSavedToken() {
	const time = JSON.parse(localStorage.getItem("expires_at"));
	if (new Date().getTime() > time) {
		return null;
	} else {
		return localStorage.getItem("token");
	}
}
