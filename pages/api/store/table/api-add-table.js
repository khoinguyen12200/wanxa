import query from "../../const/connection";
import formParse from "../../const/form";
import { getPrivileges, getUserIdByToken } from "../../const/querySample";
import Privileges from "../../../../components/Privileges";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	const { name, token, groupid } = await formParse(req);
	const groups = await query(
		"SELECT * FROM `store-table-group` WHERE id=?",
		groupid
	);
	const storeid = groups[0].storeid;

	const userid = await getUserIdByToken(token);
	if (userid == null) {
		res.status(202).json({ message: "Token đã hết hạn" });
	} else {
		const privileges = await getPrivileges(userid, storeid);
		const accepted = Privileges.isValueIncluded(privileges, [
			Privileges.Content.OWNER,
			Privileges.Content.FACILITY,
		]);

		if (accepted) {
			const addRes = await query(
				"INSERT INTO `store-table`(`groupid`, `name`) VALUES (?,?)",
				[groupid, name]
			);
			if (addRes) {
				res.status(200).json({ message: "Thêm thành công" });
			} else {
				res.status(202).json({ message: "Có lỗi xảy ra" });
			}
		} else {
			res.status(202).json({
				message:
					"Để thục hiện thao tác này cần quyền quản lý cơ sở vật chất hoặc chủ sở hữu",
			});
		}
	}
}
