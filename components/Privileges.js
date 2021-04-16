export default class Privileges {
	static Content = {
		OWNER: 0,
		NOTIFICATION: 1,
		HRM: 2,
		FACILITY: 3,
		STATISTICS: 4,
		MENU: 5,
		WAITER: 6,
		BARISTA: 7,
	};
	static length = 8;

	static ValueToString = (right) => {
		switch (right) {
			case Privileges.Content.OWNER:
				return "Chủ sở hữu";
			case Privileges.Content.NOTIFICATION:
				return "Thông báo";
			case Privileges.Content.HRM:
				return "Quản lý nhân sự";
			case Privileges.Content.FACILITY:
				return "Quản lý cơ sở vật chất";
			case Privileges.Content.STATISTICS:
				return "Thống kê";
			case Privileges.Content.MENU:
				return "Quản lý thực đơn";
			case Privileges.Content.WAITER:
				return "Phục vụ";
			case Privileges.Content.BARISTA:
				return "Pha chế";
		}
		return "Không rõ";
	};
	static getPriority = function (value) {
		switch (value) {
			case Privileges.Content.OWNER:
				return 100;
			case Privileges.Content.NOTIFICATION:
				return 25;
			case Privileges.Content.HRM:
				return 20;
			case Privileges.Content.FACILITY:
				return 20;
			case Privileges.Content.MENU:
				return 20;
			case Privileges.Content.STATISTICS:
				return 10;
			case Privileges.Content.WAITER:
				return 5;
			case Privileges.Content.BARISTA:
				return 5;
		}
		return 0;
	};

	static arrToValue = (arr) => {
		var value = 0;
		if (arr.length > 0) {
			for (let i in arr) {
				const right = parseInt(arr[i], 0);
				value = value + 2 ** right;
			}
		}
		return value;
	};

	static isValueIncluded(value, arr) {
		const newArr = Privileges.valueToArray(value);
		for (let i in arr) {
			if (newArr.includes(arr[i])) {
				return true;
			}
		}
		return false;
	}

	static valueToArray = (value) => {
		var arr = [];
		var temp = value;
		var i = Privileges.length - 1;
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

	static getSumPriority = function (arr) {
		var sum = 0;
		for (let i in arr) {
			const val = arr[i];
			sum += Privileges.getPriority(val);
		}
		return sum;
	};
}
