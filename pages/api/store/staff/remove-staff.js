import query from "../../const/connection";

import {
	getUserIdByToken,

	getPrivileges,
} from "../../const/querySample";
import Privileges from '../../../../components/Privileges';
export default async function index(req, res) {
	const { userid, token, storeid } = req.body;

	const performerId = await getUserIdByToken(token);

	var performerPrivileges = await getPrivileges(performerId, storeid);
	const isPerformerOwner = Privileges.isValueIncluded(performerPrivileges,[Privileges.Content.OWNER]);
	const isPerformerHRM = Privileges.isValueIncluded(performerPrivileges,[Privileges.Content.HRM]);


	var targetPrivileges = await getPrivileges(userid, storeid); // gia tri privileges cu~
	const isTargetOwner = Privileges.isValueIncluded(targetPrivileges,[Privileges.Content.OWNER]);

	if(isPerformerOwner || (isPerformerHRM && !isTargetOwner)){
		const deleteRes = await query("DELETE FROM `privileges` WHERE userid = ? and storeid =?",[userid,storeid]);
        res.status(200).json({ message: "Xóa nhân viên thành công" });
		return;
	}else{
		res.status(202).json({ message: "Bạn không đủ quyền để thay đổi" });
		return;
	}

}
