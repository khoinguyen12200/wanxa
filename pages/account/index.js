import React from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import Link from "next/link";

import { CreateStore, DefaultStore, StoreDir } from "../../components/Const";
import { StoreContext } from "../../components/StoreContext";
import Selector from "../../components/Selector";
import styles from "../../styles/account.module.css";

export default function index() {
	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	if (user != null) {
		return <AccountCenter user={user} />;
	} else {
		return <NotFound />;
	}
}
function NotFound() {
	return (
		<div className={styles.accountMain}>
			<div className={styles.notFound}>
				<div className={styles.message}>
					You cannot access this page until sign in
				</div>
			</div>
		</div>
	);
}

function AccountCenter({ user }) {
	const [tab, setTab] = React.useState(0);

	const getTabName = (num) => {
		return tab == num
			? styles.dirItem + " " + styles.dirActive
			: styles.dirItem;
	};
	return (
		<div className={styles.accountMain}>
			<div className={styles.layout}>
				<div className={styles.directionTable}>
					<Selector
						backColor="#ccc"
						options={[
							{ title: "Doanh nghiệp", value: 0 },
							{ title: "Cá nhân", value: 1 },
						]}
						defaultValue={tab}
						onChange={setTab}
					/>
				</div>

				<div className={styles.accountContent}>
					{tab == 0 && <Stores user={user} />}
				</div>
			</div>
		</div>
	);
}

function Stores({ user }) {
	var { stores } = user;
	return (
		<div className={styles.stores}>
			{stores.length == 0 && <NoStore />}
			{stores.map((store, index) => {
				return <Store key={index} store={store} />;
			})}

			<Link href={CreateStore}>
				<a className={styles.storeCard + " " + styles.addNew}>
					<AiOutlineAppstoreAdd className={styles.NSicon} />
					<h4>Tạo một doanh nghiệp mới</h4>
				</a>
			</Link>
		</div>
	);
}
function Store({ store }) {
	const { storeid, name, logo, description } = store;
	return (
		<Link href={StoreDir + "/" + storeid}>
			<a className={styles.storeCard}>
				<img src={logo || DefaultStore} className={styles.storeLogo} />
				<div className={styles.storeInfo}>
					<h4 className={styles.storeName}>{name}</h4>
					<p className={styles.storeDescription}>{description}</p>
				</div>
			</a>
		</Link>
	);
}
