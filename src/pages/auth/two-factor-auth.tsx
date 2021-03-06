/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { useFormik } from 'formik'
import { RouteComponentProps } from 'react-router-dom'
import { Flex, Box, Text, Heading, Button } from '@chakra-ui/react'
import { CustomOTPInput } from 'components/Forms'
import { FiArrowRight } from 'react-icons/fi'
import { CustomButton } from 'components/Auth'

import useApi from 'context/Api'
import useAuth from 'context/Auth'

import { OtpVerifySchema } from 'utils/validator-schemas'
import CustomAlert from 'components/Auth/CustomAlert'
import { sec2min } from 'utils/helpers'

interface IData {
  phoneNumber: string
  pinId?: string
}

interface RouteParams {
  token: string
}

const TwoFactorAuth: React.FC<RouteComponentProps<RouteParams>> = ({
  match: {
    params: { token }
  },
  history
}): JSX.Element => {
  const [counter, setCounter] = React.useState(120)
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<IData>()

  const {
    store,
    rememberMe,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage
  } = useAuth()
  const { verifyOTP, resendOTP } = useApi()

  React.useEffect(() => {
    if (!token) {
      history.push('/auth/register')
    } else {
      try {
        const decode: IData = JSON.parse(atob(token))
        if (decode.phoneNumber) {
          setData(decode)
        } else {
          history.push('/auth/register')
        }
      } catch (err) {
        history.push('/auth/register')
      }
    }
  }, [token])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: '',
      pinId: data?.pinId,
      expiresIn: rememberMe ? '60d' : '7d'
      // to: data.phoneNumber
    },
    validationSchema: OtpVerifySchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true)
      verifyOTP(values)
        .then(res => {
          if (res.success) {
            resetForm({})
            store({ user: res.user, authToken: res.authToken })
            history.push('/dashboard/deals')
          }
        })
        .finally(() => setSubmitting(false))
    }
  })

  React.useEffect(() => {
    setErrorMessage(null)
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000)
  }, [counter, setErrorMessage])

  const handleResendCode = async () => {
    try {
      setCounter(300)
      setLoading(true)
      const res = await resendOTP({ phoneNumber: data?.phoneNumber || '' })
      setErrorMessage(null)
      formik.setFieldValue('pinId', res.message?.pin_id)
      setSuccessMessage(`A new OTP has been sent to ${res.message?.to}`)
    } catch (error: any) {
      setSuccessMessage(null)
      setErrorMessage(
        error?.message || error?.data?.message || 'Unexpected network error.'
      )
    } finally {
      setLoading(false)
    }
  }

  const {
    dirty,
    values,
    errors,
    isValid,
    handleSubmit,
    isSubmitting,
    setFieldValue
  } = formik

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="This is the application login page" />
        <title>Oj'a. | OTP Verification</title>
        <link rel="canonical" href="/auth/login" />
      </Helmet>
      <Flex w="full" h="100vh" bgColor="white">
        <Box py={14} w="heroHeight" m="auto" rounded="sm" px={{ xl: 100 }}>
          <Box mb={10}>
            <Heading textAlign="center" fontWeight={600} fontSize="3xl">
              OTP Verification
            </Heading>
            <Text textAlign="center" fontSize="md" color="gray.700">
              A SMS with your One time password have been sent to{' '}
              <b>{data?.phoneNumber}</b>, input the code below and continue.
            </Text>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box mb={8}>
              <CustomOTPInput
                value={values.code}
                error={errors.code}
                isDisabled={isSubmitting}
                onChange={(c: string) => setFieldValue('code', c)}
              />
            </Box>

            <Box mx="auto" w="90%" mt={{ xl: 14 }}>
              <CustomButton
                px={8}
                w="full"
                d="flex"
                type="submit"
                color="white"
                bgColor="ojaDark"
                _hover={{ bgColor: 'ojaDark' }}
                title="Authenticate..."
                fontSize={{ base: 'sm', xl: 'md' }}
                rightIcon={
                  <FiArrowRight fontSize={20} className="auth-btn-arrow" />
                }
                isDisabled={isSubmitting || !(dirty && isValid)}
                isLoading={isSubmitting}
              />
            </Box>
            <Box textAlign="center" mt={{ lg: 8 }}>
              <Text fontSize="sm">
                Didn't receive code, wait for {sec2min(counter)} to try again.
              </Text>

              {!counter && (
                <Button
                  p={0}
                  h="unset"
                  bg="transparent"
                  type="button"
                  color="ojaDark"
                  isLoading={loading}
                  isDisabled={loading}
                  _hover={{ bg: 'transparent' }}
                  onClick={() => handleResendCode()}
                >
                  Resend code
                </Button>
              )}
            </Box>
            {(successMessage || errorMessage) && (
              <CustomAlert
                type={successMessage ? 'success' : 'error'}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />
            )}
          </form>
        </Box>
      </Flex>
    </>
  )
}

TwoFactorAuth.propTypes = {
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired
}

export default TwoFactorAuth
