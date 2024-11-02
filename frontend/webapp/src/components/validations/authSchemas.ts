import * as yup from 'yup';
import i18n from 'i18next';

export const loginSchema = yup.object().shape({
  username: yup.string().required(`${i18n.t('core:login.validation.username_required')}`),
  password: yup.string().required(`${i18n.t('core:login.validation.password_required')}`),
});

export const otpSchema = loginSchema.shape({
  otp: yup.string().required(`${i18n.t('core:otp.validation.required')}`).length(6, `${i18n.t('core:otp.validation.min_length')}`),
});

export const setupTOTPSchema = yup.object().shape({
  token: yup.string().required(`${i18n.t('core:otp.validation.required')}`).length(6, `${i18n.t('core:otp.validation.min_length')}`),
});

export const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 6 characters').required('Password is required'),
  first_name: yup.string()
    .required('First name is required'),
  last_name: yup.string()
    .required('Last name is required'),
  pesel: yup.string()
    .length(11, 'PESEL must be exactly 11 digits')
    .matches(/^\d+$/, 'PESEL can only contain digits')
    .required('Pesel is required'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Password must match'),
});
