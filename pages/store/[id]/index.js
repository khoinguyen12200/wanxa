import React from "react";
import { useRouter } from "next/router";

import {StoreContext} from '../../../components/StoreContext'
import styles from '../../../styles/main-store.module.css'

export default function index() {
	const router = useRouter();
	const { id } = router.query;
	const [state,dispatch] = React.useContext(StoreContext);
	const {user} = state;
	const stores = user ? user.stores : [];
	const storesId = stores.map(store => store.storeid);

	if(storesId.includes(parseInt(id))){
		return <AcceptAccessStore/>
	}else{
		return <RejectAccessStore/>
	}
	
}
function AcceptAccessStore () {
	return (
		<div>
			accepted
		</div>
	)
}
function RejectAccessStore () {
	return (
		<div className={styles.rejectPage}>
			<div className={styles.rejectBanner}>
				<h3>
					Bạn không có quyền truy cập vào cửa hàng này
				</h3>
			</div>
		</div>
	)
}

