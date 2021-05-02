import query from '../../const/connection';

export default async function (req, res) {
    const {privileges,userid,storeid} = req.headers;
    
    const newTime = new Date();
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