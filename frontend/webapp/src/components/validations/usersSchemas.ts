// validations/userSchemas.js
import * as yup from 'yup';

export const newUserSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

export const editUserSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
});

export const editUserGroupsSchema = yup.object().shape({
  groups: yup.array().of(yup.number()).min(1, 'At least one group must be selected'),
  id: yup.string(),
});
