import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { DefaultAvatar } from "../../../../components/Const";
import StoreNavBar from "../../../../components/MultiLevelNavbar";
import styles from "../../../../styles/hrm-index.module.css";

import Privileges from "../../../../components/Privileges";
import { StoreContext } from "../../../../components/StoreContext";
import { toast } from "react-toastify";
import { alertDialog, promptDialog } from "../../../../components/Modal";
import { CanNotAccess } from "../../../../components/Pages";
export default function HRM() {
	const router = useRouter();
	const { storeId } = router.query;
	const [staffs, setStaffs] = React.useState([]);

	const { state, getSavedToken, getStorePrivileges,updateStaff } = React.useContext(
		StoreContext
	);

	const access = React.useMemo(() => {
		const privileges = getStorePrivileges(storeId);
		if (privileges < 0) {
			return -1;
		} else {
			if (
				Privileges.isValueIncluded(privileges, [
					Privileges.Content.OWNER,
					Privileges.Content.HRM,
				])
			) {
				return 2;
			} else {
				return 1;
			}
		}
	}, [storeId, state]);

	React.useEffect(() => {
		var staffs = state.staff;
		staffs.sort((a, b) => {
			return (
				Privileges.getSumPriority(b.privilege) -
				Privileges.getSumPriority(a.privilege)
			);
		});
		setStaffs(staffs);
	}, [state]);

	const [chosen, setChosen] = React.useState(null);
	const clearChosen = () => setChosen(null);

	function openModalForHRM(staff) {
		if (access == 2) {
			setChosen(staff);
		}
	}
	function inviteToStore() {
		promptDialog("Nhập Id đối tượng được mời", (value) => {
			const str = value.replace("#", "").trim();
			const desId = parseInt(str);
			if (desId == undefined || isNaN(desId)) {
				toast.warning("Id phải là số");
				return;
			}
			invite(desId);
		});
		function invite(id) {
			const data = {
				token: getSavedToken(),
				destination: id,
				storeid: storeId,
			};
			axios
				.post("/api/store/staff/send-invite", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						updateStaff()
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		}
	}

	if (access == -1) {
		return <CanNotAccess />;
	}

	return (
		<div className={styles.hrm_index}>
			<StoreNavBar />
			<ModalExample
				toggle={clearChosen}
				chosen={chosen}
				onSubmitSuccess={updateStaff}
			/>
			<h3 className={styles.title}>Quản lý nhân sự</h3>
			<div className={styles.staff_container}>
				<table className="table">
					<thead>
						<tr>
							<th scope="col">STT</th>
							<th scope="col">Hình đại diện</th>
							<th scope="col">Thông tin</th>
							<th scope="col">Quyền hạn</th>
						</tr>
					</thead>
					<tbody>
						{staffs.map((staff, index) => {
							var arrPiv = Privileges.valueToArray(
								staff.privilege
							);
							arrPiv = arrPiv.map((value) =>
								Privileges.ValueToString(value)
							);
							return (
								<tr
									key={staff.id}
									onClick={() => openModalForHRM(staff)}
									className={styles.tableRow}
								>
									<th scope="row">{index + 1}</th>
									<td>
										<img
											src={staff.avatar || DefaultAvatar}
											className={styles.staff_avatar}
										/>
									</td>
									<td>
										<div className={styles.staff_info}>
											<p className={styles.staff_name}>
												{staff.name}
											</p>
											<p className={styles.staff_des}>
												{staff.description}
											</p>
										</div>
									</td>
									<td>
										{arrPiv.map((privilege, index) =>
											index == arrPiv.length - 1
												? privilege
												: privilege + ", "
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{access == 2 && (
				<>
					<Link href={`/store/${storeId}/hrm/create-staff-account`}>
						<a className="btn btn-primary m-auto">
							Tạo tài khoản nhân viên
						</a>
					</Link>
					<button
						className="btn btn-outline-primary btn-sm mt-3 ml-auto mr-auto"
						onClick={inviteToStore}
					>
						Mời gia nhập doanh nghiệp
					</button>
				</>
			)}
		</div>
	);
}

const ModalExample = ({ toggle, chosen, onSubmitSuccess }) => {
	const [user, setUser] = React.useState({});
	React.useEffect(() => {
		if (chosen == null) {
			setUser({});
		} else {
			setUser(chosen);
		}
	}, [chosen]);

	const router = useRouter();
	const { storeId } = router.query;

	const { getSavedToken, reloadToken } = React.useContext(StoreContext);

	const value = chosen ? chosen.privilege : null;
	const privilegesArray = Privileges.valueToArray(value);

	const [valueArray, setValueArray] = React.useState([]);

	React.useEffect(() => {
		var newArr = [];
		for (let i = 0; i < Privileges.length; i++) {
			const value = privilegesArray.includes(i);
			newArr.push(value);
		}
		setValueArray(newArr);
	}, [chosen]);

	function setCheckedValue(checked, index) {
		var newArr = valueArray.concat([]);
		newArr[index] = checked;
		setValueArray(newArr);
	}
	function onSubmit() {
		var arr = [];
		for (let i in valueArray) {
			if (valueArray[i]) {
				arr.push(i);
			}
		}
		const value = Privileges.arrToValue(arr);

		var str = "";
		for (let i in arr) {
			str += Privileges.ValueToString(parseInt(arr[i]));
			if (i != arr.length - 1) {
				str += ", ";
			}
		}
		alertDialog(
			`Cập nhật quyền nhân viên ${user.name} thành \n${str}`,
			() => {
				run();
			}
		);
		function run() {
			const data = {
				staffid: chosen.id,
				staffPrivileges: value,
			};

			axios
				.post("/api/store/staff/change-staff-privileges", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						reloadToken();
						onSubmitSuccess();
					} else {
						toast.error(message);
					}
					toggle();
				})
				.catch((error) => toast.error(error));
		}
	}
	function onDelete() {
		alertDialog("Bạn có chắc muốn xóa nhân viên này ?", () => {
			run();
		});

		function run() {
			const data = {
				staffid: chosen.id,
			};

			axios
				.post("/api/store/staff/remove-staff", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						reloadToken();
						onSubmitSuccess();
					} else {
						toast.error(message);
					}
					toggle();
				})
				.catch((error) => toast.error(error));
		}
	}
	return (
		<div>
			<Modal
				isOpen={chosen != null && chosen != {}}
				toggle={toggle}
				centered
			>
				<ModalHeader toggle={toggle}>
					Thay đổi quyền nhân viên của {user.name}
				</ModalHeader>
				<ModalBody>
					<div className={styles.modal_frame}>
						{valueArray.map((value, index) => {
							return (
								<div
									className="p-1"
									key={(value, index)}
									className={styles.modalRow}
								>
									<div className="custom-control custom-checkbox">
										<input
											type="checkbox"
											className="custom-control-input"
											id={`checkboxcustom${index}`}
											checked={value}
											onChange={(e) =>
												setCheckedValue(
													e.target.checked,
													index
												)
											}
										/>
										<label
											className="custom-control-label"
											htmlFor={`checkboxcustom${index}`}
										>
											{Privileges.ValueToString(index)}
										</label>
									</div>
								</div>
							);
						})}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={onDelete}>
						Xóa bỏ nhân viên này
					</Button>

					<Button color="primary" onClick={onSubmit}>
						Lưu lại
					</Button>

					<Button color="secondary" onClick={toggle}>
						Hủy bỏ
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
