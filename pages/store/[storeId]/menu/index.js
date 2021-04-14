import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../../../styles/menu.module.css";
import Nav from "../../../../components/MultiLevelNavbar";
import { Direction, useStoreStaff } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import { CanNotAccess } from "../../../../components/Pages";
export default function index() {
	const router = useRouter();
	const { storeId } = router.query;

	const [access,setAccess] = React.useState(-1);
    useStoreStaff((value) => {
		const isMenuManager = Privileges.isValueIncluded(value, [
			Privileges.Content.OWNER,
			Privileges.Content.Menu,
		]);
		if (value >= 0) {
			if (isMenuManager) {
				setAccess(2)
			} else setAccess(1)
		} else {
			return setAccess(-1)
		}
	});

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
				</div>
			</div>
		</div>
	);
}
