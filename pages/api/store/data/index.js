import query from "../../const/connection";

export default async function (req, res) {
	const { userid, storeid, privileges } = req.headers;
	if (privileges < 0 || privileges == null) {
		res.status(200).json({ error: true, message: "Không thể định danh" });
		return;
	}

	try {
		const info = await getInfo(storeid);
		const bills = await getBills(storeid);
		const internalNotifications = await getNotifications(storeid);
		const messages = await getMessages(storeid);
		const lastSeenMessage = await getLastSeenMessage(storeid,userid);
		const staffs = await getStaffs(storeid);
		const menus = await getMenus(storeid);
		const facilities = await getFacilities(storeid);

		const data = {
			info,
			bills,
			internalNotifications,
			messages,
			lastSeenMessage,
			staffs,
			menus,
			facilities,
		};

		res.status(200).json({ message: "Đã tải xong dữ liệu", data });
	} catch (e) {
		res.status(200).json({
			message: "Có lỗi khi tải dữ liệu",
			error: true,
		});
	}
}

async function getInfo(storeid){
    const result = await query("select * from store where id = ?", [storeid]);
    return result.length > 0 ? result[0] : null;
}
async function getBills(storeid) {
	var bills = await query(
		"select * from bill where storeid =? and state = 0",
		[storeid]
	);
	let rows = [];

	for (let i in bills) {
		const bill = bills[i];
		const row = await query(
			"SELECT * FROM `bill-row` WHERE `bill-id` = ?",
			[bill.id]
		);
		rows.push(row);
	}
	bills.rows = rows;
	return bills;
}
async function getNotifications(storeid) {
	const resu = await query(
		"select `internal-notification`.*,user.avatar,user.name as username" +
			"  from `internal-notification` left join `user` on user.id = `internal-notification`.executor" +
			" where storeid = ?  order by `internal-notification`.date desc limit ?,?  ",
		[storeid, 0, 10]
	);

	return resu;
}

async function getMessages(storeid) {
	const result = await query(
		"SELECT * FROM `store-message` WHERE storeid = ? order by time desc limit 50",
		[storeid]
	);
	return result;
}

async function getLastSeenMessage(storeid,userid) {
	const lastSeens = await query(
		"SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?",
		[userid, storeid]
	);
	if (lastSeens.length > 0) {
		return lastSeens[0];
	}
	return null;
}

async function getStaffs(storeid) {
	const staffs = await query(
		"SELECT USER.id,USER.name,USER.avatar,USER.description,PRIVILEGES.value as privilege" +
			" FROM privileges RIGHT JOIN USER ON USER.ID = privileges.USERID WHERE STOREID = ?",
		[storeid]
	);
	return staffs;
}

export async function getMenus(storeid) {
	var groups = await query(
		"SELECT * FROM `menu-group` WHERE storeid = ?",
		storeid
	);
	for (let group of groups) {
		group.list = await query(
			"SELECT * FROM `menu-item` WHERE groupid = ?",
			[group.id]
		);
	}
	return groups;
}

async function getFacilities(storeid) {
	var groups = await query(
		"SELECT * FROM `store-table-group` WHERE storeid = ?",
		storeid
	);
	for (let group of groups) {
		group.list = await query(
			"SELECT * FROM `store-table` WHERE groupid = ?",
			group.id
		);
	}
	return groups;
}
