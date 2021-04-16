import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

import { StoreContext } from "../../../../../components/StoreContext";
import Nav from "../../../../../components/MultiLevelNavbar";
import styles from "../../../../../styles/realtime-create-bill.module.css";
import {
	useStoreStaff,
	Direction,
	numberWithCommas,
} from "../../../../../components/Const";
import { CanNotAccess } from "../../../../../components/Pages";

export default function createBill() {
	const router = useRouter();
	const { storeId, tableId } = router.query;

	const { state } = React.useContext(StoreContext);
	const menu = React.useMemo(() => {
		return state ? state.menu : [];
	}, [state]);

	const [selected, setSelected] = React.useState([]);

	function addSelected(id) {
		setSelected([...selected, id]);
	}
	function removeSelected(id) {
		var temp = selected;
		const index = temp.indexOf(id);
		if (index > -1) {
			temp.splice(index, 1);
			
		}
		temp = temp.concat([])
		setSelected(temp);
	}

	const [access, setAccess] = React.useState(-1);
	useStoreStaff((value) => {
		if (value < 0) {
			setAccess(-1);
		} else {
			setAccess(1);
		}
	});

	if (access == -1) return <CanNotAccess />;
	return (
		<div>
			<Nav />
			<h3 className={styles.title}>Tạo hóa đơn mới</h3>
			<div className={styles.meu}>
				{menu.map(function (group) {
					return (
						<Group
							group={group}
							key={group.id}
							selected={selected}
							addSelected={addSelected}
							removeSelected={removeSelected}
						/>
					);
				})}
			</div>
			<div className={styles.btnSpace}>
				<SubmitModal menu={menu} selected={selected} />
			</div>
		</div>
	);
}

const SubmitModal = ({ menu, selected }) => {
	const router = useRouter();
	const { storeId, tableId } = router.query;

	const items = React.useMemo(() => {
		if (menu == null || menu.length == 0 || selected.length == 0) {
			return [];
		}
		const arr = [];
		for (let i in menu) {
			const group = menu[i];
			for (let j in group.items) {
				var item = group.items[j];
				const ammount = getOccurrence(selected, item.id);
				if (ammount == 0) continue;
				item.ammount = ammount;
				arr.push(item);
			}
		}
		return arr;
	}, [menu, selected]);
	const total = React.useMemo(() => {
		var sum = 0;
		items.forEach((item) => {
			sum += item.price * item.ammount;
		});
		return sum;
	}, [items]);

	function getOccurrence(array, value) {
		var count = 0;
		array.forEach((v) => v === value && count++);
		return count;
	}

	const [note, setNote] = React.useState("");
	const [modal, setModal] = React.useState(false);

	const toggle = () => setModal(!modal);

	function submit() {
		const list = [];
		for (let i in items) {
			const item = items[i];
			for (let j = 0; j < item.ammount; j++) {
				list.push(item.id);
			}
		}
		const data = {
			storeid: storeId,
			tableid: tableId,
			note: note,
			list: list,
		};
		axios
			.post("/api/store/real-time/create-bill", data)
			.then((res) => {
				const { message } = res.data;
				if (res.status === 200) {
					toast.success(message);
					router.push(Direction.RealTime(storeId))
					toggle();
				} else {
					toast.error(message);
				}
			})
			.catch((error) => console.log(error));
	}

	return (
		<div>
			<Button
				color="btn btn-primary"
				onClick={toggle}
				disabled={items == 0}
			>
				Thêm
			</Button>
			<Modal isOpen={modal} toggle={toggle} centered backdrop="static">
				<ModalHeader toggle={toggle}>Tạo hóa đơn</ModalHeader>
				<ModalBody>
					<div className={styles.submitBody}>
						<p className={styles.submitMessage}>
							Bạn sẽ tạo hóa đơn với các món sau :
						</p>
						<table className="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Tên</th>
									<th scope="col">Số lượng</th>
									<th scope="col">Giá</th>
								</tr>
							</thead>
							<tbody>
								{items.map(function (item, index) {
									const price = item.price * item.ammount;
									return (
										<tr key={index}>
											<th scope="row">{index + 1}</th>
											<td>{item.name}</td>
											<td>{item.ammount}</td>
											<td>{numberWithCommas(price)}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<div className={styles.noteSpace}>
							<div className="mb-3 mt-1">
								<i>Tổng hóa đơn :</i>{" "}
								<b>{numberWithCommas(total)}</b>
							</div>
							<label>Ghi chú</label>
							<textarea
								className="form-control"
								value={note}
								onChange={(e) => setNote(e.target.value)}
							/>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="primary mr-1" onClick={submit}>
						Đồng ý
					</Button>
					<Button color="secondary" onClick={toggle}>
						Hủy
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

function Group({ group, addSelected, removeSelected, selected }) {
	const { items, name } = group;
	return (
		<div className={styles.group}>
			<div className={styles.groupName}>{group.name}</div>
			<div className={styles.items}>
				{items.map(function (item) {
					return (
						<Item
							item={item}
							key={item.id}
							selected={selected}
							addSelected={addSelected}
							removeSelected={removeSelected}
						/>
					);
				})}
			</div>
		</div>
	);
}

function Item({ item, selected, addSelected, removeSelected }) {
	const ammount = React.useMemo(() => {
		var count = 0;
		selected.forEach((id) => id == item.id && count++);
		return count;
	}, [item, selected]);
	return (
		<div className={styles.item}>
			<div className={styles.itemS1}>
				<img src={item.picture || Direction.DefaultMenu} />
			</div>
			<div className={styles.itemS2}>
				<div className={styles.itemInfo}>
					{item.name}
					<span className="badge badge-primary ml-2">
						{numberWithCommas(item.price)}
					</span>
				</div>
				<div className={styles.itemButtons}>
					<button
						onClick={() => {
							removeSelected(item.id);
						}}
						className="btn btn-secondary btn-sm"
					>
						-
					</button>
					<span
						className={
							(ammount == 0
								? "badge-secondary"
								: "badge-success") +
							" badge " +
							styles.number
						}
					>
						<div>{ammount}</div>
					</span>
					<button
						onClick={() => {
							addSelected(item.id);
						}}
						className="btn btn-secondary btn-sm"
					>
						+
					</button>
				</div>
			</div>
		</div>
	);
}
