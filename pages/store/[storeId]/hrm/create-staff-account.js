import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { confirm as Confirm } from "../../../../components/Popup";

import { PRIVILE, useConstructor } from "../../../../components/Const";
import TextField, { FileField } from "../../../../components/TextField";
import {
	passwordValidator,
	accountValidator,
	nameValidator,
} from "../../../../components/Validations";
import TextFieldStyles from "../../../../styles/TextField.module.css";
import StoreNavBar from "../../../../components/StoreNavBar";
import styles from "../../../../styles/create-staff-account.module.css";

export default function create_staff_account() {
	const [arr, setArr] = React.useState([]);
	function addObject(user) {
		setArr([...arr, user]);
	}
	React.useEffect(() => {
		console.log(arr);
	}, [arr]);
	function removeObject(id) {
		var newA = arr.concat([]);
		for (let i in newA) {
			const newId = newA[i].id;
			if (newId == id) {
				const removed = newA.splice(i, 1);
				setArr(newA);
			}
		}
	}
	function newObject() {
		var data = {
			user: {},
			saved: false,
			id: uuidv4(),
		};
		addObject(data);
	}
	function updateObject(data) {
		const { id, user, saved } = data;
		var newArr = arr.concat([]);
		for (let i in arr) {
			const arrId = newArr[i].id;
			if (arrId == id) {
				newArr[i] = data;
				setArr(newArr);
			}
		}
	}
	return (
		<div className={styles.page}>
			<StoreNavBar />
			<h3 className={styles.title}>Tạo tài khoản nhân viên</h3>
			<div className={styles.content}>
				{arr.map((object) => (
					<User
						object={object}
						key={object.id}
						updateObject={updateObject}
						removeObject={removeObject}
					/>
				))}
			</div>
			<div className={styles.mainBtnSpace}>
				<button
					type="button"
					onClick={newObject}
					className={"btn btn-outline-primary " + styles.addUser}
				>
					Thêm
				</button>
				{arr.length > 0 && (
					<button className="btn btn-primary mt-2">
						Xác nhận tạo tài khoản
					</button>
				)}
			</div>
		</div>
	);
}
var arrOfPrivileges = [];
var len = PRIVILE.length;
for (let i = 0; i < len; i++) {
	arrOfPrivileges.push({ value: i, name: PRIVILE.RightToString(i), priority:PRIVILE.getPriority(i) });
}

function User({ object, updateObject, removeObject }) {
	const { user, saved, id } = object;

	function onSubmit(values, { setSubmitting }) {
		console.log(values);
		userIsExist(values.account).then((isExisting) => {
			if (isExisting) {
				toast.error("Tài khoản này đã được sử dụng");
			} else {
				updateObject({ ...object, user: values, saved: true });
			}
		});
	}
	function rm() {
		Confirm.danger("Bạn có chắc muốn xóa ?", () => {
			removeObject(id);
		});
	}
	function edit() {
		updateObject({ ...object, saved: false });
	}
	return (
		<div
			className={
				saved ? styles.UserCard + " " + styles.saved : styles.UserCard
			}
		>
			<Formik
				initialValues={{
					name: user.name || "",
					account: user.account || "",
					password: user.password || "",
					avatar: user.avatar || "",
					privileges: user.privileges || [],
				}}
				validationSchema={Yup.object({
					name: nameValidator,
					account: accountValidator,
					password: passwordValidator,
					privileges: Yup.array().min(1, "Yêu cầu ít nhất 1 quyền"),
				})}
				onSubmit={onSubmit}
			>
				{({ values, isSubmitting, setFieldValue, errors }) => (
					<Form className={styles.Form}>
						{saved && (
							<div className={styles.editButtonSpace}>
								<button
									type="button"
									onClick={() => edit()}
									className="btn btn-warning"
								>
									Chỉnh sửa
								</button>
							</div>
						)}
						<TextField
							label="Họ tên"
							type="text"
							name="name"
							readOnly={saved}
						/>
						<TextField
							label="Tài khoản"
							type="text"
							name="account"
							readOnly={saved}
						/>
						<TextField
							label="Mật khẩu"
							type="password"
							name="password"
							readOnly={saved}
						/>
						<FileField
							label="Hình đại diện"
							hint="(Không bắt buộc)"
							name="avatar"
							onChange={(event) => {
								setFieldValue("avatar", event.target.files[0]);
							}}
							disabled={saved}
						/>
						<label className="mt-1">Quyền hạn</label>
						<div
							className={styles.privilegesContainer}
							role="group"
							aria-labelledby="checkbox-group"
						>
							{arrOfPrivileges.map(({ name, value, priority }, index) => (
								<label
									className={styles.labelPrivileges}
									key={index}
								>
									<Field
										type="checkbox"
										name="privileges"
										value={value + ""}
										disabled={saved}
									/>
									{name}
								</label>
							))}
						</div>
						{errors.privileges != null && (
							<p className={TextFieldStyles.error}>
								{errors.privileges}
							</p>
						)}

						<div className={styles.FormButtonSpace}>
							<button
								type="submit"
								className="btn btn-success"
								disabled={saved}
							>
								Lưu
							</button>
							<button
								disabled={saved}
								type="button"
								onClick={() => rm()}
								className="btn btn-danger"
							>
								Xóa
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

async function userIsExist(account) {
	var data = new FormData();
	data.append("account", account);
	const res = await axios.post("/api/user/api-check-user-exist", data);
	const result = res.data;
	if (result.length > 0) {
		return true;
	} else {
		return false;
	}
}
