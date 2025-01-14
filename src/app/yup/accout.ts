import * as yup from "yup";

export const Accout = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  username: yup
    .string()

    .required("Vui lòng nhập username"),
  last_name: yup
    .string()

    .required("Vui lòng nhập email"),
  first_name: yup
    .string()

    .required("Vui lòng nhập email"),
  phone: yup
    .string()
    .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});


export const LoginFormYup = yup.object().shape({
  username: yup.string().required("Vui lòng nhập username"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});
