import query from "../../const/connection";
import {
	getUserIdByToken,
	getArrayOfPrivileges,
	PRIVILEAPI,
} from "../../const/querySample";

import Notification from "../../../../components/Notification";
export default async function (req, res) {
	const { value, token, storeid } = req.body;

	const userId = await getUserIdByToken(token);

	const arrOfPrivileges = await getArrayOfPrivileges(userId, storeid);
	const hasNotiRights =
		arrOfPrivileges.includes(PRIVILEAPI.OWNER) ||
		arrOfPrivileges.includes(PRIVILEAPI.NOTIFICATION);
	if (hasNotiRights) {
		const insertRes = await query(
			"INSERT INTO `internal-notification`(`executor`, `content`,`storeid`) VALUES (?,?,?)",
			[userId, value, storeid]
		);
		const allStaff = await query(
			"select * from privileges where storeid = ?",
			[storeid]
		);
		const executor = await query ("select name from user where id = ?",[userId]);
		for (let i in allStaff) {
			const staff = allStaff[i];
			console.log(staff)
			var notification = new Notification({
				type: Notification.TYPE.INTERNAL_NOTIFICATION,
				content: {
					ExecutorId: parseInt(userId),
					ExecutorName: executor[0].name,
					StoreId: parseInt(storeid),
					Message: value,
					id:insertRes.insertId,
				},
				destination: staff.userid,
			});

			const para = notification.getInsertParameter();
			const resAdd = await query(...para);
		}
		res.status(200).json({ message: "Thành công" });
	} else {
		res.status(202).json({
			message: "Bạn không đủ quyền để tạo thông báo",
		});
	}
}
