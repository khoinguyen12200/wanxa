// import query from "../pages/api/const/connection";
import React from "react";
import {
	Badge,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "reactstrap";
import {
	getTimeBefore,
	InternalNotificationDetailDir,
	ChangePasswordDir,
	MyInvitation,
} from "./Const";
import styles from "./styles/Notification.module.css";
import { useRouter } from "next/router";
import { decodePost } from "./RichTextEditor";

const TYPE = {
	UPDATE_STORE_NAME: "UPDATE_STORE_NAME",
	INTERNAL_NOTIFICATION: "INTERNAL_NOTIFICATION",
	WARNING_AUTO_CREATE: "WARNING_AUTO_CREATE",
	INVITE_TO_STORE: "INVITE_TO_STORE",
};
const CONTENT = {
	UPDATE_STORE_NAME: {
		keys: ["ExecutorId", "ExecutorName", "StoreId", "OldName", "NewName"],
		defines: {
			ExecutorId: "number",
			ExecutorName: "string",
			StoreId: "number",
			OldName: "string",
			NewName: "string",
		},
	},
	INTERNAL_NOTIFICATION: {
		keys: ["ExecutorId", "ExecutorName", "StoreId", "Message"],
		defines: {
			ExecutorId: "number",
			ExecutorName: "string",
			StoreId: "number",
			Message: "string",
		},
	},
	WARNING_AUTO_CREATE: {
		keys: ["StaffName"],
		defines: { StaffName: "string" },
	},

	INVITE_TO_STORE: {
		keys: ["ExecutorId", "ExecutorName", "StoreId", "StoreName", "id"],
		defines: {
			id:"number",
			ExecutorId: "number",
			ExecutorName: "string",
			StoreId: "number",
			StoreName: "string",
		},
	},
};

function shortNoti(notification) {
	if (notification.length <= 70) {
		return notification;
	} else {
		return notification.slice(0, 70) + "... ";
	}
}
function stripHtml(str) {
	let tmp = document.createElement("DIV");
	var html = decodePost(str);
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function MESSAGE(content, type) {
	switch (type) {
		case TYPE.UPDATE_STORE_NAME:
			return `${content.ExecutorName} đã chỉnh sửa tên doanh nghiệp ${content.OldName} thành ${content.NewName}`;
		case TYPE.INTERNAL_NOTIFICATION:
			return `${
				content.ExecutorName
			} đã thông báo thông báo  "${shortNoti(
				stripHtml(content.Message)
			)}"`;
		case TYPE.WARNING_AUTO_CREATE:
			return `Chào mừng ${content.StaffName} đăng nhập lần đầu, tài khoản này được tạo bởi chủ doanh nghiệp. Yêu cầu đổi mật khẩu ngay khi thấy thông báo này để tránh xảy ra các sự cố đáng tiếc`;
		case TYPE.INVITE_TO_STORE:
			return `${content.ExecutorName} đã mời bạn làm thành viên của cửa hàng ${content.StoreName}. Click vào đây để xem lời mời !`;
	}
	return "";
}

function ACTION_LINK(type, content) {
	switch (type) {
		case TYPE.INTERNAL_NOTIFICATION:
			return InternalNotificationDetailDir(content.StoreId, content.id);
		case TYPE.WARNING_AUTO_CREATE:
			return ChangePasswordDir;
			case TYPE.INVITE_TO_STORE:
			return MyInvitation(content.id);
	}
	return null;
}

export default class Notification {
	static CONTENT = CONTENT;
	static TYPE = TYPE;
	static MESSAGE = MESSAGE;
	static ACTION_LINK = ACTION_LINK;

	constructor({ type, content, destination, seen, time, id }) {
		this.type = type;
		this.id = id;
		if (typeof content === "object") {
			this.content = content;
		} else {
			this.content = JSON.parse(content);
		}

		this.destination = destination;
		this.seen = seen || false;
		this.time = time;
	}
	getLink() {
		return Notification.ACTION_LINK(this.type, this.content, this.id);
	}
	getMessage() {
		if (this.isValid()) {
			return Notification.MESSAGE(this.content, this.type);
		}
	}

	getInsertParameter() {
		if (!this.isValid() || this.destination == null) {
			return [""];
		}

		const content = JSON.stringify(this.content);

		return [
			"INSERT INTO `notification`(`type`, `content`, `destination`) VALUES (?,?,?)",
			[this.type, content, this.destination],
		];
	}
	isValid() {
		var check = true;

		if (this.constructor.CONTENT[this.type]) {
			const { keys, defines } = this.constructor.CONTENT[this.type];
			for (let i in keys) {
				const key = keys[i];
				const define = defines[key];
				if (typeof this.content[key] !== define) {
					check = false;
				}
			}
		} else {
			check = false;
		}

		return check;
	}
}

export function NotificationRow({ notification, onClick, toggle }) {
	const router = useRouter();
	const { type, content, destination, seen, time, id } = notification;
	var notiObject = new Notification({
		type,
		content,
		destination,
		seen,
		time,
		id,
	});

	function handleClick() {
		if (onClick) {
			onClick();
			if (notiObject.getLink() != null) {
				if (toggle) toggle();
				router.push(notiObject.getLink());
			}
		}
	}

	return (
		<div
			key={notification.id}
			className={
				seen
					? styles.notification + " " + styles.notiSeen
					: styles.notification
			}
		>
			<p
				className={styles.notificationMessage}
				onClick={() => handleClick()}
			>
				{notiObject.getMessage()}
			</p>
			<div>
				<Badge className={styles.time} color="secondary">
					{getTimeBefore(time)}
				</Badge>
			</div>
		</div>
	);
}
