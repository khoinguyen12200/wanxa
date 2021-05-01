import query from "../const/connection";
import formParse from '../const/form'
import {getUserIdByToken,getPrivileges} from '../const/querySample'
import {getUserId} from '../const/jwt'
import Privileges from '../../../components/Privileges';
export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {description,storeid} = await formParse(req);

    const userid = getUserId(req);
    const priValue = await getPrivileges(userid,storeid);
 
    const check = Privileges.isValueIncluded(priValue,[Privileges.Content.OWNER]);
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
