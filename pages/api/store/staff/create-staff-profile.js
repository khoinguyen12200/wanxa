import query from "../../const/connection";
import formParse from "../../const/form";
import { v4 as uuidv4 } from "uuid";

import { upLoadAvatar, userAvatarDir } from "../../const/file";

import {
	getUserById,
	isUserHasPrivileges,
	PRIVILEAPI,
} from "../../const/querySample";
var md5 = require("md5");

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	var failed = [];

	var { user, storeId, token, files } = await formParse(req);
	const userS = JSON.parse(user);

	const privilegesOwner = await isUserHasPrivileges(token, storeId, [
		PRIVILEAPI.OWNER,
	]);
	const privilegesHRM = await isUserHasPrivileges(token, storeId, [
		PRIVILEAPI.HRM,
	]);

	if (!privilegesOwner && !privilegesHRM) {
		res.status(202).json({
			message: "Bạn không có quyền thực hiện yêu cầu này",
		});
		return;
	}
	if(!privilegesOwner){
		for(let i in userS){
			const newUser = userS[i];
			const arrPri = PRIVILEAPI.getUserRights(newUser.privileges);
			if(arrPri.includes(PRIVILEAPI.OWNER)){
				res.status(202).json({
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
				[storeId, insertId, newUser.privileges]
			);
		}
	}
	res.status(200).json({ failed:failed });
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
		if(res2)
		return res2.insertId;
		return -1;
	}
}
