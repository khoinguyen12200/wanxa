import query from '../../const/connection';
import Privileges from '../../../../components/Privileges'



export default async function (req, res) {
    const {menu_item_id,bill_id} = req.body;

    const {privileges,userid,storeid} = req.headers;

    const checked = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.WAITER]);
    if(checked){
        const addRes = await query("INSERT INTO `bill-row`(`bill-id`, `menu-item-id`) VALUES (?,?)",[bill_id,menu_item_id]);
        res.status(200).end();
    }else{
        res.status(401).send(Privileges.ErrorMessage(Privileges.Content.WAITER));
    }
   

}