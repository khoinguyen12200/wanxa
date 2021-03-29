import * as Yup from 'yup'


export const accountValidator = Yup.string()
    .max(50, "Yêu cầu nhiều nhất 50 ký tự")
    .min(5, "Yêu cầu ít nhất 5 ký tự")
    .matches(/^[a-zA-Z0-9._]+$/, "Chỉ được phép chứa các ký tự a-zA-Z0-9._")
    .required("Bắt buộc phải có")

export const passwordValidator = Yup.string()
    .max(50, "Yêu cầu nhiều nhất 50 ký tự")
    .min(5, "Yêu cầu ít nhất 5 ký tự")
    .matches(/^[a-zA-Z0-9._@]+$/, "Chỉ được phép chứa các ký tự a-zA-Z0-9._@")
    .required("Bắt buộc phải có")

export const nameValidator = Yup.string()
    .max(50, "Yêu cầu nhiều nhất 50 ký tự")
    .min(5, "Yêu cầu ít nhất 5 ký tự")
    .matches(/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]+$/
        , "Chỉ được phép chứa chữ và khoảng trắng")
    .required("Bắt buộc phải có")

export const signInValidate = Yup.object({
    account: accountValidator,
    password: passwordValidator,
})
