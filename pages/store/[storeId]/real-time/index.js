import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

import {StoreContext} from "../../../../components/StoreContext";
import Nav from "../../../../components/MultiLevelNavbar";
import styles from "../../../../styles/realtime-index.module.css";
import { useStoreStaff, Direction } from "../../../../components/Const";
import { CanNotAccess } from "../../../../components/Pages";
export default function index() {
	const router = useRouter();
	const { storeId } = router.query;

	const {state,updateBillsRealTimes} = React.useContext(StoreContext);
	const {bills} = state;

	const [access, setAccess] = React.useState(-1);
	useStoreStaff((value) => {
		if (value < 0) {
			setAccess(-1);
		} else {
			setAccess(1);
		}
	});

	const [tableGroups, setTableGroups] = React.useState([]);


	React.useEffect(() => {
		if (storeId == null) return;
		const data = {
			storeid: storeId,
		};
		axios
			.post("/api/store/real-time/getData", data)
			.then((res) => {
				if (res.status === 200) {
					console.log(res.data)
					setTableGroups(res.data);
				}
			})
			.catch((error) => console.log(error));

		
	}, [storeId]);

	if (access == -1) return <CanNotAccess />;
	return (
		<div>
			<Nav />
			<div className={styles.content}>
				<div className={styles.routeSpace}>
					<Link href={Direction.Barista(storeId)}>
						<a className="btn btn-outline-primary ">Pha chế</a>
					</Link>
				</div>
				{tableGroups.map((tableGroup) => (
					<Group group={tableGroup} key={tableGroup.id}  />
				))}
			</div>
		</div>
	);
}

function Group({ group }) {
	return (
		<div className={styles.group}>
			<div className={styles.groupName}>{group.name}</div>
			<div className={styles.tables}>
				{group.tables.map((table) => (
					<Table table={table} key={table.id} />
				))}
			</div>
		</div>
	);
}

function Table({ table }) {
	const router = useRouter();
	const { storeId } = router.query;

	const {state,updateBillsRealTimes} = React.useContext(StoreContext);
	const {bills} = state;

	const bill = React.useMemo(()=>{
		for(let i in bills){
			const curBill = bills[i];
			if(curBill.tableid == table.id){
				return curBill;
			}
		}
		return null;
	},[bills]);

	const hasBill = React.useMemo(() => {
		return bill != null;
	});

	function handleClick() {
		router.push(Direction.CreateBill(storeId, table.id));
	}
	return (
		<div
			onClick={handleClick}
			className={
				hasBill
					? styles.table + " btn btn-warning"
					: styles.table + " btn btn-outline-secondary"
			}
		>
			<div className={styles.tableName}>{table.name}</div>
			{hasBill && (
				<span className={"badge badge-dark " + styles.tableNumber}>
					{bill.items.length}
				</span>
			)}
		</div>
	);
}
