import React, { useState } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Label,
} from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import ReactDom from "react-dom";

const CONTAINER_ID = "my-abcxyz-modal-container";
export function ModalContainer({}) {
	return <div id={CONTAINER_ID}></div>;
}
function makeWrapElement() {
	const id = uuidv4();
	var wrapdiv = document.createElement("div");
	wrapdiv.id = id;
	document.getElementById(CONTAINER_ID).appendChild(wrapdiv);
	return id;
}
export function alertDialog(message, onYes, onNo, options) {
	const id = makeWrapElement();
	const element = (
		<AlertModal
			message={message}
			parentId={id}
			onYes={onYes}
			onNo={onNo}
			options={options}
		/>
	);
	ReactDom.render(element, document.getElementById(id));
}

export function promptDialog(message, onYes, onNo, options) {
	const id = makeWrapElement();
	const element = (
		<PromptModal
			message={message}
			parentId={id}
			onYes={onYes}
			onNo={onNo}
			options={options}
		/>
	);
	ReactDom.render(element, document.getElementById(id));
}

export function PromptModal({ message, parentId, onYes, onNo, options }) {
	options = options || {};
	const backdrop = options ? options.backdrop || "static" : "static";
	const { defaultValue } = options;

	const InputRef = React.useRef(null);

	function focusToInput() {
		if (InputRef && InputRef.current) {
			InputRef.current.focus();
		}
	}

	var [value, setValue] = React.useState(defaultValue || "");

	function handleYes() {
		if (onYes) {
			onYes(value);
		}
		toggle();
	}
	function handleNo() {
		if (onNo) {
			onNo();
		}
		toggle();
	}
	function onSubmit(e){
		e.preventDefault();
		handleYes()
	}

	const [modal, setModal] = useState(true);

	const toggle = () => setModal(false);

	function onExit() {
		ReactDom.unmountComponentAtNode(document.getElementById(parentId));
		document.getElementById(parentId).remove();
	}
	return (
		<div>
			<Modal
				onOpened={focusToInput}
				backdrop={backdrop}
				isOpen={modal}
				toggle={toggle}
				onExit={() => {
					onExit();
				}}
			>
				<ModalHeader>Thông báo</ModalHeader>
				<ModalBody>
					<Label>{message}</Label>
					<form onSubmit={onSubmit}>
						<input
							ref={InputRef}
							className="form-control"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={handleYes}>
						Đồng ý
					</Button>
					<Button color="secondary" onClick={handleNo}>
						Hủy bỏ
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export const AlertModal = ({ message, parentId, onYes, onNo, options }) => {
	const backdrop = options ? options.backdrop || "static" : "static";
	function handleYes() {
		if (onYes) {
			onYes();
		}
		toggle();
	}
	function handleNo() {
		if (onNo) {
			onNo();
		}
		toggle();
	}

	const [modal, setModal] = useState(true);

	const toggle = () => setModal(false);

	function onExit() {
		ReactDom.unmountComponentAtNode(document.getElementById(parentId));
		document.getElementById(parentId).remove();
	}
	return (
		<div>
			<Modal
				backdrop={backdrop}
				isOpen={modal}
				toggle={toggle}
				onExit={() => {
					onExit();
				}}
			>
				<ModalHeader>Thông báo</ModalHeader>
				<ModalBody>
					<p style={{ whiteSpace: "pre-line" }}>{message}</p>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={handleYes}>
						Đồng ý
					</Button>
					<Button color="secondary" onClick={handleNo}>
						Hủy bỏ
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
