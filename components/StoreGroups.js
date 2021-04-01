import React from "react";
import axios from "axios";
import { RiAddBoxLine } from "react-icons/ri";
import { AiOutlineAppstoreAdd, AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";

import { StoreContext } from "./StoreContext";
import styles from "./styles/store-group.module.css";
import { confirm } from "./Popup";

export default function StoreGroups({ storeid }) {
	const [groups, setGroups] = React.useState([]);
	const { getSavedToken } = React.useContext(StoreContext);

	React.useEffect(() => {
		update();
	}, [storeid]);

	function update() {
		var data = new FormData();
		data.append("storeid", storeid);
		data.append("token", getSavedToken());
		axios
			.post("/api/store/store-group", data)
			.then((res) => {
				if (res.status === 200) {
					const groups = res.data.group;
					setGroups(groups);
				}
			})
			.catch((error) => console.log(error));
	}

	const addGroup = (name) => {
		var data = new FormData();
		if (name == null) return;
		data.append("storeid", storeid);
		data.append("token", getSavedToken());
		data.append("name", name);

		axios
			.post("/api/store/api-add-group", data)
			.then((res) => {
				const { message } = res.data;
				if (res.status === 200) {
					update();
				} else {
					toast.error(message);
				}
			})
			.catch((error) => toast.error(error));
	};

	return (
		<div className={styles.storeGroup}>
			{groups.map((group) => {
				return <Group group={group} key={group.id} onUpdate={update} />;
			})}
			<div className={styles.addGroup}>
				<button
					className="btn btn-lg btn-secondary m-3"
					onClick={() => {
						let name = prompt("Nhập tên nhóm");
						addGroup(name);
					}}
				>
					<AiOutlineAppstoreAdd /> Thêm nhóm mới
				</button>
			</div>
		</div>
	);
}
function Group({ group, onUpdate }) {
	const { getSavedToken } = React.useContext(StoreContext);

	const { tables, name, id } = group;

	function addTable(tbName) {
		const groupId = id;
		if (tbName == null) return;

		var data = new FormData();
		data.append("name", tbName);
		data.append("groupid", groupId);
		data.append("token", getSavedToken());

		axios
			.post("/api/store/addTable", data)
			.then((res) => {
				if (res.status === 200) {
					onUpdate();
				}
			})
			.catch((error) => console.log(error));
	}

	return (
		<div className={styles.groupTable}>
			<GroupNameInput group={group} onUpdate={() => onUpdate()} />
			<div className={styles.groupTableContent}>
				{tables.map((table) => (
					<Table
						table={table}
						key={table.id}
						onUpdate={() => onUpdate()}
					/>
				))}
				<div className={styles.addTable}>
					<button
						className="btn btn-outline-secondary m-3"
						onClick={() => {
							let name = prompt("Nhập tên bàn (Số bàn)");
							addTable(name);
						}}
					>
						<RiAddBoxLine /> Thêm bàn
					</button>
				</div>
			</div>
		</div>
	);
}
function GroupNameInput({ onUpdate, group }) {
	const [viewId, setId] = React.useState("myid" + uuidv4());
	const { getSavedToken } = React.useContext(StoreContext);

	const { name, id } = group;

	const [valueName, changeValueName] = React.useState(name);
	const inputRef = React.useRef(null);

	function onDelete() {
		confirm.danger("Bạn có chắc muốn xóa", () => del());
		const del = () => {
			var data = new FormData();
			// console.log("groupid",id);
			data.append("groupid", id);
			data.append("token", getSavedToken());
			axios
				.post("/api/store/api-delete-group", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						onUpdate();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => toast.error(error));
		};
	}
	function submitChangeName(e) {
		e.preventDefault();
		inputRef.current.blur();
		const value = valueName ? valueName.trim() : "";
		if (value == name) {
			toast.warning("Không tìm thấy sự thay đổi của tên");
		} else {
			var data = new FormData();
			data.append("newName", value);
			data.append("groupid", id);
			data.append("token", getSavedToken());
			axios
				.post("/api/store/api-change-group-name", data)
				.then((res) => {
					const { message } = res.data;

					if (res.status === 200) {
						onUpdate();
						toast.success(message);
					} else {
						toast.error(message);
					}
				})
				.catch((error) => toast.error(error));
		}
	}
	return (
		<form onSubmit={submitChangeName} className={styles.groupTableTitle}>
			{viewId != null && (
				<>
					<input
						type="text"
						id={viewId}
						value={valueName}
						ref={inputRef}
						onChange={(e) => changeValueName(e.target.value)}
					/>
					<UncontrolledTooltip trigger="focus" target={viewId}>
						Enter để lưu thay đổi
					</UncontrolledTooltip>
				</>
			)}
			<button onClick={onDelete} type="button" className="btn btn-danger">
				Xóa
			</button>
		</form>
	);
}
function Table({ table, onUpdate }) {
	const [viewId, setId] = React.useState(null);
	React.useEffect(() => {
		setId("id" + uuidv4());
	}, []);

	const [oldValue, setOldValue] = React.useState(table.name);
	const [value, setValue] = React.useState(table.name);
	const { getSavedToken } = React.useContext(StoreContext);
	const inputRef = React.useRef(null);

	function updateName(e) {
		e.preventDefault();
		const name = value.trim();
		if (name == oldValue) {
			toast.warning("Tên chưa có sự thay đổi");
			return;
		} else {
			var data = new FormData();
			data.append("token", getSavedToken());
			data.append("name", name);
			data.append("tableid", table.id);

			axios
				.post("/api/store/api-update-name-table", data)
				.then((res) => {
					if (res.status === 200) {
						toast.success(res.data.message);
						inputRef.current.blur();
						setOldValue(value);
					}
				})
				.catch((error) => toast.error(error));
		}
	}
	function deleteTable() {
		confirm.danger("Bạn có chắc muốn xóa bàn này ?", () => didIt());
		function didIt() {
			var data = new FormData();
			data.append("token", getSavedToken());
			data.append("tableid", table.id);

			axios
				.post("/api/store/api-delete-table", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						onUpdate();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => {
					toast.error(error);
				});
		}
	}
	return (
		<form onSubmit={updateName} className={styles.tableItem}>
			{viewId != null && (
				<>
					<input
						id={viewId}
						type="text"
						value={value}
						ref={inputRef}
						onChange={(e) => setValue(e.target.value)}
					/>
					<UncontrolledTooltip trigger="focus" target={viewId}>
						Enter để lưu thay đổi
					</UncontrolledTooltip>
				</>
			)}

			<button
				type="button"
				onClick={deleteTable}
				className="btn btn-outline-danger btn-sm"
			>
				<AiOutlineClose />
			</button>
		</form>
	);
}
