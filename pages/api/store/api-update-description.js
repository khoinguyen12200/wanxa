import query from "../const/connection";
import formParse from '../const/form'
import {getUserIdByToken,isUserHasPrivileges,PRIVILEAPI} from '../const/querySample'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {token,description,storeid} = await formParse(req);

    const check = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER]);
    if(!check) {
        res.status(202).json({message:"Yêu cầu quyền chủ sở hữu"});
        return;
    }
  
    const changeRes = await query("update `store` set `description`=? where id =?",[description,storeid]);
    if(changeRes){
        res.status(200).json({message:"Thay đổi thành công"});
        return;
    }
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}
