import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import {
	DefaultAvatar,
	quickCheckPrivileges,
} from "../../../../components/Const";
import StoreNavBar from "../../../../components/StoreNavBar";
import styles from "../../../../styles/hrm-index.module.css";
import { PRIVILE } from "../../../../components/Const";
import { StoreContext } from "../../../../components/StoreContext";
import { toast } from "react-toastify";

export default function HRM() {
	const router = useRouter();
	const { storeId } = router.query;
	const [staffs, setStaffs] = React.useState([]);
	const { state } = React.useContext(StoreContext);
	const { user } = state;

	const [userPrivileges, setUserPrivileges] = React.useState([]);

	React.useEffect(() => {
		const usP = quickCheckPrivileges(state, router);
		setUserPrivileges(usP);
	}, [state, router]);

	React.useEffect(() => {
		getAllData();
	}, [storeId]);

	function getAllData() {
		var data = new FormData();
		data.append("storeid", storeId);
		axios
			.post("/api/store/staff/api-get-staff", data)
			.then((res) => {
				if (res.status === 200) {
					var staffs = res.data;
					staffs.sort((a, b) => {
						return (
							PRIVILE.getSumPriority(b.privilege) -
							PRIVILE.getSumPriority(a.privilege)
						);
					});
					setStaffs(res.data);
				}
			})
			.catch((error) => console.log(error));
	}

	const [chosen, setChosen] = React.useState(null);
	const clearChosen = () => setChosen(null);

	function openModalForHRM(staff) {
		if (
			userPrivileges.includes(PRIVILE.OWNER) ||
			userPrivileges.includes(PRIVILE.HRM)
		) {
			setChosen(staff);
		}
	}

	return (
		<div className={styles.hrm_index}>
			<StoreNavBar />
			<ModalExample
				toggle={clearChosen}
				chosen={chosen}
				onSubmitSuccess={getAllData}
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
							var arrPiv = PRIVILE.getUserRights(staff.privilege);
							arrPiv = arrPiv.map((value) =>
								PRIVILE.RightToString(value)
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
			{(userPrivileges.includes(PRIVILE.OWNER) ||
				userPrivileges.includes(PRIVILE.HRM)) && (
				<Link href={`/store/${storeId}/hrm/create-staff-account`}>
					<a className="btn btn-primary m-auto">
						Tạo tài khoản nhân viên
					</a>
				</Link>
			)}
		</div>
	);
}

const ModalExample = ({ toggle, chosen, onSubmitSuccess }) => {
	const router = useRouter();
	const { storeId } = router.query;

	const { getSavedToken, reloadToken } = React.useContext(StoreContext);

	const privileges = chosen ? chosen.privilege : null;
	const privilegesArray = PRIVILE.getUserRights(privileges);

	const [valueArray, setValueArray] = React.useState([]);

	React.useEffect(() => {
		var newArr = [];
		for (let i = 0; i < PRIVILE.length; i++) {
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
		const value = PRIVILE.getRightsValue(arr);

		const data = {
			userid: chosen.id,
			privileges: value,
			token: getSavedToken(),
			storeid: storeId,
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
	return (
		<div>
			<Modal isOpen={chosen != null} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					Thay đổi quyền nhân viên
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
											{PRIVILE.RightToString(index)}
										</label>
									</div>
								</div>
							);
						})}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={toggle}>
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
