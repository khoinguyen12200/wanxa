import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

import styles from "../../../../styles/internal-information.module.css";
import NavBar from "../../../../components/MultiLevelNavbar";
import {
	CreateInternalNotificationDir,
	getTimeBefore,
	FormatDateTime,
	InternalNotificationDetailDir,
} from "../../../../components/Const";

import { DisplayContent } from "../../../../components/RichTextEditor";
import { CanNotAccess } from "../../../../components/Pages";
import Privileges from "../../../../components/Privileges";
import { StoreContext } from "../../../../components/StoreContext";

export default function InternalNotification() {
	const numberOfItems = 20;

	const router = useRouter();
	const { storeId } = router.query;
	const { state, getStorePrivileges } = React.useContext(StoreContext);
	const access = React.useMemo(() => {
		const value = getStorePrivileges(storeId);
		if (value < 0) {
			return -1;
		} else {
			const notiRights = Privileges.isValueIncluded(value, [
				Privileges.Content.OWNER,
				Privileges.Content.NOTIFICATION,
			]);
			return notiRights ? 2 : 1;
		}
	}, [storeId, state]);

	const [arrNotifications, setArr] = React.useState([]);
	const [page, setPage] = React.useState(0);
	function xemThem() {
		fetchData();
	}
	function addArr(arr) {
		setArr(arrNotifications.concat(arr));
	}
	React.useEffect(() => {
		if (storeId != undefined) {
			fetchData();
		}
	}, [storeId]);
	function fetchData() {
		if (storeId == undefined || isEnd) {
			return;
		}
		const data = {
			from: page * numberOfItems,
			len: numberOfItems,
			storeid: storeId,
		};
		axios
			.post("/api/store/internal-notification/getNotifications", data)
			.then((res) => {
				const result = res.data;
				addArr(result);
				setPage(page + 1);
				if (result.length != numberOfItems) {
					setIsEnd(true);
				}
			})
			.catch((error) => console.log(error));
	}
	const [isEnd, setIsEnd] = React.useState(false);

	if (access == -1) {
		return (
			<div>
				<NavBar />
				<CanNotAccess />
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<NavBar />
			<h3 className={styles.title}>Thông báo nội bộ</h3>
			{access == 2 && (
				<div className={styles.createButton}>
					<Link href={CreateInternalNotificationDir(storeId)}>
						<a className="btn btn-primary">Thêm thông báo mới</a>
					</Link>
				</div>
			)}
			<div className={styles.listInterNoti}>
				{arrNotifications.map((noti) => (
					<Notification notification={noti} key={noti.id} />
				))}
				{!isEnd && (
					<div>
						<button
							className="btn btn-outline-primary mr-auto"
							onClick={xemThem}
						>
							Xem thêm
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

function Notification({ notification }) {
	return (
		<Link
			href={InternalNotificationDetailDir(
				notification.storeid,
				notification.id
			)}
		>
			<a className={styles.Notification}>
				<div className={styles.NotiHeader}>
					<div>
						<div className="badge badge-secondary">
							{getTimeBefore(notification.date)}
						</div>
					</div>
					<div>
						{notification.username +
							" - " +
							FormatDateTime(notification.date)}
					</div>
				</div>
				<DisplayContent content={notification.content} />
			</a>
		</Link>
	);
}
