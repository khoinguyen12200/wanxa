import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';
import {getUserId} from '../../const/jwt'
export default async function (req, res) {

    const {storeid,name} = req.body;
    const userid = getUserId(req);
    
    const userid = await getUserIdByToken(token);
    const privalue = await getPrivileges(userid, storeid);
    const checked = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);
    if(checked){
        const addRes = await query("INSERT INTO `menu-group`(`storeid`, `name`) VALUES (?,?)",[storeid,name]);
        res.status(200).json({message:"Thêm thành công"})
    }else{
        res.status(202).json({message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }
}