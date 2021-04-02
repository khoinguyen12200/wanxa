import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import ReactDom from "react-dom";

import styles from "../styles/Navbar.module.css";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
} from "reactstrap";
import { isMobile, SignInDir, AboutDir, AccountDir, StoreDir } from "./Const";
import { StoreContext } from "./StoreContext";

export default function MyNavbar() {


	const [isOpen, toggle] = React.useState(false);
	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	const stores = user ? user.stores : [];


	const mobile = isMobile() ? styles.mobile : "";
	return (
		<div id="navbar-dynamic" className={styles.navbar + " " + mobile}>
			<Navbar color="light" light expand="md">
				<Link href="/">
					<a className={styles.navitem}>Home</a>
				</Link>
				<NavbarToggler onClick={() => toggle(!isOpen)} />
				<Collapse
					onClick={() => isMobile() && toggle(!isOpen)}
					isOpen={isOpen}
					navbar
				>
					<Nav className="mr-auto" navbar>
						{stores.map((store, index) => (
							<Link
								href={StoreDir + "/" + store.storeid}
								key={store.storeid}
							>
								<a className={styles.navitem}>{store.name}</a>
							</Link>
						))}
					</Nav>
					<Nav>
						<UserSpace user={user} />
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
}

function UserSpace(props) {
	const { user } = props;
	if (user == null) {
		return (
			<Link href={SignInDir}>
				<a className={styles.navitem}>Sign In</a>
			</Link>
		);
	} else {
		return (
			<Link href={AccountDir}>
				<a className={styles.navitem}>
					<div className={styles.userSpace}>
						<span>{user.name}</span>
						<img src={user.avatar} alt="avatar" />
					</div>
				</a>
			</Link>
		);
	}
}
