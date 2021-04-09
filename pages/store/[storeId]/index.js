import React from "react";
import { useRouter } from "next/router";
import { AiFillAppstore } from "react-icons/ai";
import {IoNotificationsCircleOutline} from 'react-icons/io5';


import {RiProfileFill} from "react-icons/ri";
import {SiAirtable} from 'react-icons/si';
import {BsPeopleFill} from 'react-icons/bs';
import Link from "next/link";

import NavBar from '../../../components/StoreNavBar'
import { StoreContext } from "../../../components/StoreContext";
import styles from "../../../styles/main-store.module.css";



export default function index() {
	const router = useRouter();
	const { storeId } = router.query;

	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	const stores = user ? user.stores : [];
	const storesIds = stores.map((store) => store.storeid);

	if (storesIds.includes(parseInt(storeId))) {
		return <AcceptAccessStore storeid={storeId} />;
	} else {
		return <RejectAccessStore />;
	}
}
function AcceptAccessStore({ storeid }) {
	return (
		<div className={styles.Accept}>
			
			<NavBar/>
			<div className={styles.router}>
				<Link href={`/store/${storeid}/real-time`} >
					<a className={styles.routeItem} style={{color:'#0080ff'}}>
						<AiFillAppstore />
						<div>
							<p>Thời gian thực</p>
						</div>
					</a>
				</Link>
				<Link href={`/store/${storeid}/facility`}>
					<a className={styles.routeItem} style={{color:"#ff6600"}}>
						<SiAirtable />
						<div>
							<p>Cơ sở vật chất</p>
						</div>
					</a>
				</Link>

				<Link href={`/store/${storeid}/internal-notification`}>
					<a className={styles.routeItem} style={{color:"#006699"}}>
						<IoNotificationsCircleOutline />
						<div>
							<p>Thông báo nội bộ</p>
						</div>
					</a>
				</Link>
				
				<Link href={`/store/${storeid}/hrm`}>
					<a className={styles.routeItem} style={{color:"#cc0000"}}>
						<BsPeopleFill />
						<div>
							<p>Quản lý nhân sự</p>
						</div>
					</a>
				</Link>
				<Link href={`/store/${storeid}/basic-info`}>
					<a className={styles.routeItem} style={{color:"#669900"}}>
						<RiProfileFill />
						<div>
							<p>Thông tin cơ bản</p>
						</div>
					</a>
				</Link>
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
