import query from "../../const/connection";
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import {getUserId} from '../../const/jwt'



export default async function (req, res) {
    const {message,storeid} = req.body;
    const userid = getUserId(req)
    const privileges = await getPrivileges(userid, storeid);
    if(privileges > 0){
        const insertRes = await query("INSERT INTO `store-message`(`storeid`, `userid`, `message`) VALUES (?,?,?)",[storeid,userid,message]);
        res.status(200).end();
    } else{ 
        res.stats(202).end();
    }
}
