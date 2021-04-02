import query from "../const/connection";
import formParse from '../const/form'
import {upLoadAvatar,userStoreDir,deleteFile} from '../const/file'
import {getUserIdByToken,isUserHasPrivileges,PRIVILEAPI} from '../const/querySample'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {token,files,storeid} = await formParse(req);
    var logo = files != null ? files.logo : "";

    const check = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER,PRIVILEAPI.FACILITY]);
    if(!check){
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"});
        return;
    }

    const userid = await getUserIdByToken(token);
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
    res.status(202).json({message:"Có lỗi xảy ra"});

	
}
