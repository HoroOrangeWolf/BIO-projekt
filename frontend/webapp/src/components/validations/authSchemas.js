import * as yup from 'yup';
import i18n from "i18next";

export const loginSchema = yup.object().shape({
  username: yup.string().required(`${i18n.t("core:login.validation.username_required")}`),
  password: yup.string().required(`${i18n.t("core:login.validation.password_required")}`),
});

export const otpSchema = loginSchema.shape({
  otp: yup.string().required(`${i18n.t("core:otp.validation.required")}`).length(6, `${i18n.t("core:otp.validation.min_length")}`),
});

export const setupTOTPSchema = yup.object().shape({
  token: yup.string().required(`${i18n.t("core:otp.validation.required")}`).length(6, `${i18n.t("core:otp.validation.min_length")}`),
});

export const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});
