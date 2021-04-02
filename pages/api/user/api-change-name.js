import query from "../const/connection";
import formParse from '../const/form'
import {getUserIdByToken} from '../const/querySample'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {token,name} = await formParse(req);

    const userid = await getUserIdByToken(token);
  
    const changeRes = await query("update `user` set `name`=? where id =?",[name,userid]);
    if(changeRes){
        res.status(200).json({message:"Thay đổi thành công"});
        return;
    }
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}