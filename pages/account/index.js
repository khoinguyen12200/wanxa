import React from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import Link from "next/link";

import { CreateStore } from "../../components/Const";
import { StoreContext } from "../../components/StoreContext";
import styles from "../../styles/account.module.css";

export default function index() {
	const [state, dispatch] = React.useContext(StoreContext);
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
	const [tab, meta] = React.useState(1);

	const getTabName = (num) => {
		return tab == num
			? styles.dirItem + " " + styles.dirActive
			: styles.dirItem;
	};
	return (
		<div className={styles.accountMain}>
			<div className={styles.layout}>
				<div className={styles.directionTable}>
					<button onClick={() => meta(1)} className={getTabName(1)}>
						Doanh nghiệp
					</button>
					<button onClick={() => meta(2)} className={getTabName(2)}>
						Thông tin cá nhân
					</button>
				</div>
				<div className={styles.accountContent}>
					{tab == 1 && <Stores user={user} />}
				</div>
			</div>
		</div>
	);
}

function Stores({ user }) {
	var { stores } = user;
	return (
		<div className={styles.stores}>
			{stores.length == 0 && (
				<NoStore/>
			)}
		</div>
	);
}

function NoStore(){
	return <div className={styles.noStore}>
	<div className={styles.NShint}>
		<h3 className={styles.NSmessage}>
			Bạn chưa tham gia vào doanh nghiệp nào
		</h3>
		<Link href={CreateStore}>
			<a className={styles.NSlink}>
				<AiOutlineAppstoreAdd
					className={styles.NSicon}
				/>
				<h4>Tạo một doanh nghiệp mới</h4>
			</a>
		</Link>
	</div>
</div>
}
