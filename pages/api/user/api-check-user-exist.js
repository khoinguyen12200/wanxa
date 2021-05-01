import query from "../const/connection";

export default async function (req, res) {
	const { account } = req.body;

    const result = await query("SELECT id FROM  `user` where `account` = ?",account);
    res.status(200).json(result);

}
