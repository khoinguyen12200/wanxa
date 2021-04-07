import query from "../../const/connection";
import formParse from "../../const/form";
import {
	getUserIdByToken,
	isUserHasPrivileges,
	PRIVILEAPI,
	getPrivileges,
} from "../../const/querySample";

export default async function index(req, res) {
	const { userid, privileges, token, storeid } = req.body;
	const changerId = await getUserIdByToken(token);
	var changerPrivileges = await getPrivileges(changerId, storeid);
	changerPrivileges = PRIVILEAPI.getUserRights(changerPrivileges);

	const oldPrivileges = await getPrivileges(userid, storeid); // gia tri privileges cu~
	var ownerIsChanged = false;
	if (
		PRIVILEAPI.isUserHasPrivileges(oldPrivileges, PRIVILEAPI.OWNER) !=
        // kiem tra xem co thay doi chu quyen so huu khong
		PRIVILEAPI.isUserHasPrivileges(privileges, PRIVILEAPI.OWNER)
	) {
		ownerIsChanged = true;
	}

    var isValid = false;
	if (
		changerPrivileges.includes(PRIVILEAPI.OWNER) ||
		changerPrivileges.includes(PRIVILEAPI.HRM)
	) {
        isValid = true;
        if(ownerIsChanged && !changerPrivileges.includes(PRIVILEAPI.OWNER)) {
            isValid = false;
        }
	}
    
    if(isValid) {
        const changeResult = query(
            "UPDATE `privileges` SET `value`=? WHERE storeid =? and userid =?",
            [privileges, storeid, userid]
        );
        res.status(200).json({
            message: "Thay đổi quyền nhân viên hoàn tất",
        });
        return;
    }

	res.status(202).json({ message: "Bạn không đủ quyền để thay đổi" });
	return;
}
