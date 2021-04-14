import query from "../const/connection";

export default async function (req, res) {
	const { type, destination, content } = req.body;
    console.log('fire')
	const result = await query(
		"INSERT INTO `notification`(`type`, `content`, `destination`) VALUES (?,?,?)",
		[type, content, destination]
	);
    res.status(200).json(result);
}
