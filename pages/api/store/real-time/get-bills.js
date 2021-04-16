import query from "../../const/connection";

export default async function (req, res) {
	const { storeid } = req.body;

	var bills = await query(
		"SELECT bill.*,`store-table`.name  as tablename" +
			" FROM `bill`  left join `store-table` on `bill`.`tableid` = `store-table`.id" +
			" where `bill`.storeid = ? and state = 0",
		[storeid]
	);

	for (let i in bills) {
		const items = await query(
			"SELECT `bill-row`.*,`menu-item`.name,`menu-item`.`picture`" +
				" FROM `bill-row` left join `menu-item` on `bill-row`.`menu-item-id` = `menu-item`.`id`" +
				" where `bill-row`.`bill-id` = ?",
			[bills[i].id]
		);
		bills[i].items = items;
	}

	res.status(200).json(bills);
}
