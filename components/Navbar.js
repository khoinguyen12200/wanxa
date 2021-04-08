import Link from "next/link";
import React from "react";
import axios from "axios";
import { BsBellFill } from "react-icons/bs";

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
	NotificationDir,
} from "./Const";
import { StoreContext } from "./StoreContext";
import { NotificationRow } from "./Notification";

export default function MyNavbar() {
	const [isOpen, toggle] = React.useState(false);
	const { state, dispatch } = React.useContext(StoreContext);
	const [mobile,setMobile] = React.useState(false);
	React.useEffect(() => {
		setMobile(isMobile());
	},[])
	const { user } = state;
	const stores = user ? user.stores : [];
	return (
		<div id="navbar-dynamic" className={styles.navbar}>
			<Navbar
				color="light"
				light
				expand="md"
				className={mobile ? styles.mobile : ""}
			>
				<Collapse
					onClick={() => mobile && toggle(!isOpen)}
					isOpen={isOpen}
					navbar
				>
					<Link href="/">
						<a className={styles.navitem}>Home</a>
					</Link>

					{stores.map((store, index) => (
						<Link
							href={StoreDir + "/" + store.storeid}
							key={store.storeid}
						>
							<a className={styles.navitem}>{store.name}</a>
						</Link>
					))}
				</Collapse>

				<NavbarToggler onClick={() => toggle(!isOpen)} />

				<Nav>
					<UserSpace user={user} />
				</Nav>
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

		const hasNewNoti = unSeenNotifications.length > 0;
		const colorName = hasNewNoti ? "primary" : "secondary";
		return (
			<>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Button
						onClick={toggle}
						size="sm"
						color={colorName}
						
					>
						<BsBellFill />
						<Badge className="ml-1" color={colorName}>
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
					<a className={styles.userSpace}>
						<span>{user.name}</span>
						<img src={user.avatar} alt="avatar" />
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
		<Modal
			isOpen={modal}
			toggle={toggle}
			className={styles.NotificationModal}
		>
			<ModalHeader toggle={toggle}>
				{unSeenNotifications.length > 0
					? `Có ${unSeenNotifications.length} thông báo mới`
					: "Chưa có thông báo mới"}
			</ModalHeader>
			<ModalBody>
				<div className={styles.listNotification}>
					{notifications.map((notification, index) => {
						return (
							<NotificationRow
								onClick={() => setSeen(index)}
								key={index}
								notification={notification}
							/>
						);
					})}
				</div>
			</ModalBody>
			<ModalFooter>
				<div className="w-100 d-flex justify-content-between">
					<div>
						<Link href={NotificationDir}>
							<a
								className="btn btn-outline-secondary"
								onClick={toggle}
							>
								Xem tất cả
							</a>
						</Link>
					</div>
					<div>
						<Button color="primary" onClick={seenAll} disabled={unSeenNotifications.length === 0}>
							Đã đọc tất cả
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Đóng
						</Button>
					</div>
				</div>
			</ModalFooter>
		</Modal>
	);
}
