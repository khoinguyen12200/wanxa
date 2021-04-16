import * as Yup from "yup";

export const accountValidator = Yup.string()
	.max(50, "Yêu cầu nhiều nhất 50 ký tự")
	.min(5, "Yêu cầu ít nhất 5 ký tự")
	.matches(/^[a-zA-Z0-9._]+$/, "Chỉ được phép chứa các ký tự a-zA-Z0-9._")
	.required("Bắt buộc phải có");

export const passwordValidator = Yup.string()
	.max(50, "Yêu cầu nhiều nhất 50 ký tự")
	.min(5, "Yêu cầu ít nhất 5 ký tự")
	.matches(/^[a-zA-Z0-9._@]+$/, "Chỉ được phép chứa các ký tự a-zA-Z0-9._@")
	.required("Bắt buộc phải có");

export const nameValidator = Yup.string()
	.max(50, "Yêu cầu nhiều nhất 50 ký tự")
	.min(5, "Yêu cầu ít nhất 5 ký tự")
	.matches(
		/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ 0-9]+$/,
		"Chỉ được phép chứa chữ, số và khoảng trắng"
	)
	.required("Bắt buộc phải có");

export const signInValidate = Yup.object({
	account: accountValidator,
	password: passwordValidator,
});

export default class Vaildate {
	static MenuItemName = Yup.string()
		.max(50, "Yêu cầu nhiều nhất 50 ký tự")
		.min(2, "Yêu cầu ít nhất 2 ký tự")
		.required("Bắt buộc phải có");

	static MenuItemDes = Yup.string().max(500, "Tối đa 500 ký tự");

	static MenuItemPrice = Yup.number().required("Bắt buộc phải có");
}
