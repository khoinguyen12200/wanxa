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
	socketUpdateBills,
} from "../../../../../components/Const";
import { CanNotAccess } from "../../../../../components/Pages";
import Privileges from "../../../../../components/Privileges";
import { alertDialog } from "../../../../../components/Modal";

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

	const { state } = React.useContext(StoreContext);
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
				{bills.length == 0 && (
					<div
						className={
							styles.noItem + " d-flex p-2 justify-content-center"
						}
					>
						<div className="alert alert-secondary" role="alert">
							Danh sách trống !
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function Group({ bill }) {
	const { state } = React.useContext(StoreContext);

	const facilites = React.useMemo(() => {
		var arr = [];
		const groups = state ? state.facility : [];
		for (let i in groups) {
			const group = groups[i];
			for (let j in group.tables) {
				const table = group.tables[j];
				arr.push(table);
			}
		}
		return arr;
	}, [state]);
	function tableName(id) {
		for (let i in facilites) {
			const table = facilites[i];
			if (table.id == id) {
				return table.name;
			}
		}
		return "";
	}

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
				<b>Bàn {tableName(bill.tableid)}</b> - <i>{timeBefore}</i>
			</div>
			<ul className="list-group list-group-flush">
				{items.map((item) => (
					<Item item={item} key={item.id} />
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

function Item({ item }) {
	const [loading, setLoading] = React.useState(false);

	const { getSavedToken, state, requestUpdateBills } = React.useContext(
		StoreContext
	);
	const router = useRouter();
	const { storeId } = router.query;

	const staff = React.useMemo(() => {
		const staff = state ? state.staff : [];
		return staff;
	}, [state]);
	function getBaristaName(id) {
		for (let i in staff) {
			if (staff[i].id === id) {
				return staff[i].name;
			}
		}
		return "";
	}

	const menuInfo = React.useMemo(() => {
		const menu = state ? state.menu : [];
		for (let i in menu) {
			const group = menu[i];
			for (let j in group.items) {
				const menuItem = group.items[j];
				if (menuItem.id == item["menu-item-id"]) {
					return menuItem;
				}
			}
		}
		return { a: 0 };
	}, [state]);
	const userid = React.useMemo(() => {
		const user = state ? state.user : null;
		const id = user ? user.id : null;
		return id;
	}, [state]);

	function makeItem(itemid) {
		const data = {
			state: 1,
			token: getSavedToken(),
			id: itemid,
		};
		update(data);
	}
	function cancelItem(itemid) {
		const data = {
			state: 0,
			token: null,
			id: itemid,
		};
		update(data);
	}
	function checkedItem(itemid) {
		const data = {
			state: 2,
			token: getSavedToken(),
			id: itemid,
		};
		update(data);
	}

	function update(data) {
		setLoading(true);
		axios
			.post("/api/store/real-time/update-bill-row", data)
			.then((res) => {
				if (res.status === 200) {
					requestUpdateBills();
				}
				setLoading(false);
			})
			.catch((error) => console.log(error));
	}

	return (
		<li className={"list-group-item "} key={item.id}>
			<div className={styles.item}>
				<span className={styles.itemPic}>
					<img src={menuInfo.picture || Direction.DefaultMenu} />
				</span>
				<span className={styles.itemName}>{menuInfo.name}</span>
				<span>
					{item.state == 0 && (
						<button
							disabled={loading}
							onClick={() => {
								makeItem(item.id);
							}}
							className="btn btn-outline-primary btn-sm"
						>
							Thực hiện
						</button>
					)}

					{item.state == 1 && item.barista != userid && (
						<p className="btn-sm bg-info text-white p-1 m-0 rounded">
							{getBaristaName(item.barista)}
						</p>
					)}

					{item.state == 1 &&
						item.barista == userid &&
						userid != null && (
							<>
								<button
									disabled={loading}
									onClick={() => {
										cancelItem(item.id);
									}}
									className="btn btn-outline-warning btn-sm mr-2"
								>
									Hủy
								</button>
								<button
									disabled={loading}
									onClick={() => {
										alertDialog("Đánh dấu món này đã làm xong (Hành động này không thể thay đổi)",()=>{
											checkedItem(item.id);
										})
										
									}}
									className="btn btn-outline-success btn-sm"
								>
									Đã xong
								</button>
							</>
						)}
				</span>
			</div>
		</li>
	);
}
