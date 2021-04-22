import React from "react";
import { useRouter } from "next/router";
import { AiFillAppstore } from "react-icons/ai";
import {IoNotificationsCircleOutline} from 'react-icons/io5';


import {RiProfileFill,RiBillFill} from "react-icons/ri";
import {SiAirtable} from 'react-icons/si';
import {BsPeopleFill} from 'react-icons/bs';
import {MdRestaurantMenu} from 'react-icons/md';
import Link from "next/link";

import {CanNotAccess,Loading} from '../../../components/Pages';

import NavBar from '../../../components/MultiLevelNavbar'
import { StoreContext } from "../../../components/StoreContext";
import styles from "../../../styles/main-store.module.css";


import {Direction} from '../../../components/Const';

export default function index() {
	

	const router = useRouter();
	const { storeId } = router.query;

	const { state, dispatch ,getStorePrivileges} = React.useContext(StoreContext);
	const { user } = state;

	const access = React.useMemo(function(){
		const privileges = getStorePrivileges(storeId);
		if(privileges >=0) {
			return 1;
		}else{
			return -1;
		}
	},[storeId,state])


	if(access == 0){
		return <Loading/>
	}
	if(access == -1){
		return <CanNotAccess/>
	}

	return <AcceptAccessStore storeid={storeId} />;
}
function AcceptAccessStore({ storeid }) {
	return (
		<div className={styles.Accept}>
			
			<NavBar/>
			<div className={styles.router}>
				<Link href={Direction.RealTime(storeid)} >
					<a className={styles.routeItem} style={{color:'#0080ff'}}>
						<AiFillAppstore />
						<div>
							<p>Thời gian thực</p>
						</div>
					</a>
				</Link>
				
				<Link href={Direction.Bills(storeid)}>
					<a className={styles.routeItem} style={{color:"#996633"}}>
						<RiBillFill />
						<div>
							<p>Hóa đơn</p>
						</div>
					</a>
				</Link>

				<Link href={Direction.Facility(storeid)}>
					<a className={styles.routeItem} style={{color:"#ff6600"}}>
						<SiAirtable />
						<div>
							<p>Cơ sở vật chất</p>
						</div>
					</a>
				</Link>

				<Link href={Direction.InternalNotification(storeid)}>
					<a className={styles.routeItem} style={{color:"#006699"}}>
						<IoNotificationsCircleOutline />
						<div>
							<p>Thông báo nội bộ</p>
						</div>
					</a>
				</Link>
				
				<Link href={Direction.HRM(storeid)}>
					<a className={styles.routeItem} style={{color:"#cc0000"}}>
						<BsPeopleFill />
						<div>
							<p>Quản lý nhân sự</p>
						</div>
					</a>
				</Link>
				

				<Link href={Direction.Menu(storeid)}>
					<a className={styles.routeItem} style={{color:"#cc9900"}}>
						<MdRestaurantMenu />
						<div>
							<p>Thực đơn</p>
						</div>
					</a>
				</Link>
				<Link href={Direction.BasicInfo(storeid)}>
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
