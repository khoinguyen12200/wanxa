import React from "react";
import {toast} from 'react-toastify'


import { DefaultStore } from "../../components/Const";
import styles from "../../styles/create-store.module.css";
import { onImageChange } from "../../components/Const";

export default function createStores() {
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
    function submit(){
        if(name.trim().length < 3){
            toast.error("Tên doanh nghiệp không dưới 3 ký tự")
            return;
        }
        console.log(file,name,des)
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
					<div className="mb-3">
						<label htmlFor="name">Tên doanh nghiệp</label>
						<input
							type="text"
							className="form-control"
							id="name"
							value={name}
                            onChange={e=>changeName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="des">Mô tả (Không yêu cầu)</label>
						<textarea
							style={{ minHeight: 200 }}
							className="form-control"
							id="des"
                            value={des}
                            onChange={e=>changeDes(e.target.value)}
						></textarea>
					</div>
				</div>
			</div>
			<div className={styles.buttonSpace}>
				<button onClick={submit} type="button" className="btn btn-primary btn-lg m-auto">
					Bắt đầu &rarr;
				</button>
			</div>
		</div>
	);
}
