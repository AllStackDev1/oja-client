import React from 'react'
import { Helmet } from 'react-helmet'
import { useFormik } from 'formik'
import {
  Flex,
  Box,
  Link,
  Grid,
  Text,
  Icon,
  Heading,
  GridItem,
  useToast
} from '@chakra-ui/react'
import { CustomInputGroup, ButtonPasswordToggler } from 'components/Forms'
import { FiUser, FiLock, FiSmartphone, FiArrowRight } from 'react-icons/fi'
import { FaFacebookSquare } from 'react-icons/fa'
import { GoogleIcon } from 'components/SVG'
import { NavLink } from 'react-router-dom'
import { CustomButton } from 'components/Auth'

const Signup = (): JSX.Element => {
  const [show, setShow] = React.useState(false)
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      phoneNumber: ''
    },
    // validationSchema
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true)
        // const res = await contactUs(values)
        toast({
          //   description: res.message,
          status: 'success',
          duration: 5000,
          position: 'top-right'
        })
        resetForm({})
      } catch (error) {
        toast({
          title: 'Error occured',
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

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Create an account. For user to use our application they have to create and account"
        />
        <title>Create an Account</title>
        <link rel="canonical" href="/auth/login" />
      </Helmet>
      <Flex w="full" h="100vh" bgColor="white">
        <Box py={14} w={126} m="auto" rounded="sm" px={{ xl: 100 }}>
          <Box mb={10}>
            <Heading textAlign="center" fontWeight={600} fontSize="3xl">
              Create an account
            </Heading>
            <Text textAlign="center" fontSize="md" color="gray.700">
              Lets make your savings come true
            </Text>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid gap={8}>
              <GridItem>
                <CustomInputGroup
                  h={12}
                  id="email"
                  border={0}
                  rounded={0}
                  type="email"
                  name="email"
                  label="Email address"
                  _focus={{ outline: 'none' }}
                  onBlur={formik.handleBlur}
                  error={formik.errors.email}
                  leftAddon={<Icon as={FiUser} />}
                  onChange={formik.handleChange}
                  placeholder="example@gmail.com"
                  touched={!!formik.touched.email}
                  defaultValue={formik.values.email}
                />
              </GridItem>
              <GridItem>
                <CustomInputGroup
                  h={12}
                  border={0}
                  rounded={0}
                  id="password"
                  name="password"
                  label="Password"
                  onBlur={formik.handleBlur}
                  placeholder="Your password"
                  _focus={{ outline: 'none' }}
                  error={formik.errors.password}
                  onChange={formik.handleChange}
                  leftAddon={<Icon as={FiLock} />}
                  type={show ? 'text' : 'password'}
                  touched={!!formik.touched.password}
                  defaultValue={formik.values.password}
                  rightAddon={<ButtonPasswordToggler {...{ show, setShow }} />}
                />
              </GridItem>
              <GridItem>
                <CustomInputGroup
                  h={12}
                  type="tel"
                  border={0}
                  rounded={0}
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  _focus={{ outline: 'none' }}
                  onBlur={formik.handleBlur}
                  error={formik.errors.phoneNumber}
                  leftAddon={<Icon as={FiSmartphone} />}
                  onChange={formik.handleChange}
                  placeholder="+234"
                  touched={!!formik.touched.phoneNumber}
                  defaultValue={formik.values.phoneNumber}
                />
              </GridItem>
              <GridItem pos="relative">
                <CustomButton
                  px={8}
                  w="full"
                  d="flex"
                  color="white"
                  bgColor="ojaDark"
                  title="Create your account"
                  _hover={{ bgColor: 'ojaDark' }}
                  fontSize={{ base: 'sm', xl: 'md' }}
                  rightIcon={
                    <FiArrowRight fontSize={20} className="auth-btn-arrow" />
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
                title="Signup with Facebook"
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
                title="Signup with Google"
              />
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  )
}

export default Signup
