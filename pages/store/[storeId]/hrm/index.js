import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";


import StoreNavBar from "../../../../components/StoreNavBar";
import styles from "../../../../styles/hrm-index.module.css";
import { PRIVILE } from "../../../../components/Const";

export default function HRM() {
	const router = useRouter();
	const { storeId } = router.query;
	const [staffs, setStaffs] = React.useState([]);
	React.useEffect(() => {
		var data = new FormData();
		data.append("storeid", storeId);
		axios
			.post("/api/store/staff/api-get-staff", data)
			.then((res) => {
				if (res.status === 200) {
					var staffs = res.data;
					staffs.sort((a, b) => {
						return (
							PRIVILE.getSumPriority(a) -
							PRIVILE.getSumPriority(b)
						);
					});
					setStaffs(res.data);
				}
			})
			.catch((error) => console.log(error));
	}, [storeId]);
	return (
		<div className={styles.hrm_index}>
			<StoreNavBar />
			<h3 className={styles.title}>Quản lý nhân sự</h3>
			<div className={styles.staff_container}>
				<table className="table">
					<thead>
						<tr>
							<th scope="col">STT</th>
							<th scope="col">Hình</th>
							<th scope="col">Thông tin</th>
							<th scope="col">Chức vụ</th>
						</tr>
					</thead>
					<tbody>
						{staffs.map((staff, index) => {
							var arrPiv = PRIVILE.getUserRights(staff.privilege);
							arrPiv = arrPiv.map((value) =>
								PRIVILE.RightToString(value)
							);
							return (
								<tr key={staff.id}>
									<th scope="row">{index + 1}</th>
									<td>
										<img
											src={staff.avatar}
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
			<Link href={`/store/${storeId}/hrm/create-staff-account`}>
				<a className="btn btn-primary m-auto">Tạo tài khoản nhân viên</a>
			</Link>
		</div>
	);
}
