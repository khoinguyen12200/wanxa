import query from "../../const/connection";

export default async function (req, res) {
	const { id ,value} = req.body;

    const {storeid,privileges,userid} = req.headers;

    const InterNoti = await query("Select * from `internal-notification` where executor = ? and id = ?",[userid,id]);
    console.log(InterNoti);
    if(InterNoti.length > 0){
        const resu = await query("update `internal-notification` set content =?, date =? where id =?",[value,new Date(),id]);
        res.status(200).json({message:"Lưu lại thành công"});
    }else{
        res.status(202).json({message:"Bạn không phải người tạo thông báo này"});
    }
	
	
}
