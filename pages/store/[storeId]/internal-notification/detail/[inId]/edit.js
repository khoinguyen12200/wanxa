import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {toast} from 'react-toastify';

import {
	InternalNotificationDir
} from "../../../../../../components/Const";
import NavBar from "../../../../../../components/StoreNavBar";
import RichTextEditor from "../../../../../../components/RichTextEditor";
import styles from "../../../../../../styles/edit-inter-noti.module.css";
import { StoreContext } from "../../../../../../components/StoreContext";
import Notification from "../../../../../../components/Notification";
import {alertDialog} from '../../../../../../components/Modal';


export default function edit() {
	const [notification, setNotification] = React.useState(null);
    const EditorRef = React.useRef(null);
    
	const router = useRouter();
	const { storeId, inId } = router.query;

	const { state, getSavedToken } = React.useContext(StoreContext);
	React.useEffect(() => {
		const data = {
			id: inId,
		};

		axios
			.post("/api/store/internal-notification/getOneNotification", data)
			.then((res) => {
				const results = res.data;
				if (results.length > 0) {
					setNotification(results[0]);
				}
			})
			.catch((error) => console.log(error));
	},[inId]);

    function Submit(){
        alertDialog("Bạn có chắc muốn lưu lại bản chỉnh sửa này ?",()=>{
            run();
        });
        function run(){
            const value = EditorRef ? EditorRef.current.getValue() : null
            const data = {
                id: inId,
                value:value,
                token:getSavedToken(),
            };
    
            axios
                .post("/api/store/internal-notification/updateInterNoti", data)
                .then((res) => {
                    const {message} = res.data;
                    if(res.status === 200){
                        toast.success(message);
                        router.push(InternalNotificationDir(storeId))
                    }else{
                        toast.error(message)
                    }
                })
                .catch((error) => console.log(error));
        }
    }

	return (
		<div className={styles.page}>
			<NavBar />
            <div className={styles.mainEditor}>
                <h3 className={styles.title}>Chỉnh sửa thông báo</h3>
                <RichTextEditor ref={EditorRef} defaultHTML={notification ? notification.content : ""}/>
                <div className={styles.buttonSpace}>
                    <button className="btn btn-primary m-2" onClick={Submit}>Lưu lại</button>
                </div>
            </div>
		</div>
	);
}
