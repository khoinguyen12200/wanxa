import query from "../../const/connection";

import {
	getUserIdByToken,
	isUserHasPrivileges,
	PRIVILEAPI,
	getPrivileges,
} from "../../const/querySample";

export default async function index(req, res) {
	const { userid, token, storeid } = req.body;

	const performerId = await getUserIdByToken(token);

	var performerPrivileges = await getPrivileges(performerId, storeid);
	performerPrivileges = PRIVILEAPI.getUserRights(performerPrivileges);

	var targetPrivileges = await getPrivileges(userid, storeid); // gia tri privileges cu~
	targetPrivileges = PRIVILEAPI.getUserRights(targetPrivileges);

	const performerIsOwner = performerPrivileges.includes(PRIVILEAPI.OWNER);
	const performerIsHRM = performerPrivileges.includes(PRIVILEAPI.HRM);

	const targetIsOwner = targetPrivileges.includes(PRIVILEAPI.OWNER);

	if (targetIsOwner && !performerIsOwner) {
		res.status(202).json({ message: "Bạn không đủ quyền để thay đổi" });
		return;
	}
	if (performerIsHRM || performerIsOwner) {
        const deleteRes = await query("DELETE FROM `privileges` WHERE userid = ? and storeid =?",[userid,storeid]);
        res.status(200).json({ message: "Xóa nhân viên thành công" });
		return;
	}
	res.status(202).json({ message: "Bạn không đủ quyền để thay đổi" });
	return;
}
