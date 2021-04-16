import query from '../../const/connection';

export default async function (req, res) {
    const {menu_item_id,token,bill_id} = req.body;

    const addRes = await query("INSERT INTO `bill-row`(`bill-id`, `menu-item-id`) VALUES (?,?)",[bill_id,menu_item_id]);

    res.status(200).end();

}