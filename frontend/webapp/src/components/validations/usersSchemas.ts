// validations/userSchemas.js
import * as yup from 'yup';

export const newUserSchema = yup.object().shape({
  email: yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
  username: yup.string().required('Nazwa użytkownika jest wymagana'),
  first_name: yup.string().required('Imię jest wymagane'),
  last_name: yup.string().required('Nazwisko jest wymagane'),
  password: yup.string().min(8, 'Hasło musi mieć co najmniej 8 znaków').required('Hasło jest wymagane'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Hasła muszą się zgadzać')
    .required('Potwierdzenie hasła jest wymagane'),
  doctorDetails: yup
    .object({
      doctor_number: yup
        .string()
        .min(3, 'Minimum 3 znaki')
        .required('Numer lekarza jest wymagany'),
      doctor_specializations: yup
        .array()
        .of(yup.number().required('Wymagane jest podanie ID'))
        .min(1, 'Lekarz musi mieć co najmniej 1 specjalizację')
        .required('Specjalizacje są wymagane'),
    })
    .nullable()
    .notRequired(),
});

export const editUserSchema = yup.object().shape({
  email: yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
  first_name: yup.string().required('Imię jest wymagane'),
  last_name: yup.string().required('Nazwisko jest wymagane'),
  doctorDetails: yup.object().shape({
    doctor_number: yup.string().min(3, 'Minimum 3 znaki').required('Numer lekarza jest wymagany'),
    doctor_specializations: yup.array()
      .of(yup.number().required('Wymagane jest podanie ID'))
      .min(1, 'Lekarz musi mieć co najmniej 1 specjalizację')
      .required('Specjalizacje są wymagane'),
  }).notRequired(),
});

export const editUserGroupsSchema = yup.object().shape({
  groups: yup.array().of(yup.number()).min(1, 'At least one group must be selected'),
  id: yup.string(),
});
