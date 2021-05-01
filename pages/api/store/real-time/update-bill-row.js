import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample'
import {getUserId} from '../../const/jwt'

export default async function (req, res) {
    const {id,state} = req.body;

    const userid =getUserId(req)
    const updateRes = await query("UPDATE `bill-row` set state = ?, barista = ? where id =?",[state,userid,id])
    res.status(200).end();

}