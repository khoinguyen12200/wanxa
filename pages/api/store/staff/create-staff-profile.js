import query from "../../const/connection";
import formParse from "../../const/form";
import { v4 as uuidv4 } from "uuid";
import Notification from "../../../../components/Notification";
import { upLoadAvatar, userAvatarDir } from "../../const/file";

import { getUserIdByToken, getPrivileges } from "../../const/querySample";
import Privileges from "../../../../components/Privileges";

var md5 = require("md5");

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	var failed = [];

	var { user, files } = await formParse(req);
	const userS = JSON.parse(user);

	const { privileges, userid, storeid } = req.headers;

	const privilegesOwner = Privileges.isValueIncluded(privileges, [
		Privileges.Content.OWNER,
	]);
	const privilegesHRM = Privileges.isValueIncluded(privileges, [
		Privileges.Content.HRM,
	]);

	if (!privilegesOwner && !privilegesHRM) {
		res.status(200).send({
			error: true,
			message: "Bạn không có quyền thực hiện yêu cầu này",
		});
		return;
	}
	if (!privilegesOwner) {
		for (let i in userS) {
			const newUser = userS[i];
			const pri = newUser.privileges;
			const isOwner = Privileges.isValueIncluded(pri, [
				Privileges.Content.OWNER,
			]);
			if (isOwner) {
				res.status(200).send({
					error: true,
					message: "Bạn không có quyền thực hiện yêu cầu này",
				});
				return;
			}
		}
	}

	for (let i in userS) {
		var newUser = userS[i];
		const file = files[newUser.path];
		newUser.avatar = file;
		const insertId = await createUser(newUser);

		if (insertId == -1) {
			failed.push(i);
		} else {
			const insertToPrivileges = await query(
				"INSERT INTO `privileges`(`storeid`, `userid`, `value`) VALUES (?,?,?)",
				[storeid, insertId, newUser.privileges]
			);
		}
	}
	res.status(200).json({ failed: failed });
	return;
}

async function createUser(user) {
	const { account, password, name, avatar } = user;

	const res1 = await query("SELECT `id` FROM `user` WHERE account =?", [
		user.account,
	]);
	if (res1.length > 0) {
		return -1;
	} else {
		const uploadDir = avatar
			? await upLoadAvatar(avatar, userAvatarDir)
			: "";
		const res2 = await query(
			"INSERT INTO `user`(`account`, `password`, `name`, `avatar`)" +
				" VALUES (?,?,?,?)",
			[account, md5(password), name, uploadDir]
		);
		if (res2) {
			const userid = res2.insertId;
			var notification = new Notification({
				type: Notification.TYPE.WARNING_AUTO_CREATE,
				content: {
					StaffName: name,
				},
				destination: userid,
			});
			const para = notification.getInsertParameter();
			if (para.length > 0) {
				const notify = await query(...para);
				console.log(notify);
			}

			return res2.insertId;
		}

		return -1;
	}
}
