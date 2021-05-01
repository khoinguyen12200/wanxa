import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';
import {getUserId} from '../../const/jwt'
export default async function (req, res) {

    const {id} = req.body;
    
    const store = await query("Select storeid from `menu-group` where id = ?",[id]);
    const storeid = store.length >0 ? store[0].storeid : null
    const userid = getUserId(req);
    const privalue = await getPrivileges(userid, storeid);
    const checked = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);
    if(checked){
        const deleteRes = await query("DELETE FROM `menu-group` WHERE id = ?",[id]);
        res.status(200).json({message:"Xóa nhóm thành công"})
    }else{
        res.status(202).json({message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }
}