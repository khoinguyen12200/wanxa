import query from "../const/connection";
import formParse from '../const/form'
import {upLoadAvatar,userAvatarDir,deleteFile} from '../const/file'

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {
    const body = await formParse(req);
    const {files} = body;
    var avatar = files != null ? files.avatar : "";

    const {userid} = req.headers;
    const user = await query("select `avatar` from user where id = ?",userid);

    const oldPath = user[0].avatar;
    const delRes = await deleteFile(oldPath);
    
    const uploadDir = avatar ? await upLoadAvatar(avatar,userAvatarDir) : "";
    if(uploadDir != "") {
        const changeRes = await query("update `user` set `avatar`=? where id =?",[uploadDir,userid]);
        if(changeRes){
            res.status(200).json({message:"Thay đổi thành công"});
            return;
        }
    }
    res.status(200).json({error:true,message:"Có lỗi xảy ra"});

	
}
