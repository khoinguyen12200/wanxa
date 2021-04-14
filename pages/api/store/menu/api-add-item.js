import query from "../../const/connection";
import formParse from '../../const/form'
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import {upLoadAvatar,UploadDir} from '../../const/file'

import Privileges from '../../../../components/Privileges'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {name,des,price,files,token,groupid} = await formParse(req);
    var picture = files != null ? files.picture : "";

    const userid = await getUserIdByToken(token);
    const menuGroup = await query("select * from `menu-group` where id =?",groupid);
    const storeid = menuGroup.length > 0 ? menuGroup[0].storeid : null;
    const privalue = await getPrivileges(userid,storeid);

    const accepted = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(accepted) {
        const uploadDir = picture ? await upLoadAvatar(picture,UploadDir.Menu) : "";
        const insertRes = await query("INSERT INTO `menu-item`( `groupid`, `name`, `des`, `picture`, `price`) VALUES (?,?,?,?,?)",[groupid,name,des,uploadDir,price])
        res.status(200).json({message:"Thêm món thành công"})
    }else{
        res.status(202).json({message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }

    
    
    
	
}
