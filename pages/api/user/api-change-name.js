import query from "../const/connection";

export default async function (req, res) {

    const {name} = req.body;

    const {userid} = req.headers;

    const changeRes = await query("update `user` set `name`=? where id =?",[name,userid]);
    if(changeRes){
        res.status(200).json({message:"Thay đổi thành công"});
        return;
    }
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}
