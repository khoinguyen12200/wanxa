import query from "../../const/connection";
import {getUserId} from '../../const/jwt'
export default async function (req, res) {
	const { id } = req.body;

    const userid = getUserId(req)

    const InterNoti = await query("Select * from `internal-notification` where executor = ? and id = ?",[userid,id]);
    if(InterNoti.length > 0){
        const resu = await query("DELETE FROM `internal-notification` WHERE id = ?",[id]);
        res.status(200).json({message:"Lưu lại thành công"});
    }else{
        res.status(202).json({message:"Bạn không phải người tạo thông báo này"});
    }
	
	
}
