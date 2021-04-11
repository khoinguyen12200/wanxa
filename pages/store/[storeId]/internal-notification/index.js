import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

import styles from "../../../../styles/internal-information.module.css";
import NavBar from "../../../../components/StoreNavBar";
import {
	CreateInternalNotificationDir,
	getTimeBefore,
	FormatDateTime,
	InternalNotificationDetailDir,
} from "../../../../components/Const";
import { DisplayContent } from "../../../../components/RichTextEditor";

export default function InternalNotification() {
	const numberOfItems = 20;

	const router = useRouter();
	const { storeId } = router.query;
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

	return (
		<div className={styles.page}>
			<NavBar />
			<h3 className={styles.title}>Thông báo nội bộ</h3>
			<div className={styles.createButton}>
				<Link href={CreateInternalNotificationDir(storeId)}>
					<a className="btn btn-primary">Thêm thông báo mới</a>
				</Link>
			</div>
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
		<Link href={InternalNotificationDetailDir(notification.storeid, notification.id)}>
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
