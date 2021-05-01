import query from "../../const/connection";
import formParse from '../../const/form'
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import {upLoadAvatar,UploadDir,deleteFile} from '../../const/file'
import {getUserId} from '../../const/jwt'
import Privileges from '../../../../components/Privileges'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {files,token,groupid,id} = await formParse(req);
    var picture = files != null ? files.picture : "";

    const userid = getUserId(req);
    const menuGroup = await query("select * from `menu-group` where id =?",groupid);
    const storeid = menuGroup.length > 0 ? menuGroup[0].storeid : null;
    const privalue = await getPrivileges(userid,storeid);

    const accepted = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(accepted) {
        const oldItem = await query("select * from `menu-item` where id =?",id);
        const oldPath = oldItem.length > 0 ? oldItem[0].path : null;
        await deleteFile(oldPath);

        const uploadDir = picture ? await upLoadAvatar(picture,UploadDir.Menu) : "";
        const updateRes = await query("UPDATE `menu-item` set picture = ? where id = ?",[uploadDir,id])
        res.status(200).json({message:"Chỉnh sửa thành công"})
    }else{
        res.status(202).json({message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }

    
    
    
	
}
