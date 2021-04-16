import query from '../../const/connection';

export default async function (req, res) {
    const {storeid} = req.body;

    const tableGroups = await query("SELECT * FROM `store-table-group` WHERE storeid = ?",storeid);

    const arr = [];
    for(let i in tableGroups) {
        var tableGroup = tableGroups[i];
        const groupid = tableGroup.id;
        var tables = await query ("SELECT * FROM `store-table` WHERE groupid =?",groupid);

        tableGroup.tables = tables;
        arr.push(tableGroup);
    }
    res.status(200).json(arr);

}