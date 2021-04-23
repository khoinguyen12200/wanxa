import query from "../../const/connection";

export default async function (req, res) {
	var { fromTime, toTime, unit, type } = req.body;
	fromTime = fromTime || new Date(0);
	toTime = toTime || new Date();

	if (type == 1) {
        const queryRes = await query(
            "SELECT " +
                unit +
                "(paytime) as unit,sum(price) as sum" +
                " FROM `bill` WHERE paytime >= ? and paytime <= ? group by unit ",
            [fromTime, toTime]
        );
        res.status(200).json(queryRes);
	} else {
		const query2Res = await query(
			"SELECT static.`menu-name` as name,count(static.`menu-name`) as count,static.price" +
				" FROM `static-bill-row` static left join bill on bill.id = static.`bill-id`" +
				" where bill.paytime >= ? and bill.paytime<=? group by name",[fromTime,toTime]
		);
        res.status(200).json(query2Res);
	}
	
}
