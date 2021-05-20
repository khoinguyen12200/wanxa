import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import TextField, { FileField } from "../../../../components/TextField";
import {
	passwordValidator,
	accountValidator,
	nameValidator,
} from "../../../../components/Validations";
import TextFieldStyles from "../../../../styles/TextField.module.css";
import StoreNavBar from "../../../../components/MultiLevelNavbar";
import styles from "../../../../styles/create-staff-account.module.css";
import { StoreContext } from "../../../../components/StoreContext";
import { alertDialog } from "../../../../components/Modal";
import { useStoreStaff } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import {CanNotAccess} from "../../../../components/Pages";
export default function create_staff_account() {
	const router = useRouter();
	const { storeId } = router.query;
	const { state, getSavedToken } = React.useContext(StoreContext);

	const [access, setAccess] = React.useState(0);
	useStoreStaff((value) => {
		console.log(value);
		const hasRights = Privileges.isValueIncluded(value, [
			Privileges.Content.OWNER,
			Privileges.Content.HRM,
		]);
		const aces = hasRights ? 1 : -1;
		setAccess(aces);
	});

	const [arr, setArr] = React.useState([]);
	const [failed, setFailed] = React.useState(null);

	React.useEffect(() => {
		newObject();
	}, []);

	function addObject(user) {
		setArr([...arr, user]);
	}

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
	function handleSubmit() {
		var formdata = new FormData();
		var userjson = [];
		for (let i in arr) {
			const data = arr[i];
			if (!data.saved) {
				toast.error("Cần phải lưu tất cả thông tin trước khi gửi đi");
				return;
			}
			const path = data.user.account + "-avatar";
			const newUser = {
				account: data.user.account,
				password: data.user.password,
				name: data.user.name,
				privileges: Privileges.arrToValue(data.user.privileges),
				path: path,
			};

			userjson.push(newUser);

			formdata.append(path, data.user.avatar);
		}

		formdata.append("user", JSON.stringify(userjson));

		axios
			.post("/api/store/staff/create-staff-profile", formdata, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				const { failed, message } = res.data;

				if (res.status === 200) {
					setFailed(failed);
					if (failed.length > 0) {
						toast.error(
							`Có ${failed.length} tài khoản tạo không thành công`
						);
					} else {
						toast.success("Tạo thành công !");
					}
				} else {
					toast.warning(message);
				}
			})
			.catch((error) => console.log(error));
	}

	if (access == -1) {
		return (
			<div>
				<StoreNavBar />
				<CanNotAccess />
			</div>
		);
	}

	if (failed == null) {
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
						<button
							onClick={handleSubmit}
							className="btn btn-primary mt-2"
						>
							Xác nhận tạo tài khoản
						</button>
					)}
				</div>
			</div>
		);
	} else {
		return <AfterSubmit arr={arr} failed={failed} />;
	}
}

function AfterSubmit({ arr, failed }) {
	var failedArr = failed.map((str) => parseInt(str));
	return (
		<div className={styles.AfterSubmit}>
			<StoreNavBar />
			<div className="p-5 m-3 bg-danger text-white">
				Chú ý !!!
				<br />
				Đây là (các) tài khoản được tạo tự động, mật khẩu sẽ hiện lên
				màn hình
				<br />
				Hãy yêu cầu các chủ nhân của tài khoản đổi mật khẩu ngay khi
				đăng nhập.
				<br />
			</div>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">STT</th>
						<th scope="col">Tên</th>
						<th scope="col">Tài khoản</th>
						<th scope="col">Mật khẩu</th>
						<th scope="col">Trạng thái tạo</th>
					</tr>
				</thead>
				<tbody>
					{arr.map((item, index) => {
						const { user } = item;
						return (
							<tr key={item.id}>
								<th scope="row">{index + 1}</th>
								<td>{user.name}</td>
								<td>{user.account}</td>
								<td>{user.password}</td>
								<td>
									<div
										className={
											failedArr.includes(index)
												? styles.failed
												: styles.success
										}
									>
										{failedArr.includes(index)
											? "Thất bại"
											: "Thành công"}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
var arrOfPrivileges = [];
var len = Privileges.length;
for (let i = 0; i < len; i++) {
	arrOfPrivileges.push({
		value: i,
		name: Privileges.ValueToString(i),
		priority: Privileges.getPriority(i),
	});
}

function User({ object, updateObject, removeObject }) {
	const { user, saved, id } = object;

	function onSubmit(values, { setSubmitting }) {
		userIsExist(values.account).then((isExisting) => {
			if (isExisting) {
				toast.error("Tài khoản này đã được sử dụng");
			} else {
				updateObject({ ...object, user: values, saved: true });
			}
		});
	}
	function rm() {
		alertDialog("Bạn có chắc muốn xóa hồ sơ này ?", () => {
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
							{arrOfPrivileges.map(
								({ name, value, priority }, index) => (
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
								)
							)}
						</div>

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
	var data = {
		account: account,
	}
	const res = await axios.post("/api/user/api-check-user-exist", data);
	const result = res.data;
	if (result.length > 0) {
		return true;
	} else {
		return false;
	}
}
