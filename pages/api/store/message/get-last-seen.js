import query from '../../const/connection';

export default async function (req, res) {
    const {privileges,userid,storeid} = req.headers;
    const lastSeens = await query("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid,storeid]);
    if(lastSeens.length > 0) {
        res.status(200).json(lastSeens[0]);
        return
    }
    res.status(202).end();
    
}