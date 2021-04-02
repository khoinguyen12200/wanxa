import React from "react";
import { useRouter } from "next/router";

import { StoreContext } from "../../../components/StoreContext";
import styles from "../../../styles/main-store.module.css";
import Selector from "../../../components/Selector";

import Facility from "../../../components/Facility";
import BasicStoreInfo from "../../../components/BasicStoreInfo";

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
	const [tab,setTab] = React.useState(2);
	return (
		<div className={styles.Accept}>
			<div className={styles.header}>
				<Selector
					backColor="#ccc"
					options={[
						{ title: "Thời gian thực", value: 0 },
						{ title: "Cơ sở vật chất", value: 1 },
						{ title: "Thông tin cơ bản", value: 2 },
					]}
					defaultValue={tab}
					onChange={setTab}
				/>
			</div>
			{
				tab == 1 &&
				<Facility storeid={storeid} />
			}
			{
				tab == 2 &&
				<BasicStoreInfo storeid={storeid}/>
			}
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

