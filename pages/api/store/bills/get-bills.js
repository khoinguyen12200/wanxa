import query from "../../const/connection";

export default async function (req, res) {
	const { limit, offset, options } = req.body;
	const storeid = req.headers.storeid;


	var fromTime = options ? options.fromTime || new Date(0) : new Date(0);
	var toTime = options ? options.toTime || new Date() : new Date();
	var queryRes = await query(
		"select * from bill where storeid = ? and paytime>? and paytime<? order by time desc limit ?,?",
		[storeid, fromTime, toTime, offset, limit]
	);
	for (let i = 0; i < queryRes.length; i++) {
		const rows = await query(
			"select * from `static-bill-row` where `bill-id` = ?",
			queryRes[i].id
		);
		queryRes[i].rows = rows;
	}
	res.status(200).json(queryRes);
}
