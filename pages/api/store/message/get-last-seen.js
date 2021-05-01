import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import {getUserId} from '../../const/jwt'

export default async function (req, res) {
    const {storeid} = req.body;
    const userid = getUserId(req)
    const lastSeens = await query("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid,storeid]);
    if(lastSeens.length > 0) {
        res.status(200).json(lastSeens[0]);
        return
    }
    res.status(202).end();
    
}