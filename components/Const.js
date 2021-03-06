import React from "react";
import { useRouter } from "next/router";
import { StoreContext } from "./StoreContext";
import axios from "axios";

var dateFormat = require("dateformat");

export function isMobile() {
	let check = false;
	if (typeof window !== "undefined") {
		(function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				check = true;
		})(navigator.userAgent || window.navigator.vendor || window.opera);
	}

	return check;
}
export var onImageChange = (event) => {
	return new Promise((resolve, reject) => {
		if (event.target.files && event.target.files[0]) {
			var file = event.target.files[0];
			var filesize = (file.size / 1024 / 1024).toFixed(4);
			let reader = new FileReader();
			reader.onload = (e) => {
				resolve({ src: e.target.result, file: file, size: filesize });
			};
			reader.readAsDataURL(file);
		}
	});
};

export function getExtension(filename) {
	var name = filename || "";
	var arr = name.split(".");
	return arr[arr.length - 1];
}

export function useConstructor(callBack = () => {}) {
	const [hasBeenCalled, setHasBeenCalled] = React.useState(false);
	if (hasBeenCalled) return;
	callBack();
	setHasBeenCalled(true);
}

export const StoreDir = "/store";
export const NotificationDir = "/account/my-notification";
export const CreateStore = "/account/create-store";
export const SignInDir = "/account/sign-in";
export const RegisterDir = "/account/register";
export const AccountDir = "/account";
export const AboutDir = "/about";
export const ChangePasswordDir = "/account/change-password";
export const MyInvitation = (id) => `/account/my-invitation/${id}`;
export const DefaultAvatar = "/user/avatar/default-avatar.png";
export const DefaultStore = "/user/store/default.png";

export const InternalNotificationDir = (storeId) =>
	`/store/${storeId}/internal-notification`;
export const CreateInternalNotificationDir = (storeId) =>
	`/store/${storeId}/internal-notification/create`;

export const InternalNotificationDetailDir = (storeId, inId) =>
	`/store/${storeId}/internal-notification/detail/${inId}`;

export const EditInternalNotificationDir = (storeId, inId) =>
	`/store/${storeId}/internal-notification/detail/${inId}/edit`;

export class Direction {
	static SocketRoom = (storeId) => `room/${storeId}/`;

	static Store = (id) => "/store/" + id;

	static Notification = "/account/my-notification";
	static CreateStore = "/account/create-store";
	static SignIn = "/account/sign-in";
	static Register = "/account/register";
	static Account = "/account";
	static About = "/about";
	static ChangePassword = "/account/change-password";
	static MyInvitation = (id) => `/account/my-invitation/${id}`;
	static DefaultAvatar = "/user/avatar/default-avatar.png";
	static DefaultStore = "/user/store/default.png";
	static DefaultMenu = "/user/menu/menu-item-default.png";

	static InternalNotification = (storeId) =>
		`/store/${storeId}/internal-notification`;
	static CreateInternalNotification = (storeId) =>
		`/store/${storeId}/internal-notification/create`;
	static InternalNotificationDetail = (storeId, inId) =>
		`/store/${storeId}/internal-notification/detail/${inId}`;
	static EditInternalNotification = (storeId, inId) =>
		`/store/${storeId}/internal-notification/detail/${inId}/edit`;

	static HRM = (storeId) => `/store/${storeId}/hrm`;

	static BasicInfo = (storeId) => `/store/${storeId}/basic-info`;

	static Bills = (storeId) => `/store/${storeId}/bills`;

	static Menu = (storeId) => `/store/${storeId}/menu`;
	static MenuEdit = (storeId) => `/store/${storeId}/menu/edit-menu`;

	static Facility = (storeId) => `/store/${storeId}/facility`;
	static FacilityEdit = (storeId) =>
		`/store/${storeId}/facility/edit-facility`;

	static RealTime = (storeId) => `/store/${storeId}/real-time`;
	static RealTimeHRM = (storeId) => `/store/${storeId}/real-time/hrm`;
	static RealTimeCreateBill = (storeId, tableId) =>
		`/store/${storeId}/real-time/create-bill/${tableId}`;
	static RealTimeBarista = (storeId) => `/store/${storeId}/real-time/barista`;

	static RealTimeManageBill = (storeId, bill_id) =>
		`/store/${storeId}/real-time/manage-bill/${bill_id}`;

	static Statistics = (storeId) => `/store/${storeId}/statistics`;

	static Setting = (storeId) => `/store/${storeId}/setting`;
}

const TIMEBEFORE = [
	{ time: 1000, name: "gi??y" },
	{ time: 60, name: "ph??t" },
	{ time: 60, name: "gi???" },
	{ time: 24, name: "ng??y" },
	{ time: 30, name: "th??ng" },
	{ time: 12, name: "n??m" },
];

export function getTimeBefore(date) {
	var target = new Date(date);
	var now = new Date();

	var timeBefore = now.getTime() - target.getTime();

	var str = "";
	for (let i in TIMEBEFORE) {
		const { time, name } = TIMEBEFORE[i];
		const temp = timeBefore / time;
		if (temp >= 1) {
			timeBefore = temp;
			str = `${temp.toFixed(0)} ${name} tr?????c`;
		} else {
			break;
		}
	}
	if (str == "") {
		str = "V???a xong";
	}

	return str;
}

export const FormatDateTime = (date) => {
	return dateFormat(date, "HH:MM - dd/mm/yyyy ");
};

export function useStoreStaff(callBack) {
	const router = useRouter();
	const { storeId } = router.query;
	const { state, getStorePrivileges } = React.useContext(StoreContext);
	React.useEffect(() => {
		const value = getStorePrivileges(storeId);
		if (callBack) callBack(value);
	}, [storeId, state]);
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function socketUpdateBills(message) {
	const router = useRouter();
	const { storeId } = router.query;
	return new Promise((resolve, reject) => {
		const data = {
			storeid: storeId,
			message: message,
		};
		console.log(data);
		axios
			.post("/api/socket/updateBills", data)
			.then((res) => {
				if (res.status === 200) {
					resolve(res);
				}
			})
			.catch((error) => reject(error));
	});
}
