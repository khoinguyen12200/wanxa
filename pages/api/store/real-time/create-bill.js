import query from '../../const/connection';

export default async function (req, res) {
    const {storeid,tableid,note,list} = req.body;

    const selectRes = await query("Select * from `bill` where tableid = ? and state != 1",[tableid]);
    if(selectRes.length > 0) {
        res.status(202).json({message:"Bàn đang có hóa đơn chưa thanh toán"})
        return;
    }


    const insertRes = await query("INSERT INTO `bill`(`storeid`, `tableid`, `note`) VALUES (?,?,?)",[storeid,tableid,note])
    for(let i in list){
        const billId = insertRes.insertId;
        const item = list[i];
        const insertItem = await query("INSERT INTO `bill-row`(`bill-id`, `menu-item-id`) VALUES (?,?)",[billId,item])
    }
    res.status(200).json({message:"Đã thêm thành công"});

}