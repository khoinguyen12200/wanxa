import query from "../../const/connection";
import formParse from '../../const/form'
import {upLoadAvatar,userStoreDir,deleteFile} from '../../const/file'
import Privileges from '../../../../components/Privileges';

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {files} = await formParse(req);
    const { storeid, userid, privileges } = req.headers;


    var logo = files != null ? files.logo : "";

    const check = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER]);
    if(!check){
        res.status(200).send({error:true,message:Privileges.ErrorMessage(Privileges.Content.OWNER)});
        return;
    }

    const storeRes = await query("select `logo` from store where id = ?",storeid);

    const oldPath = storeRes[0].logo;
    const delRes = await deleteFile(oldPath);
    
    const uploadDir = logo ? await upLoadAvatar(logo,userStoreDir) : "";
    if(uploadDir != "") {
        const changeRes = await query("update `store` set `logo`=? where id =?",[uploadDir,storeid]);
        if(changeRes){
            res.status(200).json({message:"Thay đổi thành công"});
            return;
        }
    }
    res.status(200).json({error:true,message:"Có lỗi xảy ra"});

	
}
