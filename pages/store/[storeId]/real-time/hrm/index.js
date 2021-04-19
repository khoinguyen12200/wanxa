import React from "react";
import { useRouter } from "next/router";
import axios from "axios";


import Privileges from "../../../../../components/Privileges";
import {Direction,useStoreStaff } from "../../../../../components/Const";
import styles from "../../../../../styles/real-time-hrm.module.css";
import Nav from "../../../../../components/MultiLevelNavbar";
import { StoreContext } from "../../../../../components/StoreContext";
import {CanNotAccess} from "../../../../../components/Pages";

export default function index() {
	const [staffs, setStaffs] = React.useState([]);
	const router = useRouter();
	const { storeId } = router.query;

    const [isHRM,setIsHRM] = React.useState(false);
 	useStoreStaff((value) => {
	
		if(Privileges.isValueIncluded(value,[Privileges.Content.OWNER,Privileges.Content.HRM])){
			setIsHRM(true)
		}else{
			setIsHRM(false)
		}
	});

	const { state } = React.useContext(StoreContext);
	const staff = React.useMemo(() => {
		return state.staff;
	}, [state]);
	React.useEffect(() => {
		if (storeId == null || state.user == null) return;
		axios
			.post("/api/socket/get-current-staffs", { storeid: storeId })
			.then((res) => {
				if (res.status === 200) {
					var arr = res.data;
					arr = arr.filter((value) => value != state.user.id);

					var staffsObject = [];
					for (let i in staff) {
						const st = staff[i];
						if (arr.includes(st.id)) staffsObject.push(st);
					}
					setStaffs(staffsObject);
				}
			})
			.catch((error) => console.log(error));
	}, [storeId, state.user]);

    if(!isHRM) return <CanNotAccess />;
 	return (
		<div>
			<Nav />
			<h3 className={styles.title}>Các thành viên đang online</h3>
			<div className={styles.listContainer}>
				{staffs.length == 0 && (
					<div className="d-flex justify-content-center p-3">
						<div className="alert alert-secondary" role="alert">
							Danh sách trống
						</div>
					</div>
				)}
				{staffs.length > 0 && <ListStaff staffs={staffs} />}
			</div>
		</div>
	);
}

function ListStaff({ staffs }) {
    console.log(staffs);
	return (
		<table className="table">
			<thead className="thead-dark">
				<tr>
					<th scope="col">#id</th>
					<th scope="col">Tên</th>
					<th scope="col">Hình</th>
					<th scope="col">Quyền</th>
				</tr>
			</thead>
			<tbody>
				{staffs.map((staff,index) => (
					<tr>
						<th scope="row">{index + 1}</th>
						<td>{staff.name}</td>
						<td><img className={styles.userAvatar} src={staff.avatar || Direction.DefaultAvatar}/></td>
						<td>{getStringArr(staff.privilege)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);

    function getStringArr(value){
        var arr = Privileges.valueToArray(value);
        arr = arr.map(item => Privileges.ValueToString(item))
        return addString(arr)
    }

    function addString(arr){
        var str='';
        for(let i in arr){
            str += arr[i];
            if(i != arr.length -1){
                str += ', ';
            }
        }
        return str;
    }
}
