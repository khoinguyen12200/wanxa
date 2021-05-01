import query from "../const/connection";
import formParse from '../const/form'
import {getUserId} from '../const/jwt'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {description} = await formParse(req);

    const userid = getUserId(req);
  
    const changeRes = await query("update `user` set `description`=? where id =?",[description,userid]);
    if(changeRes){
        res.status(200).json({message:"Thay đổi thành công"});
        return;
    }
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}
