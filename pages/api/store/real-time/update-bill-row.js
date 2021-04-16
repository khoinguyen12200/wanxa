import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample'


export default async function (req, res) {
    const {token,id,state} = req.body;

    const userid = await getUserIdByToken(token);
    const updateRes = await query("UPDATE `bill-row` set state = ?, barista = ? where id =?",[state,userid,id])
    res.status(200).end();

}