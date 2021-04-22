import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample'

export default async function (req, res) {
    const {token,id} = req.body;


    const deleteRes = await query("delete from  `bill-row`  where id =?",[id])
    
    res.status(200).end();

}