import React from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "../../components/TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
	CreateStore,
	DefaultStore,
	StoreDir,
	onImageChange,
	ChangePasswordDir,
} from "../../components/Const";
import { StoreContext, actions } from "../../components/StoreContext";
import Selector from "../../components/Selector";
import styles from "../../styles/account.module.css";
import { nameValidator } from "../../components/Validations";
import { DefaultAvatar } from "../../components/Const";
import proStyles from "../../styles/profile.module.css";

export default function index() {
	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	if (user != null) {
		return <AccountCenter user={user} />;
	} else {
		return <NotFound />;
	}
}
function NotFound() {
	return (
		<div className={styles.accountMain}>
			<div className={styles.notFound}>
				<div className={styles.message}>
					You cannot access this page until sign in
				</div>
			</div>
		</div>
	);
}

function AccountCenter({ user }) {
	const [tab, setTab] = React.useState(1);

	return (
		<div className={styles.accountMain}>
			<div className={styles.layout}>
				<div className={styles.directionTable}>
					<Selector
						backColor="#ccc"
						options={[
							{ title: "Doanh nghiệp", value: 0 },
							{ title: "Cá nhân", value: 1 },
						]}
						defaultValue={tab}
						onChange={setTab}
					/>
				</div>

				<div className={styles.accountContent}>
					{tab == 0 && <Stores user={user} />}
					{tab == 1 && <Profile />}
				</div>
			</div>
		</div>
	);
}

function Stores({ user }) {
	var { stores } = user;
	return (
		<div className={styles.stores}>
			{stores.length == 0 && <NoStore />}
			{stores.map((store, index) => {
				return <Store key={index} store={store} />;
			})}

			<Link href={CreateStore}>
				<a className={styles.storeCard + " " + styles.addNew}>
					<AiOutlineAppstoreAdd className={styles.NSicon} />
					<h4>Tạo một doanh nghiệp mới</h4>
				</a>
			</Link>
		</div>
	);
}
function Store({ store }) {
	const { storeid, name, logo, description } = store;
	return (
		<Link href={StoreDir + "/" + storeid}>
			<a className={styles.storeCard}>
				<img src={logo || DefaultStore} className={styles.storeLogo} />
				<div className={styles.storeInfo}>
					<h4 className={styles.storeName}>{name}</h4>
					<p className={styles.storeDescription}>{description}</p>
				</div>
			</a>
		</Link>
	);
}

function Profile() {
	const { state, dispatch, reloadToken, getSavedToken } = React.useContext(
		StoreContext
	);
	const { user } = state;

	const [description, setDescription] = React.useState(user.description);

	function submitChangeDes() {
		var data = {description:description}

		axios
			.post("/api/user/api-change-description", data)
			.then((res) => {
				const { message } = res.data;
				if (res.status === 200) {
					reloadToken();
					toast.success(message);
				}
			})
			.catch((error) => console.log(error));
	}

	function submitChangeName(values, { setSubmitting }) {
		const { name } = values;
		var data = {name:name}
		axios
			.post("/api/user/api-change-name", data)
			.then((res) => {
				const { message } = res.data;
				if (res.status === 200) {
					toast.success(message);
					reloadToken();
					var x = document.activeElement;
					x.blur();
					return;
				}
				toast.error(message);
			})
			.catch((error) => console.log(error));
	}

	return (
		<div className={proStyles.profilePage}>
			<div className={proStyles.mainForm}>
				<h3 className={proStyles.title}>Thông tin cá nhân</h3>
				<AvatarInput
					defaultAvatar={user ? user.avatar : DefaultAvatar}
				/>

				<label className="mt-2" style={{ fontSize: "0.9em" }}>
					Id người dùng
				</label>
				<input type="text" value={"#"+user.id} className="form-control mb-3" readOnly/>

				<Formik
					initialValues={{ name: user.name }}
					validationSchema={Yup.object({
						name: nameValidator,
					})}
					onSubmit={submitChangeName}
				>
					{({ values }) => {
						return (
							<Form>
								<TextField
									label="Họ tên"
									type="text"
									name="name"
								/>
								{values.name != user.name && (
									<button
										type="submit"
										className="btn btn-sm btn-outline-primary mb-1 w-100"
									>
										Lưu lại
									</button>
								)}
							</Form>
						);
					}}
				</Formik>
				<label className="mt-2" style={{ fontSize: "0.9em" }}>
					Mô tả thêm
				</label>
				<textarea
					className={proStyles.description + " p-2"}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
					defaultValue={description}
				/>
				{description != user.description && (
					<button
						onClick={submitChangeDes}
						className="btn btn-sm btn-outline-primary mt-2 mb-1"
					>
						Lưu lại
					</button>
				)}

				<Link href={ChangePasswordDir}>
					<a className="btn btn-sm btn-info mt-4">Đổi mật khẩu</a>
				</Link>
			</div>
			<button
				onClick={() => dispatch({ type: actions.signOut })}
				className="btn btn-danger btn-sm m-auto"
			>
				Đăng xuất
			</button>
		</div>
	);
}

function AvatarInput({ defaultAvatar }) {
	const { reloadToken, getSavedToken } = React.useContext(StoreContext);

	React.useEffect(() => {
		setFileObject(null);
	}, [defaultAvatar]);

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
		data.append("avatar", fileObject.file);
		axios
			.post("/api/user/api-change-avatar", data)
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
		<div className={proStyles.avatarSpace}>
			<img
				src={fileObject ? fileObject.src : defaultAvatar}
				className={proStyles.userAvatar}
			/>
			<div className={proStyles.avatarButtons}>
				<button
					onClick={() => avatarRef.current.click()}
					className="btn btn-info btn-sm"
				>
					Thay đổi
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
