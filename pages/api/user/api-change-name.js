import query from "../const/connection";
import formParse from '../const/form'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {name} = await formParse(req);

    const {userid} = req.headers;

    const changeRes = await query("update `user` set `name`=? where id =?",[name,userid]);
    if(changeRes){
        res.status(200).json({message:"Thay đổi thành công"});
        return;
    }
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}
