import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { RiAddBoxLine } from "react-icons/ri";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";

import { StoreContext } from "../../../components/StoreContext";
import styles from "../../../styles/main-store.module.css";
import {softConfirm,confirm} from "../../../components/Popup";

export default function index() {
	const router = useRouter();
	const { id } = router.query;
	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	const stores = user ? user.stores : [];
	const storesId = stores.map((store) => store.storeid);

	if (storesId.includes(parseInt(id))) {
		return <AcceptAccessStore storeid={id} />;
	} else {
		return <RejectAccessStore />;
	}
}
function AcceptAccessStore({ storeid }) {
	return (
		<div className={styles.Accept}>
			<StoreGroup storeid={storeid} />
		</div>
	);
}

function StoreGroup({ storeid }) {
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
					const { group } = res.data;
					setGroups(group);
				}
			})
			.catch((error) => console.log(error));
	}

	const addGroup = (name) => {
		var data = new FormData();
		if(name == null) return;
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
			{groups.map((group, index) => {
				return <Group group={group} key={index} onUpdate={update} />;
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

	function submitChangeName(e, valueName) {
		e.preventDefault();

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
			<GroupNameInput name={name} submit={submitChangeName} />
			<div className={styles.groupTableContent}>
				{tables.map((table, index) => (
					<div className={styles.tableItem} key={index}>
						{table.name}
					</div>
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
function GroupNameInput({ name, submit }) {
	const [id, setId] = React.useState(null);
	React.useEffect(() => {
		setId("id" + uuidv4());
	}, []);
	const [valueName, changeValueName] = React.useState(name);
	const inputRef = React.useRef(null);

	function onDelete(){
		confirm.danger("Bạn có chắc muốn xóa",()=>del())
		const  del = () =>{
			console.log("this is delete")
		}
	}
	return (
		<form
			onSubmit={(e) => {
				inputRef.current.blur(), submit(e, valueName);
			}}
			className={styles.groupTableTitle}
		>
			{id != null && (
				<>
					<input
						type="text"
						id={id}
						value={valueName}
						ref={inputRef}
						onChange={(e) => changeValueName(e.target.value)}
					/>
					<UncontrolledTooltip trigger="focus" target={id}>
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
function RejectAccessStore() {
	return (
		<div className={styles.rejectPage}>
			<div className={styles.rejectBanner}>
				<h3>Bạn không có quyền truy cập vào cửa hàng này</h3>
			</div>
		</div>
	);
}
