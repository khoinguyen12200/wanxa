import query from "../const/connection";
import formParse from "../const/form";
import {
	getAllStaff,
	getBasicInforFromToken,
	getUserById,
	getPrivileges
} from "../const/querySample";

import Privileges from "../../../components/Privileges";
import Notification from "../../../components/Notification";
import {getUserId} from '../const/jwt'
export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	var {  name } = await formParse(req);
	const { storeid, userid, privileges } = req.headers;
	

	const check = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER])
	if (!check) {
		res.status(401).send({ message: Privileges.ErrorMessage(Privileges.Content.OWNER)});
		return;
	}

	const oldStore = await query("Select * from store where id = ?", [storeid]);
	const oldName = oldStore.length != 0 ? oldStore[0].name : "";
	const changeRes = await query("update `store` set `name`=? where id =?", [
		name,
		storeid,
	]);
	if (changeRes) {
		const executor = await getUserById(userid);

		var notification = new Notification({
			type: Notification.TYPE.UPDATE_STORE_NAME,
			content: {
				ExecutorId: parseInt(executor.id),
				ExecutorName: executor.name,
				StoreId: parseInt(storeid),
				OldName: oldName,
				NewName: name,
			},
		});

		const allStaff = await getAllStaff(storeid);
		for (let i in allStaff) {
			const staff = allStaff[i];
			notification.destination = staff.id;
			const para = notification.getInsertParameter();
			await query(...para)
		}

		res.status(200).json({ message: "Thay đổi thành công" });
		return;
	}
	res.status(202).json({ message: "Có lỗi xảy ra" });
}
