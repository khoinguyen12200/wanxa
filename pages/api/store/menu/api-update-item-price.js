import query from '../../const/connection';
import {getUserIdByToken,getPrivileges} from '../../const/querySample';
import Privileges from '../../../../components/Privileges';
import {getUserId} from '../../const/jwt'

export default async function (req, res) {

    const {id,price} = req.body;
    
    
    const {privileges,userid,storeid} = req.headers;
    const checked = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(checked){
        const udpateRes = await query("update `menu-item` set price = ? where id = ?",[price,id]);
        res.status(200).json({message: 'Thay đổi thành công'})
    }else{
        res.status(202).json({message: 'Bạn không có quyền thực hiện'})
    }

}