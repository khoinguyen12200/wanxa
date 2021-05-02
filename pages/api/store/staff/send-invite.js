import query from "../../const/connection";

import Notification from "../../../../components/Notification";

export default async function (req, res) {
	const { destination } = req.body;

	const {storeid,userid,privileges} = req.headers;

	const executorId = userid;
	const executor = await query("select name from user where id = ?", [
		executorId,
	]);
	const store = await query("select * from store where id = ?", [storeid]);

	const desResults = await query(
		"Select id from user where id = ?",
		destination
	);
	if (desResults.length == 0) {
		res.status(202).json({ message: "Không tồn tại người dùng này" });
		return;
	}

	const desIsInStore = await query(
		"Select * from privileges where storeid = ? and userid = ?",
		[storeid, destination]
	);
	if (desIsInStore.length > 0) {
		res.status(202).json({
			message: "Người dùng này đã là thành viên của cửa hàng",
		});
		return;
	}

	const inviteRes = await query(
		"INSERT INTO `staff-invitation`(`executor`, `storeid`, `destination`) VALUES (?,?,?)",
		[executorId, storeid, destination]
	);

	const insertId = inviteRes.insertId;
	const notification = new Notification({
		type: Notification.TYPE.INVITE_TO_STORE,
		content: {
			id: insertId,
			ExecutorId: executorId,
			ExecutorName: executor[0].name,
			StoreId: parseInt(storeid),
			StoreName: store[0].name,
			Message: "string",
		},
		destination: destination,
	});
	const para = notification.getInsertParameter();
	if (para.length > 0) {
		const notify = await query(...para);
	}

	res.status(200).json({ message: "Gửi thành công" });
}
