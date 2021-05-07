import query from "../const/connection";
import { v4 as uuidv4 } from "uuid";
import { getUserById } from "../const/querySample";
import { signToken } from "../const/jwt";

var md5 = require("md5");

export default async function (req, res) {
	const { account, password } = req.body;

	const validation = await query(
		"SELECT `id` from user WHERE account = ? and password = ?",
		[account, md5(password)]
	);
	if (validation.length > 0) {
		const user = validation[0];

		const privileges = await query(
			"select * from privileges where userid = ?",
			user.id
		);

		const token = signToken(user.id, privileges);
		console.log(token);
		const sampleUser = await getUserById(user.id);
		res.json({
			message: "Đăng nhập thành công",
			token: token,
			user: sampleUser,
		});
	} else {
		res.json({ error: true, message: "Tài khoản và mật khẩu không khớp" });
	}
}
