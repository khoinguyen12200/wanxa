import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {RiAddBoxLine} from 'react-icons/ri';


import { StoreContext } from "../../../components/StoreContext";
import styles from "../../../styles/main-store.module.css";

export default function index() {
	const router = useRouter();
	const { id } = router.query;
	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	const stores = user ? user.stores : [];
	const storesId = stores.map((store) => store.storeid);

	if (storesId.includes(parseInt(id))) {
		return <AcceptAccessStore storeid={id} />;
	} else {
		return <RejectAccessStore />;
	}
}
function AcceptAccessStore({ storeid }) {
	return (
		<div className={styles.Accept}>
			<StoreGroup storeid={storeid} />
		</div>
	);
}

function StoreGroup({ storeid }) {
	const [groups, setGroups] = React.useState([]);
	const { getSavedToken } = React.useContext(StoreContext);

	React.useEffect(() => {
		update();
	}, [storeid]);

	function update(){
		var data = new FormData();
		data.append("storeid", storeid);
		data.append("token", getSavedToken());
		axios .post("/api/store/store-group", data)
			.then((res) => {
				if (res.status === 200) {
					const {group} = res.data;
					setGroups(group) ;
				}
			})
			.catch((error) => console.log(error));
	}

	return (
		<div className={styles.storeGroup}>
			{groups.map((group,index) => {
				return <Group group={group} key={index} onUpdate={update} />;
			})}
		</div>
	);
}
function Group({ group,onUpdate }) {
	const { getSavedToken } = React.useContext(StoreContext);

	const { tables,name,id } = group;
	function addTable(tbName){
		const groupId = id;
		if(tbName == null) return;
		
		var data = new FormData();
		data.append("name",tbName);
		data.append('groupid',groupId);
		data.append("token",getSavedToken())

		axios.post('/api/store/addTable', data)
			.then(res => {
				if (res.status === 200) {
					onUpdate();
				}
		
			})
			.catch(error => console.log(error));

	}
	
	return (
		<div className={styles.groupTable}>
			<div className={styles.groupTableTitle}>
				{name}
			</div>
			<div className={styles.groupTableContent}>
				{tables.map((table, index) => (
					<div className={styles.tableItem} key={index}>
						{table.name}
					</div>
				))}
				<div className={styles.addTable}>
					<button className="btn btn-outline-secondary m-3" onClick={()=>{
						let name = prompt("Nhập tên bàn (Số bàn)");
						addTable(name)
					}}>
						<RiAddBoxLine/> Thêm bàn
					</button>
				</div>
			</div>
		</div>
	);
}
function RejectAccessStore() {
	return (
		<div className={styles.rejectPage}>
			<div className={styles.rejectBanner}>
				<h3>Bạn không có quyền truy cập vào cửa hàng này</h3>
			</div>
		</div>
	);
}
