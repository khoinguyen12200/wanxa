import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

import {
	InternalNotificationDir,
	getTimeBefore,
	FormatDateTime,
	EditInternalNotificationDir,
} from "../../../../../../components/Const";
import NavBar from "../../../../../../components/MultiLevelNavbar";
import { DisplayContent } from "../../../../../../components/RichTextEditor";
import styles from "../../../../../../styles/inter-noti-item.module.css";
import { StoreContext } from "../../../../../../components/StoreContext";
import Notification from "../../../../../../components/Notification";
import { toast } from "react-toastify";
import {alertDialog} from '../../../../../../components/Modal';

export default function index() {
	const [notification, setNotification] = React.useState(null);
	const router = useRouter();
	const { storeId, inId } = router.query;

	const { state ,getSavedToken } = React.useContext(StoreContext);
	const editable = React.useMemo(() => {
		return isEditable(state, notification);
	}, [state, notification]);

	function isEditable(state, notification) {
		const user = state ? state.user : null;
		const userid = user ? user.id : null;

		const executor = notification ? notification.executor : null;
		if (executor == userid && userid != null) {
			return true;
		}
		return false;
	}
	React.useEffect(() => {
		const data = {
			id: inId,
		};

		axios
			.post("/api/store/internal-notification/getOneNotification", data)
			.then((res) => {
				const data = res.data;
				if (data.length > 0) {
					setNotification(data[0]);
				}
			})
			.catch((error) => console.log(error));
	},[inId]);

	function Delete(){	
		alertDialog("Bạn có chắc muốn xóa thông báo nội bộ này ?",()=>{run()})

		function run(){
			const data = {
				id: inId,
				token:getSavedToken(),
			}
			axios.post('/api/store/internal-notification/removeInterNoti', data)
				.then(res => {
					const {message} = res.data;
					if (res.status === 200) {
						toast.success(message)
						router.push(InternalNotificationDir(storeId))
					}else{
						toast.error(message)
					}
			
				})
				.catch(error => console.log(error));
		}
	}
	return (
		<div className={styles.page}>
			<NavBar />
			<h3 className={styles.title}>Thông báo nội bộ</h3>
			{notification && (
				<div className={styles.Notification}>
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
							{editable && (
								<>
								<Link href={EditInternalNotificationDir(storeId,inId)}>
									<button className="btn btn-outline-primary btn-sm ml-1">
										Chỉnh sửa
									</button>
								</Link>
								<button onClick={Delete} className="btn btn-outline-danger btn-sm ml-1">Xóa</button>
								</>
								
							)}
						</div>
					</div>
					<DisplayContent content={notification.content} />
				</div>
			)}
		</div>
	);
}
