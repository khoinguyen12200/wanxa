import query from "../../const/connection";
import Privileges from "../../../../components/Privileges";

export default async function (req, res) {
	const { tableid, note, list } = req.body;

	const { privileges, userid, storeid } = req.headers;

	const checked = Privileges.isValueIncluded(privileges, [
		Privileges.Content.OWNER,
		Privileges.Content.WAITER,
	]);
	if (checked) {
		const selectRes = await query(
			"Select * from `bill` where tableid = ? and state != 1",
			[tableid]
		);
		if (selectRes.length > 0) {
			res.status(202).json({
				message: "Bàn đang có hóa đơn chưa thanh toán",
			});
			return;
		}
		const insertRes = await query(
			"INSERT INTO `bill`(`storeid`, `tableid`, `note`) VALUES (?,?,?)",
			[storeid, tableid, note]
		);

		for (let i in list) {
			const billId = insertRes.insertId;
			const item = list[i];
			const insertItem = await query(
				"INSERT INTO `bill-row`(`bill-id`, `menu-item-id`) VALUES (?,?)",
				[billId, item]
			);
		}
		res.status(200).json({ message: "Đã thêm thành công" });
	} else {
		res.status(401).send(
			Privileges.ErrorMessage(Privileges.Content.WAITER)
		);
	}
}
