import Link from "next/link";
import React from "react";
import styles from "../styles/Navbar.module.css";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
} from "reactstrap";
import { isMobile,SignInDir,AboutDir,AccountDir } from "./Const";
import { StoreContext } from "./StoreContext";

export default function MyNavbar() {
	const [isOpen, toggle] = React.useState(false);
	const [state, dispatch] = React.useContext(StoreContext);
	const { user } = state;
	return (
		<div className={styles.navbar}>
			<Navbar color="light" light expand="md">
				<Link href="/">
					<a>Home</a>
				</Link>
				<NavbarToggler onClick={() => toggle(!isOpen)} />
				<Collapse
					onClick={() => isMobile() && toggle(!isOpen)}
					isOpen={isOpen}
					navbar
				>
					<Nav className="mr-auto" navbar>
						<Link href={AboutDir}>
							<a className={styles.navitem}>About</a>
						</Link>
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
	}else{
		return (
			<Link href={AccountDir}>
				<a className={styles.navitem}>
					<div className={styles.userSpace}>
						<span>{user.name}</span>
						<img src={user.avatar} alt="avatar"/>
					</div>
				</a>
			</Link>
		);
	}
}
