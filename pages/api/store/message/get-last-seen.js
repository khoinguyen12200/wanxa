import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';


export default async function (req, res) {
    const {token,storeid} = req.body;
    const userid = await getUserIdByToken(token);
    const lastSeens = await query("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid,storeid]);
    if(lastSeens.length > 0) {
        res.status(200).json(lastSeens[0]);
        return
    }
    res.status(202).end();
    
}