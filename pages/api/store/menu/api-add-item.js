import query from "../../const/connection";
import {upLoadAvatar,UploadDir} from '../../const/file'
import Privileges from '../../../../components/Privileges'
import parseForm from '../../const/form';


export const config = {
    api: {
      bodyParser: false,
    },
}
export default async function (req, res) {

    const {name,des,price,files,groupid} = await parseForm(req);
    console.log("this is first line");
    console.log(name,des,price,files,groupid)
    var picture = files != null ? files.picture : "";

    const {storeid,privileges,userid} = req.headers;

    const accepted = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(accepted) {
        const uploadDir = picture ? await upLoadAvatar(picture,UploadDir.Menu) : "";
        const insertRes = await query("INSERT INTO `menu-item`( `groupid`, `name`, `des`, `picture`, `price`) VALUES (?,?,?,?,?)",[groupid,name,des,uploadDir,price])
        res.status(200).json({message:"Thêm món thành công"})
    }else{
        res.status(202).json({error:true,message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }

    
    
    
	
}
