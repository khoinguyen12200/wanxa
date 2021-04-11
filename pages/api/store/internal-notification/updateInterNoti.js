import query from "../../const/connection";
import {
	getUserIdByToken,
	getArrayOfPrivileges,
	PRIVILEAPI,
} from "../../const/querySample";

export default async function (req, res) {
	const { id ,token ,value} = req.body;

    const userid = await getUserIdByToken(token);

    const InterNoti = await query("Select * from `internal-notification` where executor = ? and id = ?",[userid,id]);
    if(InterNoti.length > 0){
        const resu = await query("update `internal-notification` set content =?, date =? where id =?",[value,new Date(),id]);
        res.status(200).json({message:"Lưu lại thành công"});
    }else{
        res.status(202).json({message:"Bạn không phải người tạo thông báo này"});
    }
	
	
}
