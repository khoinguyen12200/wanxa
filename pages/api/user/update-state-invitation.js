import query from "../const/connection";


export default async function (req, res) {
    const {state,id} = req.body;
    const {userid} = req.headers;

    var invitation = await query("SELECT * FROM `staff-invitation` WHERE id =?",id);
    invitation = invitation.length > 0 ? invitation[0] : null;

    const updateRes = await query("UPDATE `staff-invitation` SET `state`=? where id =? and destination =?",[state,id,userid]);
    if(updateRes){
        if(state == 1){
            const storeid = invitation ? invitation.storeid : null;
            const insertRes = await query("INSERT INTO `privileges`(`storeid`, `userid`, `value`) VALUES (?,?,?)",[storeid,userid,0]);
        }
        res.status(200).json({message:"Đã lưu lại"});
    }else{
        res.status(202).json({message:"Có lỗi xảy ra"});
    }
}