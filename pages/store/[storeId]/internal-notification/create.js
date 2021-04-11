import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import {toast} from 'react-toastify';


import NavBar from "../../../../components/StoreNavBar";
import RichTextEditor, {
	DisplayContent,
} from "../../../../components/RichTextEditor";
import styles from "../../../../styles/create-internal.module.css";
import { StoreContext } from "../../../../components/StoreContext";
import {InternalNotificationDir} from '../../../../components/Const';

export default function create() {
	const router = useRouter();
	const { storeId } = router.query;
	const { reloadToken, getSavedToken } = React.useContext(StoreContext);

    const [isLoading,setIsloading] = React.useState(false);


	const RichRef = React.createRef(null);
	function onSubmit() {
        setIsloading(true);
		const value =
			(RichRef && RichRef.current && RichRef.current.getValue()) || "";
		const data = {
			value: value,
			token: getSavedToken(),
			storeid: storeId,
		};
		axios
			.post("/api/store/internal-notification/api-create", data)
			.then((res) => {
				const {message} = res.data;
                if(res.status === 200){
                    toast.success(message);
					reloadToken();
                    router.push(InternalNotificationDir(storeId))
                }else{
                    toast.error(message);
                }
                setIsloading(false);

			})
			.catch((error) => console.log(error));
	}
	return (
		<div className={styles.layout}>
			<NavBar />
			<h3 className={styles.title}>Tạo thông báo mới</h3>
			<div className={styles.formContent}>
				<RichTextEditor ref={RichRef} />
				<div className={styles.buttonSpace}>
					<button disabled={isLoading} type="button" className="btn btn-primary" onClick={onSubmit}>
						Xác nhận
					</button>
				</div>
			</div>
		</div>
	);
}
