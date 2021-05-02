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

    const {description} = await formParse(req);
    const { storeid, userid, privileges } = req.headers;
  
    const check = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER]);
    if(!check) {
        res.status(401).send({message:Privileges.ErrorMessage(Privileges.Content.OWNER)});
        return;
    }
  
    const changeRes = await query("update `store` set `description`=? where id =?",[description,storeid]);
    if(changeRes){
        res.status(200).json({message:"Thay đổi thành công"});
        return;
    }
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}
