import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { useHistory, useLocation } from 'react-router-dom'
import { FiChevronLeft } from 'react-icons/fi'
import { Box, Icon, Flex } from '@chakra-ui/react'

import Sidebar from '../Sidebar'
import useAuth from 'context/Auth'
import CustomAlert from 'components/Auth/CustomAlert'

interface IWrapper {
  href: string
  title: string
  content?: string
}

const Wrapper: React.FC<IWrapper> = ({
  href,
  title,
  content,
  children
}): JSX.Element => {
  const { isAuthenticated } = useAuth()
  const { user } = isAuthenticated()
  const history = useHistory()
  const { pathname } = useLocation()

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={content} />
        <title>{title}</title>
        <link rel="canonical" href={href} />
      </Helmet>
      <Flex
        as="main"
        h="100vh"
        bgColor="white"
        fontFamily="body"
        overflowX="hidden"
      >
        <Sidebar />
        <Box
          py={8}
          px={10}
          w="95%"
          ml="5%"
          h="full"
          pos="relative"
          overflowY="scroll"
          overflowX="hidden"
        >
          {!user?.isEmailVerified && (
            <CustomAlert
              right={4}
              w={110}
              bottom={5}
              type="info"
              pos="fixed"
              successMessage="Please confirm you email, check your inbox or junk a verification link was sent from OJA's team"
            />
          )}
          {pathname !== '/dashboard/deals' && (
            <Box pos="absolute">
              <Flex
                w={7}
                h={7}
                role="button"
                rounded="full"
                align="center"
                justify="center"
                bgColor="ojaDark"
                onClick={() => history.goBack()}
              >
                <Icon as={FiChevronLeft} color="ojaSkyBlue" />
              </Flex>
            </Box>
          )}
          {children}
        </Box>
      </Flex>
    </>
  )
}

Wrapper.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string
}

export default Wrapper
