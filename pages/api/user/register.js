import query from "../const/connection";
import formParse from "../const/form";
import { upLoadAvatar, userAvatarDir } from "../const/file";

var md5 = require("md5");

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	const { name, account, password, files } = await formParse(req);
	var avatar = files != null ? files.avatar : "";

	const uploadDir = avatar ? await upLoadAvatar(avatar, userAvatarDir) : "";
	const isExisting = await query(
		"SELECT `id` FROM USER where account = ?",
		account
	);
	if (isExisting.length > 0) {
		res.json({error:true,message:'User đã tồn tại'});
		return;
	}
	const result = await query(
		"INSERT INTO `user`(`account`, `password`, `name`, `avatar`) VALUES (?,?,?,?)",
		[account, md5(password), name, uploadDir]
	);
	if (result) {
		res.status(200).json({ message: "Tạo tài khoản thành công" });
	} else {
		res.json({ message: "Lỗi không rõ" });
	}
}
