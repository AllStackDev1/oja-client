import * as yup from 'yup'
import validator from 'validator'

export const RegistrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name requires a minimum of 2 characters')
    .required('First name is required*'),
  lastName: yup
    .string()
    .min(2, 'Last name requires a minimum of 2 characters')
    .required('Last name is required*'),
  username: yup
    .string()
    .min(4, 'Username requires a minimum of 4 characters')
    .required('Username is required*'),
  email: yup
    .string()
    .email('Provide a valid email address*')
    .required('Email is required*'),
  address: yup.object({
    country: yup.string().required('Country is required*')
  }),
  phoneNumber: yup
    .string()
    .test(
      'valid',
      'Provide a valid phone number, exclude country code*',
      value =>
        value
          ? validator.isMobilePhone(value, 'any', { strictMode: true })
          : true
    )
    .required('Phone number is required*'),
  password: yup
    .string()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message: `
        Provide a minimum 8 characters with; <br/> 
        An uppercase <br/> 
        A lowercase <br/> 
        A number <br/> 
        A special <br/> 
        A character <br/> 
    `
    })
    .required('Password is required*')
})

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Provide a valid email address*')
    .required('Email is required*'),
  password: yup.string().required('Password is required*')
})

export const ForgotPassSchema = yup.object().shape({
  email: yup
    .string()
    .email('Provide a valid email address*')
    .required('Email is required*')
})

export const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message: `
        Provide a minimum 8 characters with; <br/> 
        An uppercase <br/> 
        A lowercase <br/> 
        A number <br/> 
        A special <br/> 
        A character <br/> 
    `
    })
    .required('Password is required*'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match!')
    .required('Confirm your password*')
})

export const OtpVerifySchema = yup.object().shape({
  code: yup.string().required('This field is required*'),
  pinId: yup.string().required('This field is required*'),
  expiresIn: yup.string()
  // to: yup
})

const AccountDetailsSchema = yup.object().shape({
  bank: yup.object().shape({
    name: yup.string().required('This field is required*'),
    code: yup.string().required('This field is required*'),
    swiftCode: yup
      .string()
      .test('valid', 'Invalid Swift Code', value =>
        value ? validator.isBIC(value) : true
      ),
    routingNumber: yup
      .string()
      .test('valid', 'Provide a valid routing number', value =>
        value ? validator.isNumeric(value) : true
      )
      .typeError('you must specify a number')
  }),
  amount: yup.number().required(),
  accountName: yup.string().required('This field is required*'),
  accountNumber: yup
    .string()
    .test('valid', 'Provide a valid account number', value =>
      value ? validator.isNumeric(value) : false
    )
    .typeError('You need to specify a number')
    .required('This field is required*')
})

export const DealValidationSchema = yup.object().shape({
  debit: AccountDetailsSchema,
  credit: AccountDetailsSchema,
  type: yup.string().required(),
  rate: yup.number().required(),
  transactionFee: yup.number().required(),
  settlementFee: yup.number().required()
})
