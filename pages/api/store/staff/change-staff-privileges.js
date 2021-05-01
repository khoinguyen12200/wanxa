import query from "../../const/connection";
import formParse from "../../const/form";
import { getUserIdByToken, getPrivileges } from "../../const/querySample";
import Privileges from "../../../../components/Privileges";
import {getUserId} from '../../const/jwt'
export default async function index(req, res) {
	const { userid, privileges,  storeid } = req.body;
	const executorId = getUserId(req)

	const executorPri = await getPrivileges(executorId, storeid);

	const destinationPri = await getPrivileges(userid, storeid);
	const isPrivilegesOwnerChange =
		Privileges.isValueIncluded(destinationPri, [
			Privileges.Content.OWNER,
		]) !=
		Privileges.isValueIncluded(privileges, [Privileges.Content.OWNER]);


	if(Privileges.isValueIncluded(executorPri, [Privileges.Content.OWNER])){
		accepted();
	}else if(Privileges.isValueIncluded(executorPri, [Privileges.Content.FACILITY])){
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
			[privileges, storeid, userid]
		);
		res.status(200).json({
			message: "Thay đổi quyền nhân viên hoàn tất",
		});
		return;
	}

	function rejected() {
		res.status(202).json({ message: "Bạn không đủ quyền để thay đổi" });
		return;
	}
}
