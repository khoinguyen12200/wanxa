import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";

import { AccountDir,DefaultStore } from "../../components/Const";
import styles from "../../styles/create-store.module.css";
import { onImageChange } from "../../components/Const";
import {StoreContext,actions} from '../../components/StoreContext';
export default function createStores() {
	
	const {state,dispatch,reloadToken} = React.useContext(StoreContext);


	const router = useRouter();

	const fileRef = React.useRef(null);
	const [file, changeFile] = React.useState(null);
	const [name, changeName] = React.useState("");
	const [des, changeDes] = React.useState("");

	function updateImg(e) {
		onImageChange(e).then((file) => {
			changeFile(file);
			fileRef.current.value = null;
		});
	}
	function submit() {
		const {user} = state;

		if (name.trim().length < 3 && user != null) {
			toast.error("Tên doanh nghiệp không dưới 3 ký tự");
			return;
		}

		var data = new FormData();
		const logo = file != null ? file.file : null;
		data.append("logo",logo);
		data.append("name",name);
		data.append("des",des);
		data.append("userid",user.id)
		axios.post('/api/user/api-create-store', data)
			.then(res => {
				console.log(res.data);

				if (res.status === 200) {
					reloadToken();
					router.push(AccountDir);
					toast.success(res.data.message);
					
				}else{
					toast.error(res.data.message)
				}
		
			})
			.catch(err => toast.error(err));

	}
	return (
		<div className={styles.index}>
			<h1 className={styles.title}>Tạo doanh nghiệp mới</h1>
			<div className={styles.form}>
				<div className={styles.space1}>
					<img
						className={styles.logo}
						src={file ? file.src : DefaultStore}
						alt=""
					/>
					<input
						onChange={updateImg}
						type="file"
						ref={fileRef}
						style={{ display: "none" }}
					/>
					<button
						className="btn btn-secondary mt-3"
						onClick={() => {
							fileRef.current.click();
						}}
					>
						Thay đổi Logo
					</button>
				</div>
				<div className={styles.space2}>
					<input
						type="text"
						className={styles.inputName}
						placeHolder="Tên doanh nghiệp"
						style={{ fontSize: "1.2em", fontWeight: "bold" }}
						id="name"
						value={name}
						onChange={(e) => changeName(e.target.value)}
					/>
					<textarea
						className={styles.inputDes}
						placeHolder="Mô tả (Không bắt buộc)"
						id="des"
						value={des}
						onChange={(e) => changeDes(e.target.value)}
					></textarea>
				</div>
			</div>
			<div className={styles.buttonSpace}>
				<button
					onClick={submit}
					type="button"
					className="btn btn-primary btn-lg m-auto"
				>
					Bắt đầu &rarr;
				</button>
			</div>
		</div>
	);
}
