import query from "../const/connection";
import formParse from "../const/form";
import {
	getAllStaff,
	getBasicInforFromToken,
	getUserIdByToken,
	getPrivileges
} from "../const/querySample";

import Privileges from "../../../components/Privileges";
import Notification from "../../../components/Notification";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	var { token, name, storeid } = await formParse(req);
	storeid = parseInt(storeid);

	const userid = await getUserIdByToken(token);
	const priValue = await getPrivileges(userid, storeid);


	const check = Privileges.isValueIncluded(priValue,[Privileges.Content.OWNER])
	if (!check) {
		res.status(202).json({ message: "Yêu cầu quyền chủ sở hữu" });
		return;
	}

	const oldStore = await query("Select * from store where id = ?", [storeid]);
	const oldName = oldStore.length != 0 ? oldStore[0].name : "";
	const changeRes = await query("update `store` set `name`=? where id =?", [
		name,
		storeid,
	]);
	if (changeRes) {
		const executor = await getBasicInforFromToken(token);

		var notification = new Notification({
			type: Notification.TYPE.UPDATE_STORE_NAME,
			content: {
				ExecutorId: executor.id,
				ExecutorName: executor.name,
				StoreId: storeid,
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
