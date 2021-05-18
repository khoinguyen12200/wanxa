import query from '../../const/connection';
import Privileges from '../../../../components/Privileges';

export default async function (req, res) {

    const {id,name,groupid} = req.body;
    
    
    const {privileges,userid,storeid} = req.headers;
    const checked = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);

    if(checked){
        const udpateRes = await query("update `menu-item` set name = ? where id = ?",[name,id]);
        res.status(200).json({message: 'Thay đổi thành công'})
    }else{
        res.status(202).json({error:true,message: 'Bạn không có quyền thực hiện'})
    }

}