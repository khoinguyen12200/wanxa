import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';


export default async function (req, res) {
    const {token,storeid} = req.body;
    const newTime = new Date();
    
    const userid = await getUserIdByToken(token);
    const lastSeens = await query("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid,storeid]);
    if(lastSeens.length > 0) {
        const updateRes = await query("UPDATE `last-seen-message` SET `time`=? WHERE id =?",[newTime,lastSeens[0].id])
        res.status(200).end();
        return
    }else{
        const insertRes = await query("INSERT INTO `last-seen-message`(`userid`, `storeid`, `time`) VALUES (?,?,?)",[userid,storeid,newTime]);
        res.status(200).end();
        return;
    }
    res.status(202).end();
    
}