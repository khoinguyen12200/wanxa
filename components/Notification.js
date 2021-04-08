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
import { getTimeBefore } from "./Const";
import styles from "./styles/Notification.module.css";

	

const TYPE = {
	UPDATE_STORE_NAME: "UPDATE_STORE_NAME",
	INTERNAL_NOTIFICATION: "INTERNAL_NOTIFICATION",
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
		keys: ["ExecutorId", "ExecutorName", "StoreId", "Notification"],
		defines: {
			ExecutorId: "number",
			ExecutorName: "string",
			StoreId: "number",
			Notification: "string",
		},
	},
};

function shortNoti(notification) {
	if(notification.length <= 70) {
		return notification;
	}else{
		return notification.slice(0, 70)+"... ";
	}
}

function MESSAGE(content, type) {
	switch (type) {
		case TYPE.UPDATE_STORE_NAME:
			return `${content.ExecutorName} đã chỉnh sửa tên doanh nghiệp ${content.OldName} thành ${content.NewName}`;
		case TYPE.INTERNAL_NOTIFICATION:
			return `${content.ExecutorName} thông báo đến mọi người "${shortNoti(content.Notification)}"`;
	}
	return "";
}

export default class Notification {
	static CONTENT = CONTENT;
	static TYPE = TYPE;
	static MESSAGE = MESSAGE;

	constructor(type, content, destination, seen, time) {
		this.type = type;
		if (typeof content === "object") {
			this.content = content;
		} else {
			this.content = JSON.parse(content);
		}

		this.destination = destination || 0;
		this.seen = seen || false;
		this.time = time;
	}
	getMessage() {
		if (this.isValid()) {
			return Notification.MESSAGE(this.content, this.type);
		}
	}

	getInsertParameter() {
		if (!this.isValid()) {
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

export function NotificationRow({ notification, onClick }) {
	const { type, content, destination, seen, time } = notification;
	var notiObject = new Notification(type, content, destination, seen, time);

	function handleClick() {
		if (onClick) {
			onClick();
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
