import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import {
	useStoreStaff,
	Direction,
	getTimeBefore,
	numberWithCommas,
} from "../../../../../../components/Const";
import { CanNotAccess } from "../../../../../../components/Pages";
import Privileges from "../../../../../../components/Privileges";
import { alertDialog } from "../../../../../../components/Modal";
import { StoreContext } from "../../../../../../components/StoreContext";
import Nav from "../../../../../../components/MultiLevelNavbar";
import styles from "../../../../../../styles/manage-bill.module.css";
export default function index() {
	const { state } = React.useContext(StoreContext);
	const { bills, facility, staff } = React.useMemo(() => {
		return state;
	}, [state]);

	const router = useRouter();
	const { bill_id } = router.query;

	const [access, setAccess] = React.useState(0);
	useStoreStaff((value) => {
		if (
			Privileges.isValueIncluded(value, [
				Privileges.Content.OWNER,
				Privileges.Content.WAITER,
			])
		) {
			setAccess(1);
		} else {
			setAccess(0);
		}
	});

	if (access == 0) return <CanNotAccess />;
	return (
		<div className={styles.page}>
			<Nav />
			<h3 className={styles.title}>Quản lý hóa đơn</h3>
			<div className={styles.container}>
				{bills.map(
					(bill) =>
						bill.id == bill_id && <Bill bill={bill} key={bill.id} />
				)}
			</div>
		</div>
	);
}

function Bill({ bill }) {
	const router = useRouter();
	const { storeId } = router.query;
	const {
		state,
		getMenuById,
		getSavedToken,
		requestUpdateBills,
	} = React.useContext(StoreContext);
	const { facility } = React.useMemo(() => {
		return state;
	}, [state]);

	const items = React.useMemo(() => {
		return bill.items;
	}, [bill]);
	const total = React.useMemo(() => {
		var sum = 0;
		for (let i in items) {
			const billRow = items[i];
			const menuItem = getMenuById(billRow["menu-item-id"]);
			sum += menuItem.price;
		}
		return sum;
	}, [items]);

	const hasUnDoneRow = React.useMemo(() => {
		for (let i in items) {
			const billRow = items[i];
			if (billRow.state == 0) return true;
		}
		return false;
	}, [items]);

	function getTableName(tableid) {
		for (let i in facility) {
			const group = facility[i];
			for (let j in group.tables) {
				if (group.tables[j].id === tableid) {
					return group.name + " / " + group.tables[j].name;
				}
			}
		}
		return "";
	}
	function handleSubmit() {
		alertDialog(
			`Thanh toán hóa đơn ${
				items.length
			} món với số tiền là ${numberWithCommas(total)} !`,
			() => {
				const data = {
					token: getSavedToken(),
					id: bill.id,
					note: note,
				};
				axios
					.post("/api/store/real-time/pay-bill", data)
					.then((res) => {
						if (res.status === 200) {
							
							toast.success("Thanh toán thành công");
							router.push(Direction.RealTime(storeId));
							requestUpdateBills();
						}
					})
					.catch((error) => console.log(error));
			}
		);
	}
	const [note, setNote] = React.useState(bill.note);
	React.useEffect(() => {
		setNote(bill.note);
	}, [bill]);

	return (
		<div className="card">
			<div className="card-header">
				{getTableName(bill.tableid)}{" "}
				{bill.state == 0 ? (
					<span className="ml-1 text-warning font-weight-bold">
						Chưa thanh toán
					</span>
				) : (
					<span className="ml-1 text-success font-weight-bold">
						Đã thanh toán
					</span>
				)}
			</div>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Tên</th>
						<th scope="col">Giá</th>
						<th scope="col">Trạng thái</th>
						<th scope="col">Thay đổi</th>
					</tr>
				</thead>
				<tbody>
					{items.map((billRow, index) => (
						<BillRow
							billRow={billRow}
							key={billRow.id}
							index={index + 1}
						/>
					))}
				</tbody>
			</table>
			<div className="d-flex justify-content-center">
				<AddMenuItem />
			</div>
			<div className="card-body">
				<div>
					<h6>Tổng hóa đơn</h6>
					<p>{numberWithCommas(total)}</p>
				</div>
				<div>
					<p className="mt-1">Ghi chú</p>
					<textarea
						className="form-control"
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
				</div>

				<div className="d-flex mt-2">
					<button
						onClick={handleSubmit}
						disabled={hasUnDoneRow}
						className="btn btn-primary  m-auto"
					>
						Thanh toán
					</button>
				</div>
			</div>
		</div>
	);
}

const AddMenuItem = ({}) => {
	const [modal, setModal] = React.useState(false);

	const toggle = () => setModal(!modal);

	return (
		<div>
			<Button className="btn-sm" color="primary" outline onClick={toggle}>
				Thêm món
			</Button>
			<Modal centered isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Thêm món</ModalHeader>
				<ModalBody>
					<Menu />
				</ModalBody>
				<ModalFooter>
					<Button className="mr-1" color="primary" onClick={toggle}>
						Thêm
					</Button>
					<Button color="secondary" onClick={toggle}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

function Menu() {
	const { state } = React.useContext(StoreContext);
	const { menu } = state;
	return (
		<div>
			{menu.map((group) => (
				<Group group={group} key={group.id} />
			))}
		</div>
	);
}

function Group({ group }) {
	return (
		<div>
			<div className="card mb-3">
				<div className="card-header">{group.name}</div>
				<div className="card-body">
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Tên món</th>
								<th scope="col">Giá</th>
								<th scope="col">Thêm</th>
							</tr>
						</thead>
						<tbody>
							{group.items.map((item, index) => (
								<Item key={item.id} item={item} index={index} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
function Item({ item, index }) {
	const router = useRouter();
	const { bill_id } = router.query;

    const {requestUpdateBills,getSavedToken} = React.useContext(StoreContext);

    const [loading,setLoading] =React.useState(false);

    function onAdd(){
        setLoading(true);
        const data = {
            token:getSavedToken(),
            bill_id : bill_id,
            menu_item_id:item.id
        }
        axios.post('/api/store/real-time/add-bill-row', data)
            .then(res => {
                if (res.status === 200) {
                    toast.success("Đã thêm thành công")
                    requestUpdateBills();
                    setLoading(false)
                }
        
            })
            .catch(error => console.log(error));
    }
	return (
		<tr>
			<th scope="row">{index + 1}</th>
			<td>{item.name}</td>
			<td>{numberWithCommas(item.price)}</td>
			<td>
				<button disabled={loading} onClick={onAdd} className="btn btn-sm btn-outline-primary">Thêm</button>
			</td>
		</tr>
	);
}

function BillRow({ billRow, index }) {
	const { state, requestUpdateBills, getSavedToken } = React.useContext(
		StoreContext
	);
	const { menu } = React.useMemo(() => {
		return state;
	}, [state]);

	const menuItem = React.useMemo(() => {
		for (let i in menu) {
			const group = menu[i];
			for (let j in group.items) {
				const item = group.items[j];
				if (item.id == billRow["menu-item-id"]) {
					return item;
				}
			}
		}
		return { name: "" };
	});

	function handleDelete() {
		alertDialog("Bạn có chắc muốn xóa món này ?", () => {
			const data = {
				token: getSavedToken(),
				id: billRow.id,
			};
			axios
				.post("/api/store/real-time/delete-bill-row", data)
				.then((res) => {
					if (res.status === 200) {
						requestUpdateBills();
					}
				})
				.catch((error) => console.log(error));
		});
	}

	return (
		<tr>
			<th scope="row">{index}</th>
			<td>{menuItem.name}</td>
			<td>{numberWithCommas(menuItem.price || 0)}</td>
			<td>
				{billRow.state == 0 ? (
					<span className="btn-sm text-secondary">
						Đang đợi thực hiện
					</span>
				) : billRow.state == 1 ? (
					<span className="btn-sm text-warning ">Đang thực hiện</span>
				) : (
					<span className="btn-sm text-success">Đã xong</span>
				)}
			</td>
			<td>
				<button
					onClick={handleDelete}
					disabled={billRow.state != 0}
					className="btn btn-sm btn-danger"
				>
					Xóa
				</button>
			</td>
		</tr>
	);
}
