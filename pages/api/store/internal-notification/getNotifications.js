import query from "../../const/connection";


export default async function (req, res) {
	const { from, len } = req.body;
	const {storeid,privileges,userid} = req.headers;

	const resu = await query(
		"select `internal-notification`.*,user.avatar,user.name as username" +
			"  from `internal-notification` left join `user` on user.id = `internal-notification`.executor" +
			" where storeid = ?  order by `internal-notification`.date desc limit ?,?  ",
		[storeid, from, len]
	);
	res.status(200).json(resu);
}
