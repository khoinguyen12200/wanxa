import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {toast} from 'react-toastify'





import StoreContext from "../../../../../components/StoreContext";
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
	const { storeId,tableId } = router.query;

	const [menuGroups, setMenuGroups] = React.useState([]);
	React.useEffect(() => {
		if (storeId == null) return;
		const data = {
			storeid: storeId,
		};
		axios
			.post("/api/store/real-time/getMenu", data)
			.then((res) => {
				if (res.status === 200) {
					var groups = res.data;
					groups = groups.map((group) => {
						var newGroup = group;

						var items = group.items;
						items = items.map((item) => {
							var newItem = item;
							item.ammount = 0;
							return newItem;
						});
						newGroup.items = items;
						return newGroup;
					});
					setMenuGroups(groups);
				}
			})
			.catch((error) => console.log(error));
	}, [storeId]);

	function addItem(itemid, value) {
		var newG = menuGroups.concat([]);

		for (let i in newG) {
			var items = newG[i].items;
			for (let j in items) {
				var item = items[j];
				if (item.id == itemid) {
					const temp = item.ammount + value;
					item.ammount = temp < 0 ? 0 : temp;
				}
			}
		}
		setMenuGroups(newG);
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
				{menuGroups.map(function (group) {
					return (
						<Group addItem={addItem} group={group} key={group.id} />
					);
				})}
			</div>
			<div className={styles.btnSpace}>
				<SubmitModal groups={menuGroups} />
			</div>
		</div>
	);
}

const SubmitModal = ({ groups }) => {
    const router = useRouter();
	const { storeId,tableId } = router.query;

	const items = React.useMemo(() => {
		if (groups == null || groups.length == 0) {
			return [];
		}
		const arr = [];
		for (let i in groups) {
			const group = groups[i];
			for (let j in group.items) {
				const item = group.items[j];
				if (item.ammount > 0) {
					arr.push(item);
				}
			}
		}
		return arr;
	}, [groups]);

    const [note,setNote] = React.useState('');
	const [modal, setModal] = React.useState(false);


	const toggle = () => setModal(!modal);

    function submit(){
        const list = [];
        for(let i in items){
            const item = items[i];
            for(let j = 0 ;j<item.ammount;j++){
                list.push(item.id)
            }
        }
        const data = {
            storeid:storeId,
            tableid:tableId,
            note:note,
            list:list
        }
        axios.post('/api/store/real-time/create-bill', data)
            .then(res => {
                const {message} = res.data;
                if (res.status === 200) {
                    toast.success(message);
                    toggle();
                }else{
                    toast.error(message);
                }
        
            })
            .catch(error => console.log(error));
    }

	return (
		<div>
			<Button color="btn btn-primary" onClick={toggle} disabled={items == 0}>
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
											<th scope="row">{index+1}</th>
											<td>{item.name}</td>
											<td>{item.ammount}</td>
											<td>{numberWithCommas(price)}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
                        <div className={styles.noteSpace}>
                            <label>Ghi chú</label>
                            <textarea className="form-control" value={note} onChange={e=>setNote(e.target.value)}/>
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

function Group({ group, addItem }) {
	const { items, name } = group;
	return (
		<div className={styles.group}>
			<div className={styles.groupName}>{group.name}</div>
			<div className={styles.items}>
				{items.map(function (item) {
					return <Item addItem={addItem} item={item} key={item.id} />;
				})}
			</div>
		</div>
	);
}

function Item({ item, addItem }) {
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
							addItem(item.id, -1);
						}}
						className="btn btn-secondary btn-sm"
					>
						-
					</button>
					<span
						className={
							(item.ammount == 0
								? "badge-secondary"
								: "badge-success") +
							" badge " +
							styles.number
						}
					>
						<div>{item.ammount}</div>
					</span>
					<button
						onClick={() => {
							addItem(item.id, +1);
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
