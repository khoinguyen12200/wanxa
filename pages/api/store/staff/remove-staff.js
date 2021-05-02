import query from "../../const/connection";

import { getPrivileges } from "../../const/querySample";
import Privileges from "../../../../components/Privileges";
export default async function index(req, res) {
	const { staffid } = req.body;

	const { storeid, userid, privileges } = req.headers;

	const isPerformerOwner = Privileges.isValueIncluded(privileges, [
		Privileges.Content.OWNER,
	]);
	const isPerformerHRM = Privileges.isValueIncluded(privileges, [
		Privileges.Content.HRM,
	]);

	var targetPrivileges = await getPrivileges(staffid, storeid); // gia tri privileges cu~
	const isTargetOwner = Privileges.isValueIncluded(targetPrivileges, [
		Privileges.Content.OWNER,
	]);

	if (isPerformerOwner || (isPerformerHRM && !isTargetOwner)) {
		const deleteRes = await query(
			"DELETE FROM `privileges` WHERE userid = ? and storeid =?",
			[staffid, storeid]
		);
		res.status(200).json({ message: "Xóa nhân viên thành công" });
		return;
	} else {
		res.status(202).json({ message: "Bạn không đủ quyền để thay đổi" });
		return;
	}
}
