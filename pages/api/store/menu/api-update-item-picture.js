import query from "../../const/connection";
import formParse from '../../const/form'
import {upLoadAvatar,UploadDir,deleteFile} from '../../const/file'
import {getUserId} from '../../const/jwt'
import Privileges from '../../../../components/Privileges'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {files,id} = await formParse(req);
    var picture = files != null ? files.picture : "";

    const {privileges,userid,storeid} = req.headers;

    const accepted = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(accepted) {
        const oldItem = await query("select * from `menu-item` where id =?",id);
        const oldPath = oldItem.length > 0 ? oldItem[0].path : null;
        await deleteFile(oldPath);

        const uploadDir = picture ? await upLoadAvatar(picture,UploadDir.Menu) : "";
        const updateRes = await query("UPDATE `menu-item` set picture = ? where id = ?",[uploadDir,id])
        res.status(200).json({message:"Chỉnh sửa thành công"})
    }else{
        res.status(202).json({error:true,message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }

    
    
    
	
}
