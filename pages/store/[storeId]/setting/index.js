import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Navbar from "../../../../components/MultiLevelNavbar";
import styles from "../../../../styles/setting.module.css";
import SettingContext from "../../../../components/SettingContext";
import { useStoreStaff } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import { CanNotAccess } from "../../../../components/Pages";

export default function index() {
	const {
		realTimeSetting,
		setRealTimeSetting,
		action,
		SETTING,
	} = React.useContext(SettingContext);


	const [access, setAccess] = React.useState(-1);
	useStoreStaff((value) => {
		setAccess(value);
	});
	if (access < 0) {
		return <CanNotAccess />;
	}

	return (
		<div>
			<Navbar />
			<h3 className={styles.title}>Cài đặt thông báo</h3>

			<div className="p-3">
				<table className="table table-bordered">
					<tbody>
						{realTimeSetting.map((setting, index) => (
							<SettingItem setting={setting} key={setting} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function SettingItem({ setting }) {
	const {
		realTimeSetting,
		setRealTimeSetting,
		action,
		SETTING,
	} = React.useContext(SettingContext);

	const [modal, setModal] = React.useState(false);
	const toggle = () => setModal(!modal);

	const secondary = "btn p-3 mb-2 bg-secondary text-white w-100";
	const primary = "btn p-3 mb-2 bg-primary text-white w-100";

	const stateArr = React.useMemo(() => {
		let arr = [];
		for (let i = 0; i < SETTING.STATE.length; i++) {
			arr.push(i);
		}
		return arr;
	}, [SETTING]);

	return (
		<>
			<tr onClick={toggle}>
				<td>{SETTING.getTypeName(setting[0])}</td>
				<td>{SETTING.getStateName(setting[1])}</td>
				<Modal isOpen={modal} toggle={toggle} centered>
					<ModalHeader toggle={toggle}>
						{SETTING.getTypeName(setting[0])}
					</ModalHeader>
					<ModalBody>
						{stateArr.map((state) => (
							<div
								onClick={() => {
									action.updateSetting([setting[0]], state);
									toggle();
								}}
								key={state}
								className={
									state == setting[1] ? primary : secondary
								}
							>
								{SETTING.getStateName(state)}
							</div>
						))}
					</ModalBody>
				</Modal>
			</tr>
		</>
	);
}
