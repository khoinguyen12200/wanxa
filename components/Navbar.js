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
import {isMobile} from './Const'

export default function MyNavbar() {
	const [isOpen, toggle] = React.useState(false);
	return (
		<div className={styles.navbar}>
			<Navbar color="light" light expand="md">
				<NavbarBrand href="/">Home</NavbarBrand>
				<NavbarToggler onClick={() => toggle(!isOpen)} />
				<Collapse onClick={() => isMobile() && toggle(!isOpen)} isOpen={isOpen} navbar>
					<Nav className="mr-auto" navbar>
						<Link href="/about">
							<a className={styles.navitem}>About</a>
						</Link>
					</Nav>
					<Nav>
						<Link href="/signin">
							<a className={styles.navitem}>Sign In</a>
						</Link>
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
}
