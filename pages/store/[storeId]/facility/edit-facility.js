import React from "react";
import axios from "axios";
import { RiAddBoxLine } from "react-icons/ri";
import { AiOutlineAppstoreAdd, AiOutlineClose } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Privileges from "../../../../components/Privileges";
import { CanNotAccess } from "../../../../components/Pages";
import { StoreContext } from "../../../../components/StoreContext";
import styles from "../../../../styles/edit-facility.module.css";
import NavBar from "../../../../components/MultiLevelNavbar";
import { promptDialog, alertDialog } from "../../../../components/Modal";

export default function StoreGroups() {
	const router = useRouter();
	const { storeId } = router.query;

	
	const { getSavedToken, getStorePrivileges, state ,updateFacility} = React.useContext(
		StoreContext
	);
	const groups = React.useMemo(()=>{
		return state.facility;
	},[state])

	const access = React.useMemo(() => {
		const value = getStorePrivileges(storeId);
		const pri = Privileges.isValueIncluded(value, [
			Privileges.Content.OWNER,
			Privileges.Content.FACILITY,
		]);
		return pri ? 1 : -1;
	}, [storeId, state]);

	


	const addGroup = (name) => {
		var data = new FormData();
		if (name == null) return;
		data.append("storeid", storeId);
		data.append("token", getSavedToken());
		data.append("name", name);

		axios
			.post("/api/store/group/api-add-group", data)
			.then((res) => {
				const { message } = res.data;
				if (res.status === 200) {
					updateFacility()
				} else {
					toast.error(message);
				}
			})
			.catch((error) => toast.error(error));
	};

	if (access == -1){
		return (
			<div>
				<NavBar />
				<CanNotAccess />
			</div>
		);
	}
		

	return (
		<div className={styles.storeGroup}>
			<NavBar />
			<h3 className={styles.title}>Chỉnh sửa cơ sở vật chất</h3>
			<div className={styles.content}>
				{groups.map((group) => {
					return (
						<Group group={group} key={group.id}/>
					);
				})}
				<div className={styles.addGroup}>
					<button
						className="btn btn-lg btn-secondary m-3"
						onClick={() => {
							promptDialog("Nhập tên nhóm mới", (name) => {
								addGroup(name);
							});
						}}
					>
						<AiOutlineAppstoreAdd /> Thêm nhóm mới
					</button>
				</div>
			</div>
		</div>
	);
}
function Group({ group }) {
	const { getSavedToken ,updateFacility} = React.useContext(StoreContext);

	const { tables, name, id } = group;

	function addTable(tbName) {
		const groupId = id;
		if (tbName == null) return;

		var data = new FormData();
		data.append("name", tbName);
		data.append("groupid", groupId);
		data.append("token", getSavedToken());

		axios
			.post("/api/store/table/api-add-table", data)
			.then((res) => {
				if (res.status === 200) {
					updateFacility()
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
					/>
				))}
				<div className={styles.addTable}>
					<button
						className="btn btn-outline-secondary m-3"
						onClick={() => {
							promptDialog("Nhập tên bàn hoặc số bàn", (name) => {
								addTable(name);
							});
						}}
					>
						<RiAddBoxLine /> Thêm bàn
					</button>
				</div>
			</div>
		</div>
	);
}
function GroupNameInput({  group }) {
	const [viewId, setId] = React.useState("myid" + uuidv4());
	const { getSavedToken ,updateFacility} = React.useContext(StoreContext);

	const { name, id } = group;

	const [valueName, changeValueName] = React.useState(name);
	const inputRef = React.useRef(null);

	function onDelete() {
		alertDialog("Bạn có chắc muốn xóa", () => del());

		const del = () => {
			var data = new FormData();
			// console.log("groupid",id);
			data.append("groupid", id);
			data.append("token", getSavedToken());
			axios
				.post("/api/store/group/api-delete-group", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						updateFacility();
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
				.post("/api/store/group/api-change-group-name", data)
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
			<div>
				<button
					onClick={onDelete}
					type="button"
					className="btn btn-danger"
				>
					Xóa
				</button>
			</div>
		</form>
	);
}
function Table({ table }) {


	const [viewId, setId] = React.useState(null);
	React.useEffect(() => {
		setId("id" + uuidv4());
	}, []);

	
	const [value, setValue] = React.useState(table.name);
	const { getSavedToken,updateFacility } = React.useContext(StoreContext);
	const inputRef = React.useRef(null);

	function updateName(e) {
		e.preventDefault();
		const name = value.trim();
		if (name == table.name) {
			toast.warning("Tên chưa có sự thay đổi");
			return;
		} else {
			var data = new FormData();
			data.append("token", getSavedToken());
			data.append("name", name);
			data.append("tableid", table.id);

			axios
				.post("/api/store/table/api-update-name-table", data)
				.then((res) => {
					if (res.status === 200) {
						
						updateFacility()
						toast.success(res.data.message);
						inputRef.current.blur();
					
						
					}
				})
				.catch((error) => toast.error(error));
		}
	}
	function deleteTable() {
		alertDialog("Bạn có chắc muốn xóa bàn này ?", () => doIt());
		function doIt() {
			var data = new FormData();
			data.append("token", getSavedToken());
			data.append("tableid", table.id);

			axios
				.post("/api/store/table/api-delete-table", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						updateFacility()
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
			<div className={styles.btnSpace}>
				<button
					type="button"
					onClick={deleteTable}
					className="btn btn-outline-danger btn-sm"
				>
					<AiOutlineClose />
				</button>
			</div>
		</form>
	);
}
