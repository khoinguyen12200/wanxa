import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

import { StoreContext } from "../../../../../components/StoreContext";
import Nav from "../../../../../components/MultiLevelNavbar";
import styles from "../../../../../styles/realtime-bartista.module.css";
import {
	useStoreStaff,
	Direction,
	getTimeBefore,
} from "../../../../../components/Const";
import { CanNotAccess } from "../../../../../components/Pages";
import Privileges from "../../../../../components/Privileges";

export default function barista() {
	const router = useRouter();
	const { storeId } = router.query;

	const [access, setAccess] = React.useState(-1);
	useStoreStaff((value) => {
		const allow = Privileges.isValueIncluded(value, [
			Privileges.Content.BARISTA,
			Privileges.Content.OWNER,
		]);
		if (allow) {
			setAccess(1);
		} else {
			setAccess(-1);
		}
	});

	const { state, updateBillsRealTimes } = React.useContext(StoreContext);
	const { bills } = state;

	if (access == -1) {
		return <CanNotAccess />;
	}
	return (
		<div>
			<Nav />
			<div className={styles.listContainer}>
				{bills.map((bill) => (
					<Group bill={bill} key={bill.id} />
				))}
			</div>
		</div>
	);
}

function Group({ bill }) {
	const { items } = bill;
	var interval = null;
	const [timeBefore, setTimeBefore] = React.useState("");
	React.useEffect(() => {
		updateTime();
		interval = setInterval(() => {
			updateTime();
		}, 5000);

		return clearInterval(interval);
	}, []);
	function updateTime() {
		setTimeBefore(getTimeBefore(bill.time));
	}

	return (
		<div className="card mt-2">
			<div className="card-header">
				<b>Bàn {bill.tablename}</b> - <i>{timeBefore}</i>
			</div>
			<ul className="list-group list-group-flush">
				{items.map((item) => (
					<li className={"list-group-item "} key={item.id}>
						<div className={styles.item}>
							<span className={styles.itemPic}>
								<img
									src={item.picture || Direction.DefaultMenu}
								/>
							</span>
							<span className={styles.itemName}>{item.name}</span>
							<span>
								<button className="btn btn-outline-primary btn-sm">
									Thực hiện
								</button>
							</span>
						</div>
					</li>
				))}
			</ul>
			{bill.note != "" && bill.note != null && (
				<div className="card-body">
					<b>Ghi chú</b>
					<p> {bill.note}</p>
				</div>
			)}
		</div>
	);
}
