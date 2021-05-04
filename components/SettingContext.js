import React from "react";
import RealtimeNotification from "./RealtimeNotification";

const REALTIME_SETTING = "REALTIME_SETTING";

const STATE = { HIDE: 0, SHOW: 1, SOUND: 2, SHOW_SOUND: 3, length: 4 };

function getStateName(state) {
	switch (state) {
		case STATE.HIDE:
			return "Tắt";
		case STATE.SHOW:
			return "Thông báo";
		case STATE.SOUND:
			return "Chuông";
		case STATE.SHOW_SOUND:
			return "Thông báo và chuông";
	}
}

const SETTING = {
	STATE: STATE,
	TYPE: RealtimeNotification.TYPE,
	getTypeName: RealtimeNotification.getTypeName,
	getStateName: getStateName,
};

const initialRealtimeSettingState = [
	[RealtimeNotification.TYPE.ADD_MENU_ITEM, 0],
	[RealtimeNotification.TYPE.CREATE_BILL, 0],
	[RealtimeNotification.TYPE.NEW_MESSAGE, 0],
	[RealtimeNotification.TYPE.PAY_BILL, 0],
	[RealtimeNotification.TYPE.REMOVE_MENU_ITEM, 0],
	[RealtimeNotification.TYPE.UPDATE_MENU_ITEM, 0],
];

function getRealtimeSetting() {
	if (typeof localStorage == "undefined") return null;

	const object = JSON.parse(localStorage.getItem(REALTIME_SETTING));
	if (object == null || object.length != initialRealtimeSettingState.length) {
		localStorage.setItem(
			REALTIME_SETTING,
			JSON.stringify(initialRealtimeSettingState)
		);
	}

	return object || initialRealtimeSettingState;
}
function setRealtimeSetting(setting) {
	localStorage.setItem(REALTIME_SETTING, JSON.stringify(setting));
}

const Context = React.createContext(null);
export default Context;

export function SettingContextProvider({ children }) {
	const [realTimeSetting, setRealTimeSetting] = React.useState(
		getRealtimeSetting()
	);

	
	function updateSetting(setting, value) {
		let settings = realTimeSetting.filter((v) => v != setting);
		for (let i in settings) {
			let item = settings[i];
			if (item[0] == setting) {
				item[1] = value;
			}
			settings[i] = item;
		}
		setRealtimeSetting(settings);
	}
	function getSetting(type) {
		for (let i in realTimeSetting) {
			const setting = realTimeSetting[i];
			if (setting[0] == type) {
				return setting[1];
			}
		}
		return null;
	}

    const action = {
		updateSetting: updateSetting,
		getSetting: getSetting,
	};

	React.useEffect(() => {
		setRealtimeSetting(realTimeSetting);
	}, [realTimeSetting]);

	return (
		<Context.Provider
			value={{
				realTimeSetting,
				setRealTimeSetting,
				action,
				SETTING,
			}}
		>
			{children}
		</Context.Provider>
	);
}
