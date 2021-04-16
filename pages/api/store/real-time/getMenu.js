import query from '../../const/connection';

export default async function (req, res) {
    const {storeid} = req.body;

    const groups = await query("SELECT * FROM `menu-group` WHERE storeid = ?",storeid);

    const arr = [];
    for(let i in groups) {
        var group = groups[i];
        const groupid = group.id;
        var items = await query ("SELECT * FROM `menu-item` WHERE groupid=?",groupid);

        group.items = items;
        arr.push(group);
    }
    res.status(200).json(arr);

}