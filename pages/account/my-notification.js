import React from "react";
import axios from "axios";
import { StoreContext } from "../../components/StoreContext";
import { NotificationRow } from "../../components/Notification";
import styles from "../../styles/my-notification.module.css";

export default function myNotification() {
	const itemsPerPage = 5;
	const { getSavedToken } = React.useContext(StoreContext);

	const [arr, setArr] = React.useState([]);
	const [isEnd, setIsEnd] = React.useState(false);

	function addArr(newArr) {
		setArr(arr.concat(newArr));
	}
	function setSeenItem(index) {
		var newArr = arr.concat([]);
		newArr[index].seen = true;
		setArr(newArr);
	}
	const [page, setPage] = React.useState(0);
	React.useEffect(() => {
		getNext();
	}, []);
	function getNext() {
		const fromItem = page * itemsPerPage;

		const data = {
			from: fromItem,
			numberOfItem: itemsPerPage,
			token: getSavedToken(),
		};
		axios
			.post("/api/notification/api-get-notification", data)
			.then((res) => {
				console.log(res);
				console.log(itemsPerPage);
				if (res.data.length != itemsPerPage) {
					setIsEnd(true);
				}
				addArr(res.data);
				setPage(page + 1);
			})
			.catch((error) => console.log(error));
	}

	const { reloadToken } = React.useContext(StoreContext);

	function setSeen(index) {
		const notification = arr[index];
		if (!notification.seen) {
			const data = {
				id: notification.id,
			};
			axios
				.post("/api/notification/api-set-seen", data)
				.then((res) => {
					reloadToken();
					setSeenItem(index);
				})
				.catch((error) => console.log(error));
		}
	}

	return (
		<div className={styles.Page}>
			<h3 className={styles.title}>Bảng thông báo</h3>
			<div className={styles.ListNotification}>
				{arr.map((notification, index) => {
					return (
						<NotificationRow
							onClick={() => setSeen(index)}
							key={index}
							notification={notification}
						/>
					);
				})}
			</div>
            <div className={styles.buttonSpace}>
					<button onClick={getNext} className="btn btn-primary" disabled={isEnd}>
						Xem thêm
					</button>
				</div>
			
		</div>
	);
}
