import query from "../../const/connection";
import {
	getUserIdByToken,
	getArrayOfPrivileges,
	PRIVILEAPI,
} from "../../const/querySample";

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
		res.status(200).json({ message: "Thành công" });
	} else {
		res.status(202).json({
			message: "Bạn không đủ quyền để tạo thông báo",
		});
	}
}
