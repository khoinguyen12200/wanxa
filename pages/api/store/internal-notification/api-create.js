import query from "../../const/connection";


import Privileges from "../../../../components/Privileges";
import Notification from "../../../../components/Notification";
export default async function (req, res) {
	const { value } = req.body;

	const {storeid,privileges,userid} = req.headers;

	const hasNotiRights = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.Notification]);

	
	if (hasNotiRights) {
		const insertRes = await query(
			"INSERT INTO `internal-notification`(`executor`, `content`,`storeid`) VALUES (?,?,?)",
			[userid, value, storeid]
		);
		const allStaff = await query(
			"select * from privileges where storeid = ?",
			[storeid]
		);
		const executor = await query ("select name from user where id = ?",[userid]);
		for (let i in allStaff) {
			const staff = allStaff[i];
			var notification = new Notification({
				type: Notification.TYPE.INTERNAL_NOTIFICATION,
				content: {
					ExecutorId: parseInt(userid),
					ExecutorName: executor[0].name,
					StoreId: parseInt(storeid),
					Message: value,
					id:insertRes.insertId,
				},
				destination: staff.userid,
			});

			const para = notification.getInsertParameter();
			const resAdd = await query(...para);
		}
		res.status(200).json({ message: "Thành công" });
	} else {
		res.status(202).json({error:true,
			message: "Bạn không đủ quyền để tạo thông báo",
		});
	}
}
