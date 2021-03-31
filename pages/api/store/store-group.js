import query from "../const/connection";
import formParse from '../const/form'


export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {storeid,token} = await formParse(req);
    const userids = await query("select `userid` from `user-token` where token=?",[token]);
    if(userids.length > 0) {
        const id = userids[0].userid;
        const store = await query("SELECT `storeid` FROM `privileges` WHERE `userid`=? and `storeid`=?",[id,storeid]);
        if(store.length > 0) {
            const groups = await query("SELECT * FROM `store-table-group` WHERE `storeid`=?",storeid);
            var newGroups = [];
            for(let i in groups) {
                var group = groups[i];
                const tables = await query("SELECT * FROM `store-table` WHERE `groupid`=?",group.id);
                group.tables = tables;
                newGroups.push(group);
            }
            res.status(200).json({group:newGroups})  
        }else{
            res.status(202).json({message: 'Bạn không có quyền để vào đây'})  
        }
    }else{  
        res.status(202).json({message: 'Token đã hết hạn'})
    }
	
}