import query from '../../const/connection';
import Privileges from "../../../../components/Privileges";

export default async function (req, res) {
    const {id,state} = req.body;

    const { privileges, userid, storeid } = req.headers;

	const checked = Privileges.isValueIncluded(privileges, [
		Privileges.Content.OWNER,
		Privileges.Content.B,
	]);

    if(checked){
        const updateRes = await query("UPDATE `bill-row` set state = ?, barista = ? where id =?",[state,userid,id])
        res.status(200).end();
    }else{
        res.status(401).send(Privileges.ErrorMessage(Privileges.Content.WAITER));
    }


   

}