import query from "../../const/connection";
import { getUserIdByToken, getPrivileges } from "../../const/querySample";
import { getUserId } from "../../const/jwt";

export default async function (req, res) {
	const { message } = req.body;
	const { privileges, userid, storeid } = req.headers;
	const insertRes = await query(
		"INSERT INTO `store-message`(`storeid`, `userid`, `message`) VALUES (?,?,?)",
		[storeid, userid, message]
	);
	res.status(200).end();
}
