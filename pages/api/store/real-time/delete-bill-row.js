import query from "../../const/connection";
import Privileges from "../../../../components/Privileges";

export default async function (req, res) {
	const { id } = req.body;

	const { privileges, userid, storeid } = req.headers;

	const checked = Privileges.isValueIncluded(privileges, [
		Privileges.Content.OWNER,
		Privileges.Content.WAITER,
	]);

	if (checked) {
		const deleteRes = await query("delete from  `bill-row`  where id =?", [
			id,
		]);
		res.status(200).end();
	} else {
		res.status(401).send(
			Privileges.ErrorMessage(Privileges.Content.WAITER)
		);
	}
}
