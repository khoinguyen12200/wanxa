import query from "../../const/connection";
import Privileges from "../../../../components/Privileges";

export default async function (req, res) {
	const { name, groupid } = req.body;

	const { storeid, userid, privileges } = req.headers;

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
		res.status(401).send({
			message: Privileges.ErrorMessage(Privileges.Content.FACILITY),
		});
	}
}
