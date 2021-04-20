import query from "../../const/connection";
import {getUserIdByToken,getPrivileges} from '../../const/querySample';


export default async function (req, res) {
    const {storeid} = req.body;

    const result = await query("SELECT * FROM `store-message` WHERE storeid = ? order by time desc limit 50",[storeid]);
    res.status(200).json(result);
}
