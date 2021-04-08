import React from "react";


export function checkUserPrivilegesInStore(stores,storeId){
	for (let i in stores) {
		const store = stores[i];
		if (store.storeid == storeId && storeId != undefined) {
			return PRIVILE.getUserRights(store.value);
		}
	}
	return [];
};
export function quickCheckPrivileges (state,router) {
	const user = state ? state.user : null;
	const stores = user ? user.stores : null;

	const query = router ? router.query : null;
	const storeId = query ? query.storeId : -1;
	return checkUserPrivilegesInStore(stores,storeId)
}

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

var PRIVILE = {
	OWNER: 0,
	HRM: 1,
	FACILITY: 2,
	STATISTICS: 3,
	WAITER: 4,
	BARTISTA: 5,

	length: 6,
};

PRIVILE.getSumPriority = function (userRights) {
	const arr = PRIVILE.getUserRights(userRights);
	var sum = 0;
	for (let i in arr) {
		sum += PRIVILE.getPriority(arr[i]);
	}
	return sum;
};
PRIVILE.getPriority = function (right) {
	switch (right) {
		case PRIVILE.OWNER:
			return 100;
		case PRIVILE.HRM:
			return 20;
		case PRIVILE.FACILITY:
			return 20;
		case PRIVILE.STATISTICS:
			return 10;
		case PRIVILE.WAITER:
			return 5;
		case PRIVILE.BARTISTA:
			return 5;

	}
	return 0;
};
PRIVILE.getUserRights = (userRights) => {
	var arr = [];
	var temp = userRights;
	var i = PRIVILE.length - 1;
	for (i; i >= 0; i--) {
		const somu = 2 ** i;
		if (temp >= somu) {
			temp = temp - somu;
			arr.unshift(i);
		}
		if (temp == 0) break;
	}
	return arr;
};
PRIVILE.RightToString = (right) => {
	switch (right) {
		case PRIVILE.OWNER:
			return "Chủ sở hữu";
		case PRIVILE.HRM:
			return "Quản lý nhân sự";
		case PRIVILE.FACILITY:
			return "Quản lý cơ sở vật chất";
		case PRIVILE.STATISTICS:
			return "Thống kê";
		case PRIVILE.WAITER:
			return "Phục vụ";
		case PRIVILE.BARTISTA:
			return "Pha chế";

	}
	return "Không rõ";
};
PRIVILE.isUserHasPrivileges = (value, targetRight) => {
	var arr = PRIVILE.getUserRights(value);
	return arr.includes(targetRight);
};
PRIVILE.getRightsValue = (arr) => {
	var value = 0;
	if (arr.length > 0) {
		for (let i in arr) {
			const right = parseInt(arr[i], 0);
			value = value + 2 ** right;
		}
	}
	return value;
};
export var PRIVILE;

export function useConstructor(callBack = () => {}) {
	const [hasBeenCalled, setHasBeenCalled] = React.useState(false);
	if (hasBeenCalled) return;
	callBack();
	setHasBeenCalled(true);
}

export const StoreDir = "/store";
export const NotificationDir = "/account/my-notification"
export const CreateStore = "/account/create-store";
export const SignInDir = "/account/sign-in";
export const RegisterDir = "/account/register";
export const AccountDir = "/account";
export const AboutDir = "/about";

export const DefaultAvatar = "/user/avatar/default-avatar.png";
export const DefaultStore = "/user/store/default.png";


const TIMEBEFORE = [
    {time:1000,name:"giây"},
    {time:60,name:"phút"},
    {time:60,name:"giờ"},
    {time:24,name:"ngày"},
    {time:30,name:"tháng"},
    {time:12,name:"năm"},
];

export function getTimeBefore(date) {
    var target = new Date(date);
    var now = new Date();

    var timeBefore = now.getTime() - target.getTime();
    
    var str = "" ;
    for(let i in TIMEBEFORE){
        const {time,name} = TIMEBEFORE[i];
        const temp = timeBefore / time;
        if(temp >= 1){
            timeBefore = temp;
            str = `${temp.toFixed(0)} ${name} trước`;
            
        }else{
            break;
        }
    }
    if(str == ''){
        str = "Vừa xong";
    }
    
    return str;
}