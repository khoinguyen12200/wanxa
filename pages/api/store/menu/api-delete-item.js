import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';
import {deleteFile} from '../../const/file';

export default async function (req, res) {

    const {id,token,groupid} = req.body;
    
    
    const store = await query("Select storeid from `menu-group` where id = ?",[groupid]);
    const storeid = store.length >0 ? store[0].storeid : null
    const userid = await getUserIdByToken(token);
    const privalue = await getPrivileges(userid, storeid);
    const checked = Privileges.isValueIncluded(privalue,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    const item = await query("select * from `menu-item` where id = ?" ,[id]);
    const path = item[0].picture;
    
    if(checked){
        const udpateRes = await query("delete from `menu-item` where id = ?",[id]);
        if(path != null && path != ""){
            deleteFile(path);
        }

        res.status(200).json({message: 'Xóa thành công'})
    }else{
        res.status(202).json({message: 'Bạn không có quyền thực hiện'})
    }

}