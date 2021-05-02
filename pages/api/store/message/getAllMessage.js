import query from "../../const/connection";


export default async function (req, res) {
    const {privileges,userid,storeid} = req.headers;
    const result = await query("SELECT * FROM `store-message` WHERE storeid = ? order by time desc limit 50",[storeid]);
    res.status(200).json(result);
}
