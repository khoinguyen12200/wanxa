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

	const [groups, setGroups] = React.useState([]);
	const { getSavedToken, getStorePrivileges, state } = React.useContext(
		StoreContext
	);
	function update() {
		var data = new FormData();
		data.append("storeid", storeId);
		data.append("token", getSavedToken());
		axios
			.post("/api/store/group/store-group", data)
			.then((res) => {
				if (res.status === 200) {
					const groups = res.data.group;
					setGroups(groups);
				}
			})
			.catch((error) => console.log(error));
	}
	React.useEffect(() => {
		update();
	}, [storeId, state]);

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
			<div className={styles.listGroup}>
				{access == 2 && (
					<div className={styles.editSpace}>
						<Link href={Direction.FacilityEdit(storeId)}>
							<a className="btn btn-outline-primary btn-sm">
								Chỉnh sửa{" "}
							</a>
						</Link>
					</div>
				)}

				{groups.map((group) => (
					<Group group={group} key={group.id} />
				))}
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
