import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { BsBellFill } from "react-icons/bs";
import { AiFillMessage, AiOutlineSend } from "react-icons/ai";

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
	Direction
} from "./Const";
import { StoreContext } from "./StoreContext";
import { NotificationRow } from "./Notification";
import { toast } from "react-toastify";


export default function MyNavbar() {
	const [isOpen, toggle] = React.useState(false);
	const { state, dispatch } = React.useContext(StoreContext);
	const [mobile, setMobile] = React.useState(false);
	React.useEffect(() => {
		setMobile(isMobile());
	}, []);
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
	const { state } = React.useContext(StoreContext);
	const { user } = props;
	const router = useRouter();
	const { storeId } = router.query;
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
					{storeId != null && <Message />}
					<Button
						className="ml-1"
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

function Message({}) {
	const router = useRouter();
	const { storeId } = router.query;
	const { state, getSavedToken } = React.useContext(StoreContext);
	const [lastSeen,setLastSeen] = React.useState(new Date());
	const [firstTimeRender,setFirstTime] = React.useState(true);
	

	React.useEffect(()=>{
		if(state.user == null || storeId == null || !firstTimeRender) {
			return;
		}
		updateLastSeen()
	},[state,storeId]);
	
	function updateLastSeen(){
		setFirstTime(false);
		const data = {
			token: getSavedToken(),
			storeid: storeId,
		}
		axios.post('/api/store/message/get-last-seen', data)
			.then(res => {
				if (res.status === 200) {
					console.log(new Date(res.data.time).getTime()  - new Date().getTime())
					setLastSeen(res.data.time)
				}
		
			})
			.catch(error => console.log(error));
	}
	const message = React.useMemo(()=>{
		return state.message;
	},[state])
	const messages = React.useMemo(() => {
		const arr = message.concat([]);
		var newArr = [];
		for (let i = 0; i < arr.length; i++) {
			newArr.unshift(arr[i]);
		}
		return newArr;
	}, [message, storeId]);

	const storeName = React.useMemo(() => {
		const user = state.user;
		const stores = user ? user.stores : [];
		for (let i in stores) {
			const store = stores[i];
			if (store.storeid == storeId) return store.name;
		}
		return "";
	}, [state, storeId]);
	const [modal, setModal] = React.useState(false);

	const toggle = () => setModal(!modal);
	React.useEffect(()=>{
		if(firstTimeRender) return;
		const data = {
			token:getSavedToken(),
			storeid:storeId,
		}
		axios.post('/api/store/message/set-last-seen', data)
			.then(res => {
				updateLastSeen()
			})
			.catch(error => console.log(error));
	},[modal])

	const watingMessages = React.useMemo(() => {
		var count = 0;
		
	
		if(lastSeen!= null && messages != [] && messages != null) {
			const lastTime = new Date(lastSeen);
			var lastMessageTime = messages[messages.length - 1] ? messages[messages.length - 1].time : null;
			lastMessageTime = new Date(lastMessageTime)
			for(let i = messages.length - 1; i >= 0; i--) {
				
				const messTime = new Date(messages[i].time);
				if(lastTime.getTime()  - messTime.getTime() > 0){
					
					break;
				}
				count ++;
			} 
		}
		return count;
			
			
	},[lastSeen,messages])

	const [value, setValue] = React.useState("");
	function submitSend(e) {
		e.preventDefault();
		const messageStr = value.trim();
		if (messageStr.length > 0) {
			if (messageStr.length > 499) {
				toast.error("Tin nhắn quá dài");
			} else {
				const data = {
					storeid: storeId,
					message: messageStr,
					token: getSavedToken(),
				};
				axios
					.post("/api/socket/send-message", data)
					.then((res) => {
						if (res.status === 200) {
							setValue("");
						}
					})
					.catch((error) => console.log(error));
			}
		}
	}
	return (
		<div>
			<button className={"btn btn-sm "+ (watingMessages > 0 ? "btn-primary " : "btn-secondary")} onClick={toggle}>
				<AiFillMessage />
				<span className={"ml-1 badge "+(watingMessages > 0 ? "badge-primary" : "badge-secondary")}>{watingMessages}</span>
			</button>
			<Modal centered isOpen={modal} toggle={toggle} className={styles.modalContent}>
				<ModalHeader toggle={toggle}>Tin nhắn {storeName}</ModalHeader>
				<ModalBody className={styles.messageBody}>
					{messages.map((message,index) => (
						<ItemMessage message={message} key={message.id} lastChild={index == messages.length - 1}/>
					))}
				</ModalBody>
				<ModalFooter>
					<form onSubmit={submitSend} className="d-flex w-100">
						<input
							type="text"
							className="form-control p-1 mr-1"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
						<button
							style={{ minWidth: 50 }}
							className="btn btn-sm btn-primary"
						>
							<AiOutlineSend style={{height:"80%", width:"auto"}}/>
						</button> 
					</form>
				</ModalFooter>
			</Modal>
		</div>
	);
}
function ItemMessage({ message,lastChild }) {
	const MessRef = React.useRef(null)
	React.useEffect(()=>{
		if(lastChild){
			if(MessRef && MessRef.current){
				MessRef.current.scrollIntoView();
			}
		}
	},[])
	const { state } = React.useContext(StoreContext);


	const staff = React.useMemo(() => {
		const staffs = state.staff;
		for (let i in staffs) {
			const desStaff = staffs[i];
			if (desStaff.id == message.userid) {
				return desStaff;
			}
		}
		return { name: "unknow staff" };
	}, [state]);
	const user = React.useMemo(() => {
		return state.user;
	}, [state]);
	const isMe = React.useMemo(() => {
		return message.userid == user.id;
	}, [user, message]);

	const [extra, setExtra] = React.useState(false);
	function toggle() {
		setExtra(!extra);
	}
	return (
		<div
			ref={MessRef}
			
			key={message.id}
			className={
				isMe
					? styles.myMessage + " " + styles.messageContainer
					: styles.othersMessage + " " + styles.messageContainer
			}
		>
			<div onClick={() => toggle()} className={styles.directionContainer}>
				<div className={styles.content}>
					{!isMe && (
						<span className={styles.avatarSpace}>
							<img src={staff.avatar || Direction.DefaultAvatar} />
						</span>
					)}

					<div className={styles.messageAndName}>
						{!isMe && <div className={styles.messageOwner}>{staff.name}</div>}
						<div className={styles.message}>{message.message}</div>
					</div>
				</div>

				{extra && <span className={styles.messageTime}>{getTimeBefore(message.time)}</span>}
			</div>
		</div>
	);
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
								toggle={toggle}
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
						<Button
							color="primary"
							onClick={seenAll}
							disabled={unSeenNotifications.length === 0}
						>
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
