import query from "../../const/connection";

export default async function (req, res) {
	const { privileges, userid, storeid } = req.headers;


	var bills = await query(
		"SELECT * FROM `bill` WHERE storeid =? and state = 0",
		[storeid]
	);

	for (let i in bills) {
		const items = await query(
			"SELECT * FROM `bill-row` WHERE `bill-id` = ?",
			[bills[i].id]
		);
		bills[i].items = items;
	}

	res.status(200).json(bills);
}
