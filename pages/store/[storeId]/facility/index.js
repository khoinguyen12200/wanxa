import React from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

import { useStoreStaff, Direction } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import { CanNotAccess, Loading } from "../../../../components/Pages";
import { StoreContext } from "../../../../components/StoreContext";
import styles from "../../../../styles/facility.module.css";
import Nav from "../../../../components/MultiLevelNavbar";

export default function index() {
	const router = useRouter();
	const { storeId } = router.query;

	const { getSavedToken, getStorePrivileges, state } = React.useContext(
		StoreContext
	);
	const groups = React.useMemo(()=>{
		return state.facility;
	},[state])

	

	const [access, setAccess] = React.useState(0);
	useStoreStaff((value) => {
		if (value < 0) {
			setAccess(-1);
		} else {
			if (
				Privileges.isValueIncluded(value, [
					Privileges.Content.OWNER,
					Privileges.Content.FACILITY,
				])
			) {
				setAccess(2);
			} else {
				setAccess(1);
			}
		}
	});
	if (access == -1) {
		return <CanNotAccess />;
	}
	if (groups == undefined) {
		return <Loading />;
	}
	return (
		<div>
			<Nav />
			<h3 className={styles.title}>Cơ sở vật chất</h3>
			<div className={styles.listGroup}>
				{access == 2 && (
					<div className={styles.editSpace}>
						<Link href={Direction.FacilityEdit(storeId)}>
							<a className="btn btn-outline-primary btn-sm">
								Chỉnh sửa
							</a>
						</Link>
					</div>
				)}

				{groups.map((group) => (
					<Group group={group} key={group.id} />
				))}
				{groups.length == 0 && (
					<div className={styles.emptyList}>
						<p className="alert alert-danger">
							Danh sách trống, chọn vào chỉnh sửa để thêm
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

function Group({ group }) {
	var tables = group.tables || [];

	return (
		<div className={styles.group}>
			<div className={styles.groupName}>{group.name}</div>
			<div className={styles.listTable}>
				{tables.map((table, index) => {
					return (
						<div className={styles.table} key={table.id}>
							{table.name}
						</div>
					);
				})}
			</div>
		</div>
	);
}
