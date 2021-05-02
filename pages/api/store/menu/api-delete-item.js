import query from '../../const/connection';
import Privileges from '../../../../components/Privileges';
import {deleteFile} from '../../const/file';

export default async function (req, res) {

    const {id,groupid} = req.body;
    
    
    const {storeid,privileges,userid} = req.headers;

    const checked = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);

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