import Link from "next/link";
import React from "react";
import axios from "axios";

import {
	Badge,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "reactstrap";

import styles from "../styles/Navbar.module.css";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
} from "reactstrap";
import {
	isMobile,
	SignInDir,
	getTimeBefore,
	AccountDir,
	StoreDir,
} from "./Const";
import { StoreContext } from "./StoreContext";
import Notification from "./Notification";

export default function MyNavbar() {
	const [isOpen, toggle] = React.useState(false);
	const { state, dispatch } = React.useContext(StoreContext);
	const { user } = state;
	const stores = user ? user.stores : [];
	console.log(user);

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
	const [modal, setModal] = React.useState(false);
	function toggle() {
		setModal(!modal);
	}
	if (user == null) {
		return (
			<Link href={SignInDir}>
				<a className={styles.navitem}>Sign In</a>
			</Link>
		);
	} else {
		const notifications = user.notifications;
		const unSeenNotifications = notifications.filter(
			(notification) => !notification.seen
		);

		return (
			<>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Button
						onClick={toggle}
						size="sm"
						color={
							unSeenNotifications.length == 0
								? "secondary"
								: "primary"
						}
						outline
					>
						Thông báo{" "}
						<Badge color="secondary">
							{unSeenNotifications.length}
						</Badge>
					</Button>
					<NotificationSpace
						modal={modal}
						toggle={toggle}
						notifications={notifications}
						unSeenNotifications={unSeenNotifications}
					/>
				</div>
				<Link href={AccountDir}>
					<a className={styles.navitem}>
						<div className={styles.userSpace}>
							<span>{user.name}</span>
							<img src={user.avatar} alt="avatar" />
						</div>
					</a>
				</Link>
			</>
		);
	}
}

function NotificationSpace({
	modal,
	toggle,
	notifications,
	unSeenNotifications,
}) {
	const { reloadToken } = React.useContext(StoreContext);

	function setSeen(index) {
		const notification = notifications[index];

		if (!notification.seen) {
			const data = {
				id: notification.id,
			};
			axios
				.post("/api/notification/api-set-seen", data)
				.then((res) => {
					reloadToken();
				})
				.catch((error) => console.log(error));
		}
	}
	function seenAll() {
		for (let i in notifications) {
			setSeen(i);
		}
	}
	return (
		<Modal isOpen={modal} toggle={toggle}>
			<ModalHeader toggle={toggle}>
				{unSeenNotifications.length > 0
					? `Có ${unSeenNotifications.length} thông báo mới`
					: "Chưa có thông báo mới"}
			</ModalHeader>
			<ModalBody>
				<div className={styles.listNotification}>
					{notifications.map((notification, index) => {
						const {
							type,
							content,
							destination,
							seen,
							time,
						} = notification;
						var notiObject = new Notification(
							type,
							content,
							destination,
							seen,
							time
						);
						return (
							<div
								key={notification.id}
								className={
									seen
										? styles.notification +
										  " " +
										  styles.notiSeen
										: styles.notification
								}
							>
								<p
									className={styles.notificationMessage}
									onClick={() => setSeen(index)}
								>
									{notiObject.getMessage() + " "}
									<Badge color="secondary">
										{getTimeBefore(time)}
									</Badge>
								</p>
							</div>
						);
					})}
				</div>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={seenAll}>
					Đã đọc tất cả
				</Button>{" "}
				<Button color="secondary" onClick={toggle}>
					Đóng
				</Button>
			</ModalFooter>
		</Modal>
	);
}
