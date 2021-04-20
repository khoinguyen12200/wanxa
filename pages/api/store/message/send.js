import query from "../../const/connection";
import {getUserIdByToken,getPrivileges} from '../../const/querySample';




export default async function (req, res) {
    const {message,storeid,token} = req.body;
    const userid = await getUserIdByToken(token);
    const privileges = await getPrivileges(userid, storeid);
    if(privileges > 0){
        const insertRes = await query("INSERT INTO `store-message`(`storeid`, `userid`, `message`) VALUES (?,?,?)",[storeid,userid,message]);
        res.status(200).end();
    } else{ 
        res.stats(202).end();
    }
}
