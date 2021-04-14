import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';

export default async function (req, res) {

    const {token,id,name} = req.body;
    
    const store = await query("Select storeid from `menu-group` where id = ?",[id]);
    const storeid = store.length >0 ? store[0].storeid : null
    const userid = await getUserIdByToken(token);
    const privalue = await getPrivileges(userid, storeid);
    const checked = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);
    if(checked){
        const updateRes = await query("UPDATE `menu-group` SET `name`=? WHERE id = ?",[name,id]);
        res.status(200).json({message:"Chỉnh sửa thành công"})
    }else{
        res.status(202).json({message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }
}