import query from "../const/connection";

export default async function (req, res) {
	const { id } = req.body;
	const data = await query(
		"SELECT `staff-invitation`.*, user.name as `executorName`,store.name as `storeName`" +
			" FROM `staff-invitation` join user on `staff-invitation`.`executor` = user.id " +
			"join store on store.id =  `staff-invitation`.storeid WHERE `staff-invitation`.id = ?",
		id
	);
	if (data.length > 0) {
		const result = data[0];
		res.status(200).json(result);
	} else {
		res.status(202).end();
	}
}
