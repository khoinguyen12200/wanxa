import React from "react";

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
function AccountCenter() {
	return (
        <div className={styles.accountMain}>
            
        </div>
    )
}
function NotFound() {
	return (
		<div className={styles.accountMain}>
			<div className={styles.notFound}>
				You cannot access this page until sign in
			</div>
		</div>
	);
}
