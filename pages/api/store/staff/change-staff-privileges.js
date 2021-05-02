import query from "../../const/connection";
import {getPrivileges} from '../../const/querySample'
import Privileges from "../../../../components/Privileges";
export default async function index(req, res) {
	const { staffid,staffPrivileges } = req.body;

	const { privileges, userid, storeid } = req.headers;
	const destinationPri = await getPrivileges(staffid, storeid);

	const isPrivilegesOwnerChange =
		Privileges.isValueIncluded(staffPrivileges, [
			Privileges.Content.OWNER,
		]) !=
		Privileges.isValueIncluded(destinationPri, [Privileges.Content.OWNER]);


	if(Privileges.isValueIncluded(privileges, [Privileges.Content.OWNER])){
		accepted();
	}else if(Privileges.isValueIncluded(privileges, [Privileges.Content.FACILITY])){
		if(!isPrivilegesOwnerChange) {
			accepted();
		}else{
			rejected();
		}
	}else{
		rejected();
	}
		

	function accepted() {
		const changeResult = query(
			"UPDATE `privileges` SET `value`=? WHERE storeid =? and userid =?",
			[staffPrivileges, storeid, staffid]
		);
		res.status(200).json({
			message: "Thay đổi quyền nhân viên hoàn tất",
		});
		return;
	}

	function rejected() {
		res.status(401).send({ message: "Bạn không đủ quyền để thay đổi" });
		return;
	}
}
