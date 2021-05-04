import React from "react";
import { StoreContext } from "./StoreContext";

export default class RealtimeNotification {
	static TYPE = {
		CREATE_BILL: "create-bill",
		ADD_MENU_ITEM: "add-menu-item",
		REMOVE_MENU_ITEM: "remove-menu-item",
		PAY_BILL: "pay-bill",
		UPDATE_MENU_ITEM: "update-menu-item",
        NEW_MESSAGE: "new-message"
	};
	constructor({ type, executor, payload, state }) {
		this.type = type;
		this.executor = executor;
		this.payload = payload;
		this.state = state;
	}

	getMessage() {
		try {
			switch (this.type) {
				case RealtimeNotification.TYPE.CREATE_BILL:
					return `${this.getStaffName(
						this.executor
					)} đã tạo hóa đơn mới tại ${this.getTableName(
						this.payload.table_id
					)}`;
				case RealtimeNotification.TYPE.ADD_MENU_ITEM:
					return `${this.getStaffName(
						this.executor
					)} đã thêm ${this.getMenuName(
						this.payload.menu_item_id
					)} vào hóa đơn ${this.payload.bill_id}`;
				case RealtimeNotification.TYPE.REMOVE_MENU_ITEM:
					return `${this.getStaffName(
						this.executor
					)} đã xóa ${this.getMenuName(
						this.payload.menu_item_id
					)} khỏi hóa đơn ${this.payload.bill_id}`;
				case RealtimeNotification.TYPE.PAY_BILL:
					return `${this.getStaffName(
						this.executor
					)} đã thanh toán hóa đơn tại ${this.getTableName(
						this.payload.table_id
					)}`;
				case RealtimeNotification.TYPE.UPDATE_MENU_ITEM:
					let state = "";
					switch (this.payload.type) {
						case 0:
							state = "Đang đợi";
							break;
						case 1:
							state = "Đang thực hiện";
							break;
						case 2:
							state = "Đã xong";
							break;
						default:
							state = "";
							break;
					}
					return `${this.getStaffName(
						this.executor
					)} đã đổi trạng thái ${this.getMenuName(
						this.payload.menu_item_id
					)} thành ${state}`;

                case  RealtimeNotification.TYPE.NEW_MESSAGE:
                    return `${this.getStaffName(this.executor)}: ${this.payload.message}`
				default:
					return null;
			}
		} catch (e) {
			return null;
		}
	}

	getStaffName(staffId) {
		try {
			const staff = this.state.staff;

			if (staffId == this.state.user.id) {
				return "Bạn";
			}
			for (let i in staff) {
				const user = staff[i];
				if (staffId == user.id) {
					return user.name;
				}
			}
		} catch (e) {
			console.error(e);
		}
		return staffId;
	}
	getMenuName(menuId) {
		try {
			const menu = this.state.menu;

			for (let i in menu) {
				const group = menu[i];
				for (let j in group.items) {
					const item = group.items[j];
					if (menuId == item.id) {
						return item.name;
					}
				}
			}
		} catch (e) {}
		return menuId;
	}
	getTableName(tableId) {
		try {
			const facility = this.state.facility;
			for (let i in facility) {
				const group = facility[i];
				for (let j in group.tables) {
					const table = group.tables[j];
					if (tableId == table.id) {
						return table.name;
					}
				}
			}
		} catch (e) {}

		return tableId;
	}
}
