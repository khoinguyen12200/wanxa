import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { StoreContext } from "../components/StoreContext";
import { DefaultStore, onImageChange } from "../components/Const";

import styles from "./styles/basic-store-info.module.css";

export default function BasicStoreInfo({ storeid }) {
	const { state } = React.useContext(StoreContext);
	const [store, setStore] = React.useState(null);
	React.useEffect(() => {
		const user = state ? state.user : null;
		const stores = user ? user.stores : [];
		for (let i in stores) {
			const store = stores[i];
			if (store.storeid == storeid) {
				setStore(store);
                console.log("fire")
			}
		}
	}, [state]);

	return (
		<div className={styles.StoreInfo}>
			{store && (
				<div className={styles.card}>
					<AvatarInput store={store} />
				</div>
			)}
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
