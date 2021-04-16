import React from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

import styles from "../../../../styles/menu.module.css";
import Nav from "../../../../components/MultiLevelNavbar";
import { Direction, useStoreStaff } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import { CanNotAccess } from "../../../../components/Pages";
export default function index() {
	const router = useRouter();
	const { storeId } = router.query;

	const [access, setAccess] = React.useState(-1);
	useStoreStaff((value) => {
		const isMenuManager = Privileges.isValueIncluded(value, [
			Privileges.Content.OWNER,
			Privileges.Content.Menu,
		]);
		if (value >= 0) {
			if (isMenuManager) {
				setAccess(2);
			} else setAccess(1);
		} else {
			return setAccess(-1);
		}
	});

	const [groups, setGroups] = React.useState([]);

	React.useEffect(() => {
		fetchData();
	}, [storeId]);
	function fetchData() {
		if (storeId == null) return;
		const data = {
			storeid: storeId,
		};
		axios
			.post("/api/store/menu/api-get-group", data)
			.then((res) => {
				if (res.status === 200) {
					setGroups(res.data);
				}
			})
			.catch((error) => console.log(error));
	}

	if (access == -1) return <CanNotAccess />;

	return (
		<div className={styles.page}>
			<Nav />
			<div className={styles.content}>
				<h3 className={styles.title}>Thực đơn</h3>
				<div className={styles.list}>
					{access == 2 && (
						<div className={styles.editSpace}>
							<Link href={Direction.MenuEdit(storeId)}>
								<a className="btn btn-outline-primary">
									Chỉnh sửa{" "}
								</a>
							</Link>
						</div>
					)}
					{groups.map((group, i) => (
						<Group group={group} key={group.id} />
					))}
					{
						groups.length == 0 && (
							<div className={styles.emptyList}>
								<p className="alert alert-danger">Danh sách trống, chọn vào phần chỉnh sửa để thêm vào menu</p>
							</div>
						)
					}
				</div>
			</div>
		</div>
	);
}

function Group({ group }) {
	const { items } = group;
	return (
		<div className={styles.group}>
			<div className={styles.groupName}>{group.name}</div>
			<div className={styles.groupList}>
				{items.map((item, i) => (
					<div className={styles.groupItem} key={item.id}>
						<div className={styles.itemS1}>
							<img src={item.picture || Direction.DefaultMenu} />
						</div>
						<div className={styles.itemS2}>
							<input
								className="form-control"
								value={item.name}
								readOnly
							/>
							<textarea className="form-control" readOnly defaultValue={item.des} readOnly/>
							<input
								className="form-control"
								type="number"
								value={item.price}
								readOnly
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
