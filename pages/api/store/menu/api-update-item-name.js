import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';


export default async function (req, res) {

    const {id,name,token,groupid} = req.body;
    
    
    const store = await query("Select storeid from `menu-group` where id = ?",[groupid]);
    const storeid = store.length >0 ? store[0].storeid : null
    const userid = await getUserIdByToken(token);
    const privalue = await getPrivileges(userid, storeid);
    const checked = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(checked){
        const udpateRes = await query("update `menu-item` set name = ? where id = ?",[name,id]);
        res.status(200).json({message: 'Thay đổi thành công'})
    }else{
        res.status(202).json({message: 'Bạn không có quyền thực hiện'})
    }

}