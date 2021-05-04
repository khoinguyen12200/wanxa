import React from "react";
import { useRouter } from "next/router";
import axios from "axios";

import styles from "../../../../styles/bills.module.css";
import NavBar from "../../../../components/MultiLevelNavbar";
import { StoreContext } from "../../../../components/StoreContext";
import {
	useStoreStaff,
	FormatDateTime,
	numberWithCommas,
} from "../../../../components/Const";
import { CanNotAccess } from "../../../../components/Pages";



const LIMIT = 1;

export default function index() {
	const router = useRouter();
	const { storeId } = router.query;

	const [firstRender, setFirstRender] = React.useState(true);

	const [access, setAccess] = React.useState(false);
	useStoreStaff((value) => {
		setAccess(value);
	});

	const { state } = React.useContext(StoreContext);
	const [bills, setBills] = React.useState([]);
	React.useEffect(() => {
		if (storeId != null) {
			firstFetch();
		}
	}, [storeId]);

	function xemthem() {
		if (storeId == null) return;
		const data = {
			storeid: storeId,
			limit: LIMIT,
			offset: bills.length,
			options: options,
		};
		console.log(data);
		axios
			.post("/api/store/bills/get-bills", data)
			.then((res) => {
				if (res.status === 200) {
					const newArr = bills.concat(res.data);
					setBills(newArr);
				}
			})
			.catch((error) => console.log(error));
	}
	function firstFetch() {
		setFirstRender(false);
		if (storeId == null) return;
		const data = {
			storeid: storeId,
			limit: LIMIT,
			offset: 0,
			options: options,
		};
		console.log(data);
		axios
			.post("/api/store/bills/get-bills", data)
			.then((res) => {
				if (res.status === 200) {
					console.log(res.data);
					setBills(res.data);
				}
			})
			.catch((error) => console.log(error));
	}

	const [options, setOptions] = React.useState({
		fromTime: null,
		toTime: null,
	});
	React.useEffect(() => {
		if (firstRender) return;
		firstFetch();
	}, [options]);

	if (access < 0) return <CanNotAccess />;
	return (
		<div>
			<NavBar />
			<h3 className={styles.title}>Hóa đơn</h3>
			<OptionBar options={options} setOptions={setOptions} />
			<div className={styles.container}>
				{bills.map((bill) => (
					<Bill bill={bill} key={bill.id} />
				))}
				<div className="d-flex justify-content-center p-3">
					<button
						onClick={xemthem}
						className="btn btn-outline-primary"
					>
						Xem thêm
					</button>
				</div>
			</div>
		</div>
	);
}

function OptionBar({ options, setOptions }) {
	return (
		<div className={styles.OptionBar}>
			<div className="input-group mb-3 ml-3 w-auto">
				<div className="input-group-prepend">
					<span className="input-group-text">Từ ngày</span>
				</div>
				<input
					type="datetime-local"
					className="form-control"
					placeholder="date"
					onChange={(e) =>
						setOptions({ ...options, fromTime: e.target.value })
					}
				/>
			</div>
			<div className="input-group mb-3 ml-3 w-auto">
				<div className="input-group-prepend">
					<span className="input-group-text">Đến ngày</span>
				</div>
				<input
					type="datetime-local"
					className="form-control"
					placeholder="date"
					onChange={(e) =>
						setOptions({ ...options, toTime: e.target.value })
					}
				/>
			</div>
		</div>
	);
}

function Bill({ bill }) {
	const { state } = React.useContext(StoreContext);

	const facility = React.useMemo(() => {
		return state.facility;
	}, [state]);

	function getTableName(id) {
		for (let i in facility) {
			const group = facility[i];
			for (let j in group.tables) {
				const table = group.tables[j];
				if (table.id == id) {
					return table.name;
				}
			}
		}
		return id;
	}
	return (
		<div className="card">
			<div className="card-header">Hóa đơn số #{bill.id}</div>
			<div className="card-body ">
				<table className="table table-bordered">
					<tbody>
						<tr>
							<td>Bàn</td>
							<td>{getTableName(bill.tableid)}</td>
						</tr>
						<tr>
							<td>Giờ khởi tạo</td>
							<td>{FormatDateTime(bill.time)}</td>
						</tr>
						<tr>
							<td>Giờ thanh toán</td>
							<td>{FormatDateTime(bill.paytime)}</td>
						</tr>
						<tr>
							<td>Ghi chú</td>
							<td>{bill.note}</td>
						</tr>
					</tbody>
				</table>
				<div style={{ fontSize: "0.9em" }}>
					<table className="table table-striped table-bordered">
						<thead>
							<tr>
								<th scope="col">#STT</th>
								<th scope="col">Tên món</th>
								<th scope="col">Người thực hiện</th>
								<th scope="col">Giá</th>
							</tr>
						</thead>
						<tbody>
							{bill.rows.map((row, index) => (
								<tr key={row.id}>
									<th scope="row">{index + 1}</th>
									<td>{row["menu-name"]}</td>
									<td>{row["barista-name"]}</td>
									<td>{numberWithCommas(row.price)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="alert alert-primary" role="alert">
						Tổng: {numberWithCommas(bill.price)}
					</div>
				</div>
			</div>
		</div>
	);
}
