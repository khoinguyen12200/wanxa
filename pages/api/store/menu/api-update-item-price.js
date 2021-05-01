import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';
import {getUserId} from '../../const/jwt'

export default async function (req, res) {

    const {id,price,token,groupid} = req.body;
    
    
    const store = await query("Select storeid from `menu-group` where id = ?",[groupid]);
    const storeid = store.length >0 ? store[0].storeid : null
    const userid = getUserId(req);
    const privalue = await getPrivileges(userid, storeid);
    const checked = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(checked){
        const udpateRes = await query("update `menu-item` set price = ? where id = ?",[price,id]);
        res.status(200).json({message: 'Thay đổi thành công'})
    }else{
        res.status(202).json({message: 'Bạn không có quyền thực hiện'})
    }

}