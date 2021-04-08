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



const TYPE = {
	UPDATE_STORE_NAME: "UPDATE_STORE_NAME",
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
};

function MESSAGE(content,type){

	switch(type){
		case TYPE.UPDATE_STORE_NAME:
		return `${content.ExecutorName} đã chỉnh sửa tên doanh nghiệp ${content.OldName} thành ${content.NewName}`;
	}
	return "";
}

export default class Notification{
	static CONTENT = CONTENT;
	static TYPE = TYPE;
	static MESSAGE = MESSAGE;

	constructor(type, content, destination, seen,time) {
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
	getMessage(){
		if(this.isValid()){
			return Notification.MESSAGE(this.content,this.type);
		}
	}
	render(){
		return <NotificationRender message={this.getMessage()} seen={this.seen} time={this.time}/>
	}

	getInsertParameter() {
		if (!this.isValid()) {
			return [''];
		}

		const content = JSON.stringify(this.content);

		return [
			"INSERT INTO `notification`(`type`, `content`, `destination`) VALUES (?,?,?)",
			[this.type, content, this.destination]
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

function NotificationRender({message,time,seen}){
	const date = new Date(time);
	return (
		<div>
			{message+" "}
			<Badge color="secondary">{date.getUTCDate()}</Badge>
		</div>
	)
}