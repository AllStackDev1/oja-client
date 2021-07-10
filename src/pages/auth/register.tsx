import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useFormik } from 'formik'
import {
  Box,
  Flex,
  Link,
  Grid,
  Text,
  Icon,
  Heading,
  GridItem,
  useToast
} from '@chakra-ui/react'
import { NavLink, RouteComponentProps } from 'react-router-dom'
import {
  FiUser,
  FiMail,
  FiUserX,
  FiUserPlus,
  FiUserCheck,
  FiArrowRight
} from 'react-icons/fi'
import { FaFacebookSquare } from 'react-icons/fa'

import {
  CustomInputGroup,
  CustomPasswordInput,
  CustomPhoneInput
} from 'components/Forms'
import { GoogleIcon } from 'components/SVG'
import { CustomButton } from 'components/Auth'

import useApi from 'context/Api'

import { RegisterUserPayloadDto } from 'interface/user.interface'
import { RegistrationSchema } from 'utils/validator-schemas'
import SmallSpinner from 'components/Loading/Small'

const Register: React.FC<RouteComponentProps> = ({ history }): JSX.Element => {
  const [isUserNamePicked, setUserNamePicked] = useState<boolean>()
  const [selectedCountry, setSelectedCountry] = useState('NG')
  const [isLoading, setLoading] = useState<boolean>(false)
  const { register, getUsers } = useApi()
  const toast = useToast()

  const initialValues = {
    email: '',
    lastName: '',
    userName: '',
    password: '',
    firstName: '',
    phoneNumber: '',
    address: { country: '' }
  } as RegisterUserPayloadDto

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true)
        const res = await register(values)
        toast({
          title: res.message,
          description: `An OTP has been sent to ${res.data?.phoneNumber}`,
          status: 'success',
          duration: 5000,
          position: 'top-right'
        })
        resetForm({})
        history.push(
          `/auth/${btoa(
            JSON.stringify({
              phoneNumber: res.data?.phoneNumber || '',
              pinId: res.otpResponse?.pinId || ''
            })
          )}`
        )
      } catch (error) {
        toast({
          title: 'Error occurred',
          description:
            error?.message ||
            error?.data?.message ||
            'Unexpected network error.',
          status: 'error',
          duration: 5000,
          position: 'top-right'
        })
      } finally {
        setSubmitting(false)
      }
    }
  })

  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue
  } = formik

  const UserNameIcon = () => {
    if (typeof isUserNamePicked === 'undefined') {
      return FiUserPlus
    }
    if (isUserNamePicked) {
      return FiUserX
    } else {
      return FiUserCheck
    }
  }

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Create an account. For user to use our application they have to create and account"
        />
        <title>Oja's | Create Account</title>
        <link rel="canonical" href="/auth/login" />
      </Helmet>
      <Flex w="full" h="100vh" bgColor="white">
        <Box py={14} w={127} m="auto" rounded="sm" px={{ xl: 100 }}>
          <Box>
            <Box mb={10}>
              <Heading textAlign="center" fontWeight={600} fontSize="3xl">
                Create Account
              </Heading>
              <Text textAlign="center" fontSize="md" color="gray.700">
                Let's make your savings come true
              </Text>
            </Box>
            <form onSubmit={handleSubmit}>
              <Grid
                templateColumns={{ lg: 'repeat(2, 1fr)' }}
                columnGap={{ base: 3, lg: 4 }}
                rowGap={{ base: 3, lg: 8 }}
              >
                {/* first name */}
                <GridItem>
                  <CustomInputGroup
                    h={12}
                    border={0}
                    rounded={0}
                    isRequired
                    id="firstName"
                    type="firstName"
                    name="firstName"
                    label="First Name"
                    placeholder="John"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.firstName}
                    _focus={{ outline: 'none' }}
                    touched={!!touched.firstName}
                    defaultValue={values.firstName}
                    leftAddon={<Icon as={FiUser} />}
                  />
                </GridItem>
                {/* last name */}
                <GridItem>
                  <CustomInputGroup
                    h={12}
                    border={0}
                    rounded={0}
                    isRequired
                    id="lastName"
                    type="lastName"
                    name="lastName"
                    label="Last Name"
                    placeholder="Doe"
                    onBlur={handleBlur}
                    error={errors.lastName}
                    onChange={handleChange}
                    _focus={{ outline: 'none' }}
                    touched={!!touched.lastName}
                    defaultValue={values.lastName}
                    leftAddon={<Icon as={FiUser} />}
                  />
                </GridItem>
                {/* user name */}
                <GridItem>
                  <CustomInputGroup
                    h={12}
                    border={0}
                    rounded={0}
                    isRequired
                    id="userName"
                    type="userName"
                    name="userName"
                    onBlur={async e => {
                      setUserNamePicked(false)
                      handleBlur(e)
                      try {
                        setLoading(true)
                        const res = await getUsers({
                          userName: e.target.value
                        })
                        if (res.length) setUserNamePicked(true)
                      } catch (err) {
                        console.log(err)
                      } finally {
                        setLoading(false)
                      }
                    }}
                    onChange={e => {
                      setUserNamePicked(false)
                      handleChange(e)
                    }}
                    error={
                      isUserNamePicked
                        ? 'Username already picked'
                        : errors.userName
                    }
                    label="Username"
                    touched={!!touched.userName || !!isUserNamePicked}
                    _focus={{ outline: 'none' }}
                    defaultValue={values.userName}
                    leftAddon={
                      <Icon
                        as={UserNameIcon()}
                        color={isUserNamePicked ? 'red.500' : ''}
                      />
                    }
                    rightAddon={
                      isLoading ? <SmallSpinner thickness="2px" /> : undefined
                    }
                    placeholder="JohnDoe1"
                  />
                </GridItem>
                {/* email */}
                <GridItem>
                  <CustomInputGroup
                    h={12}
                    id="email"
                    isRequired
                    border={0}
                    rounded={0}
                    type="email"
                    name="email"
                    onBlur={handleBlur}
                    error={errors.email}
                    label="Email"
                    onChange={handleChange}
                    touched={!!touched.email}
                    defaultValue={values.email}
                    _focus={{ outline: 'none' }}
                    placeholder="johndoe@gmail.com"
                    leftAddon={<Icon as={FiMail} />}
                  />
                </GridItem>
                {/* password */}
                <GridItem>
                  <CustomPasswordInput
                    h={12}
                    border={0}
                    rounded={0}
                    id="password"
                    name="password"
                    label="Password"
                    onBlur={handleBlur}
                    error={errors.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    _focus={{ outline: 'none' }}
                    touched={!!touched.password}
                    defaultValue={values.password}
                  />
                </GridItem>
                {/* confirm password */}
                <GridItem>
                  <CustomPasswordInput
                    h={12}
                    border={0}
                    rounded={0}
                    onBlur={handleBlur}
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    onChange={handleChange}
                    _focus={{ outline: 'none' }}
                    error={errors.confirmPassword}
                    placeholder="Confirm Password"
                    touched={!!touched.confirmPassword}
                    defaultValue={values.confirmPassword}
                  />
                </GridItem>
                {/* phone input */}
                <GridItem colSpan={2}>
                  <CustomPhoneInput
                    h={12}
                    pl={0}
                    border={0}
                    rounded={0}
                    isRequired
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    onBlur={handleBlur}
                    countryId="address.country"
                    error={errors.phoneNumber}
                    _focus={{ outline: 'none' }}
                    setFieldValue={setFieldValue}
                    touched={!!touched.phoneNumber}
                    selectedCountry={selectedCountry}
                    defaultValue={values.phoneNumber}
                    setSelectedCountry={setSelectedCountry}
                  />
                </GridItem>
                {/* form btn */}
                <GridItem colSpan={2}>
                  <CustomButton
                    px={8}
                    w="full"
                    d="flex"
                    type="submit"
                    color="white"
                    bgColor="ojaDark"
                    isLoading={isSubmitting}
                    title="Create your account"
                    _hover={{ bgColor: 'ojaDark' }}
                    fontSize={{ base: 'sm', xl: 'md' }}
                    rightIcon={
                      <FiArrowRight fontSize={20} className="auth-btn-arrow" />
                    }
                    isDisabled={
                      isSubmitting || !(dirty && isValid) || isUserNamePicked
                    }
                  />
                </GridItem>
              </Grid>
              <Flex my={{ xl: 8 }} w="full" justify="center">
                <Text>
                  Already have an account{' '}
                  <Link as={NavLink} fontWeight="bold" to="/auth/login">
                    Login
                  </Link>
                </Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <CustomButton
                  mr={1}
                  shadow="lg"
                  fontSize="sm"
                  bgColor="white"
                  color="gray.700"
                  _hover={{ bgColor: 'none' }}
                  title="Sign up with Facebook"
                  leftIcon={<FaFacebookSquare color="#385997" fontSize={30} />}
                />
                <CustomButton
                  ml={1}
                  shadow="lg"
                  fontSize="sm"
                  color="gray.700"
                  bgColor="white"
                  _hover={{ bgColor: 'none' }}
                  leftIcon={<Icon as={GoogleIcon} />}
                  title="Sign up with Google"
                />
              </Flex>
            </form>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

Register.propTypes = {
  history: PropTypes.any.isRequired
}

export default Register