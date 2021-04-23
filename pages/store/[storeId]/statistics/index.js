import React from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";

import Navbar from "../../../../components/MultiLevelNavbar";
import styles from "../../../../styles/statistics.module.css";
import { useStoreStaff } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import { CanNotAccess } from "../../../../components/Pages";

var dateFormat = require("dateformat");

const backColor = [
	"rgba(255, 99, 132, 0.2)",
	"rgba(54, 162, 235, 0.2)",
	"rgba(255, 206, 86, 0.2)",
	"rgba(75, 192, 192, 0.2)",
	"rgba(153, 102, 255, 0.2)",
	"rgba(255, 159, 64, 0.2)",
];
const borderColor = [
	"rgba(255, 99, 132, 1)",
	"rgba(54, 162, 235, 1)",
	"rgba(255, 206, 86, 1)",
	"rgba(75, 192, 192, 1)",
	"rgba(153, 102, 255, 1)",
	"rgba(255, 159, 64, 1)",
];

function getBackArr(length) {
	let arr = [];
	let current = 0;
	for (let i = 0; i < length; i++) {
		arr.push(backColor[current]);
		current++;
		if (current == backColor.length) {
			current = 0;
		}
	}
	return arr;
}
function getBorderArr(length) {
	let arr = [];
	let current = 0;
	for (let i = 0; i < length; i++) {
		arr.push(borderColor[current]);
		current++;
		if (current == borderColor.length) {
			current = 0;
		}
	}
	return arr;
}

export default function index() {
	const [access, setAccess] = React.useState(0);
	const [options, setOptions] = React.useState({
		fromTime: null,
		toTime: null,
		unit: "date",
		type: 2, // 1->tong doanh tu ; 2->tung mon
	});
	const myformat = React.useMemo(() => {
		switch (options.unit) {
			case "date":
				return "dd/mm/yyyy";
			case "month":
				return "mm/yyyy";
			case "year":
				return "yyyy";
		}

		return "dd/mm/yyyy";
	}, [options.unit]);
	const [data, setData] = React.useState([]);

	const Chart = React.useMemo(() => {
		if (data == null) return null;
		if (options.type == 1) {
			return Chart1();
		} else {
			return Chart2();
		}
	}, [data]);
	function Chart2() {
		if(data == null) return null;
		console.log(data)
		const chartData = {
			labels: data.map((item) => item.name),
			datasets: [
				{
					label: "Tính theo từng món",
					data: data.map((item) => item.count * item.price),
					backgroundColor: getBackArr(data.length),
					borderColor: getBorderArr(data.length),
					borderWidth: 1,
				},
			],
		};
		const chartOptions = {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
			},
		};
		return <Bar data={chartData} options={chartOptions} />;
	}
	function Chart1() {
		const labels = data.map((item) => FormatDateTime(item.unit));
		const datasets = [
			{
				label: "Tổng doanh thu",
				data: data.map((item) => item.sum),
				fill: false,
				backgroundColor: "rgb(255, 99, 132)",
				borderColor: "rgba(255, 99, 132, 0.2)",
			},
		];
		const chartData = {
			labels,
			datasets,
		};
		const chartOptions = {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
			},
		};
		return <Line data={chartData} options={chartOptions} />;
	}

	function FormatDateTime(date) {
		return dateFormat(date, myformat);
	}

	React.useEffect(() => {
		fetchData();
	}, [options]);

	function fetchData() {
		if (options == null) {
			return;
		}
		axios
			.post("/api/store/statistics/get-data", options)
			.then((res) => {
				if (res.status === 200) {
					setData(res.data);
				}
			})
			.catch((error) => console.log(error));
	}
	useStoreStaff((value) => {
		if (
			Privileges.isValueIncluded(value, [
				Privileges.Content.OWNER,
				Privileges.Content.STATISTICS,
			])
		) {
			setAccess(1);
		} else {
			setAccess(0);
		}
	});

	if (access == 0) {
		return <CanNotAccess />;
	}
	return (
		<div>
			<Navbar />
			<h3 className={styles.title}>Thống kê</h3>

			<OptionBar options={options} setOptions={setOptions} />
			<div className="p-2">{Chart}</div>
		</div>
	);
}

function OptionBar({ options, setOptions }) {
	return (
		<div className={styles.OptionBar}>
			<div className="input-group mb-2 ml-2 w-auto">
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
			<div className="input-group mb-2 ml-2 w-auto">
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

			<div className="input-group mb-2 ml-2 w-auto">
				<div className="input-group-prepend">
					<label
						className="input-group-text"
						forhtml="groupselectunit"
					>
						Đơn vị
					</label>
				</div>
				<select
					value={options.unit}
					onChange={(e) => {
						setOptions({ ...options, unit: e.target.value });
					}}
					className="custom-select"
					id="groupselectunit"
				>
					<option value="date">Ngày</option>
					<option value="month">Tháng</option>
					<option value="year">Năm</option>
				</select>
			</div>
			<div className="input-group  mb-2 ml-2 w-auto">
				<div className="input-group-prepend">
					<label className="input-group-text">Cách tính</label>
				</div>
				<select
					value={options.type}
					onChange={(e) =>
						setOptions({ ...options, type: e.target.value })
					}
					className="custom-select"
				>
					<option value="1">Tổng doanh thu</option>
					<option value="2">Theo từng món</option>
				</select>
			</div>
		</div>
	);
}
