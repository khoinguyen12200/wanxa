import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {toast } from 'react-toastify';
import { Loading, CanNotAccess } from "../../../../components/Pages";
import styles from "../../../../styles/my-invite.module.css";
import { StoreContext } from "../../../../components/StoreContext";
import {Direction} from "../../../../components/Const";
export default function index() {
	const router = useRouter();
	const { inviteId } = router.query;

	const [invitation, setInvitation] = React.useState(null);
	React.useEffect(() => {
		getInvitation()
	}, [inviteId]);
    function getInvitation(){
        if (inviteId == null) return;
		const data = {
			id: inviteId,
		};
		axios
			.post("/api/user/get-invitation", data)
			.then((res) => {
				if (res.status === 200) {
					setInvitation(res.data);
				}
			})
			.catch((error) => console.log(error));
    }

	const { getUserId, state, getSavedToken, reloadToken } = React.useContext(
		StoreContext
	);

	const [access, setAccess] = React.useState(0);
	React.useEffect(() => {
		const userid = getUserId();
		const destination = invitation ? invitation.destination : null;
		if (userid == destination && userid != null) {
			setAccess(1);
		} else {
			setAccess(-1);
		}
	}, [state, invitation]);

	function submitAgree() {
		const data = {
			token: getSavedToken(),
			id: inviteId,
			state: 1,
		};
        console.log(data)
		axios
			.post("/api/user/update-state-invitation", data)
			.then((res) => {
                const {message} = res.data;
				if (res.status === 200) {
                    toast.success(message);
					reloadToken();
                    getInvitation();
                    const storeId = invitation ? invitation.storeid : null;
                    if(storeId){
                        router.push(Direction.Store(storeId))
                    }
				}else{
                    toast.error(message)
                }
			})
			.catch((error) => console.log(error));
	}
	function submitRefuse() {
		const data = {
			token: getSavedToken(),
			id: inviteId,
			state: -1,
		};
		axios
			.post("/api/user/update-state-invitation", data)
			.then((res) => {
                const {message} = res.data;
				if (res.status === 200) {
                    toast.success(message);
					getInvitation();
				}else{
                    toast.error(message)
                }
			})
			.catch((error) => console.log(error));
	}

	if (access == 0) {
		return <Loading />;
	}
	if (access == -1) {
		return <CanNotAccess />;
	}

	return (
		<div className={styles.page}>
			<h3 className={styles.title}>L???i m???i</h3>
			<div className={styles.detail}>
				<p className={styles.paragraph}>
					{invitation.executorName} ???? m???i b???n l??m th??nh vi??n c???a c???a
					h??ng {invitation.storeName}
				</p>
				<div className={styles.buttonSpace}>
					{invitation.state == 0 && (
						<>
							<button onClick={submitAgree} className="btn btn-primary m-2">
								?????ng ??
							</button>
							<button onClick={submitRefuse} className="btn btn-danger m-2">
								T??? ch???i
							</button>
						</>
					)}
					{invitation.state == 1 && (
						<button className="btn btn-primary m-2" disabled>
							???? ?????ng ??
						</button>
					)}
					{invitation.state == -1 && (
						<button className="btn btn-danger m-2" disabled>
							???? t??? ch???i
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
