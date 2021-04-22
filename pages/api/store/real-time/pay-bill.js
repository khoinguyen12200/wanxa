import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample'

export default async function (req, res) {
    const {id,token,note} = req.body;


    const billRows = await query ("SELECT * FROM `bill-row` WHERE `bill-id` = ?",[id]);
    for(let i in billRows) {
        const row = billRows[i];
        const menu = await query("SELECT * FROM `menu-item` WHERE id = ?",[row['menu-item-id']]);
        const menuName = menu[0].name;
        const menuPrice = menu[0].price;
        const barista = await query("select name from user where id = ?",[row.barista]);
        
        const baristaName = barista[0].name;
        const insertRes = await query("INSERT INTO `static-bill-row`(`bill-id`, `menu-name`, `barista-name`, `price`) VALUES (?,?,?,?)",[id,menuName,baristaName,menuPrice])

    }

    const updateRes = await query("update `bill`set state = 1,note =?,paytime=? where id = ?",[note,new Date(),id]);

    res.status(200).end();

}