import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { BiSend } from "react-icons/bi";

import { StoreContext } from "../../../components/StoreContext";
import { DefaultStore, onImageChange } from "../../../components/Const";
import styles from "../../../styles/basic-store-info.module.css";
import NavBar from "../../../components/StoreNavBar";
export default function BasicStoreInfo() {
	const router = useRouter();
	const { storeId } = router.query;

	const { state,reloadToken,getSavedToken } = React.useContext(StoreContext);
	const [store, setStore] = React.useState(null);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const RefName = React.useRef(null);
	const RefDes = React.useRef(null);

	React.useEffect(() => {
		const name = store ? store.name : "";
		setName(name);
	}, [store]);
	React.useEffect(() => {
		const description = store ? store.description : "";
		setDescription(description);
	}, [store]);
	React.useEffect(() => {
		const user = state ? state.user : null;
		const stores = user ? user.stores : [];
		for (let i in stores) {
			const item = stores[i];
			if (item.storeid == storeId) {
				setStore(item);
			}
		}
	}, [state, router.asPath]);

	function submitUpdateName() {
		RefName.current.readOnly = true;

		var data = new FormData();
		data.append("token", getSavedToken());
		data.append("name", name);
		data.append("storeid", storeId);

		axios
			.post("/api/store/api-update-name", data)
			.then((res) => {
				const { message } = res.data;
				RefName.current.readOnly = false;
				RefName.current.blur();

				if (res.status === 200) {
					toast.success(message);
					reloadToken();
				} else {
					toast.error(message);
				}
			})
			.catch((error) => console.log(error));
	}
	function submitChangeDes() {
		var data = new FormData();
		data.append("token", getSavedToken());
		data.append("description", description);
		data.append("storeid", storeId);
		axios
			.post("/api/store/api-update-description", data)
			.then((res) => {
				RefName.current.readOnly = false;
				RefName.current.blur();
				
				const { message } = res.data;
				if (res.status === 200) {
					toast.success(message);
					reloadToken();
				} else {
					toast.error(message);
				}
			})
			.catch((error) => console.log(error));
	}
	return (
		<div className={styles.StoreInfo}>
			<NavBar />
			<div className={styles.content}>
				{store && (
					<div className={styles.card}>
						<AvatarInput store={store} key={store.logo} />
					</div>
				)}
				<label className={styles.label}>Tên doanh nghiệp</label>
				<input
					ref={RefName}
					className={styles.input}
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				{store != null && name != store.name && (
					<button
						onClick={submitUpdateName}
						className="btn btn-sm btn-outline-primary mt-2 mb-1"
					>
						Lưu thay đổi
					</button>
				)}
				<label className={styles.label}>Mô tả thêm</label>
				<textarea
					ref={RefDes}
					className={styles.input}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
					defaultValue={description}
				/>
				{store != null && description != store.description && (
					<button
						onClick={submitChangeDes}
						className="btn btn-sm btn-outline-primary mt-2 mb-1"
					>
						Lưu thay đổi
					</button>
				)}
			</div>
		</div>
	);
}

function AvatarInput({ store }) {
	const { reloadToken, getSavedToken } = React.useContext(StoreContext);
	React.useEffect(() => {
		setFileObject(null);
	}, [store]);

	const avatarRef = React.useRef(null);
	const [fileObject, setFileObject] = React.useState(null);
	function onFileChange(e) {
		onImageChange(e).then((object) => {
			setFileObject(object);
			avatarRef.current.value = null;
		});
	}
	function saveAvatarChange() {
		var data = new FormData();
		data.append("token", getSavedToken());
		data.append("storeid", store.storeid);
		data.append("logo", fileObject.file);
		axios
			.post("/api/store/api-change-logo", data)
			.then((res) => {
				const { message } = res.data;
				if (res.status === 200) {
					toast.success(message);
					reloadToken();
				} else {
					toast.error(message);
				}
			})
			.catch((error) => console.log(error));
	}
	return (
		<div className={styles.avatarSpace}>
			<img
				src={fileObject ? fileObject.src : store.logo || DefaultStore}
				className={styles.userAvatar}
			/>
			<div className={styles.avatarButtons}>
				<button
					onClick={() => avatarRef.current.click()}
					className="btn btn-info btn-sm"
				>
					Thay đổi Logo
				</button>
				{fileObject != null && (
					<button
						onClick={saveAvatarChange}
						className="btn btn-warning btn-sm ml-2"
					>
						Lưu
					</button>
				)}

				<input
					onChange={onFileChange}
					type="file"
					ref={avatarRef}
					style={{ display: "none" }}
				/>
			</div>
		</div>
	);
}
