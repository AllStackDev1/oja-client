import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Button, Flex, Link, IconButton } from '@chakra-ui/react'
import { FiMenu, FiX } from 'react-icons/fi'

import useApp from 'context/App'
import useAuth from 'context/Auth'
import Logo from 'assets/images/logo.svg'
import MobileDropdown from './MobileDropdown'
import * as _ from 'lodash'
import UserMenu from './UserMenu'

const LandingNav: React.FC<RouteComponentProps> = ({
  location: { pathname }
}): JSX.Element => {
  const { toggleMenu, isMenuOpen } = useApp()
  const { isAuthenticated } = useAuth()

  const isAuth = !_.isEmpty(isAuthenticated())

  const menus = [
    {
      id: 1,
      link: '/',
      title: 'Home',
      isDisabled: false
    },
    {
      id: 2,
      isDisabled: false,
      title: 'Privacy Policy',
      link: '/privacy-policy'
    },
    {
      id: 3,
      isDisabled: false,
      title: 'Terms and Conditions',
      link: '/terms-and-conditions'
    },
    {
      id: 4,
      title: 'Log In',
      link: '/auth/login',
      isDisabled: isAuth
    },
    {
      id: 5,
      title: 'Create an Account',
      btnLink: '/auth/register',
      isDisabled: isAuth
    },
    {
      id: 6,
      Component: () => <UserMenu placement="bottom-start" w={56} />
    }
  ]

  return (
    <Box pos="relative" bg="ojaDark" color="white">
      <Flex
        pl={28}
        pr={20}
        as="nav"
        w="100%"
        role="nav"
        align="center"
        justify="space-between"
        fontSize={{ lg: 'sm', xl: 'md' }}
        h={{ base: 16, md: '4.5rem', xl: 28 }}
      >
        <Link to="/" _focus={{ outline: 'none' }} _hover={{ outline: 'none' }}>
          <Box
            bgImage={`url('${Logo}')`}
            bgSize="contain"
            bgRepeat="no-repeat"
            w={16}
            h={9}
          />
        </Link>

        <Flex
          align="center"
          fontSize="2xs"
          justify="flex-end"
          right={{ md: 10, xl: 0 }}
          d={{ base: 'none', xl: 'flex' }}
        >
          {menus.map(({ id, link, title, btnLink, Component, isDisabled }) => (
            <React.Fragment key={id}>
              {link && !isDisabled && (
                <Link
                  mr={8}
                  href={link}
                  color={
                    pathname.split('/')[1] === link.split('/')[1]
                      ? 'ojaSkyBlue'
                      : ''
                  }
                  fontSize={{ xl: 'md' }}
                  _focus={{ outline: 'none' }}
                  _hover={{ color: 'ojaSkyBlue' }}
                >
                  {title}
                </Link>
              )}

              {btnLink && !isDisabled && (
                <Link
                  href={btnLink}
                  _hover={{ hover: 'none' }}
                  _focus={{ outline: 'none' }}
                  rel="noreferrer"
                >
                  <Button
                    rounded="sm"
                    boxShadow="lg"
                    h={{ md: 12 }}
                    variant="outline"
                    color="ojaYellow"
                    fontWeight={700}
                    fontSize={{ base: 'sm', xl: 'sm' }}
                    _focus={{ outline: 'none' }}
                    _hover={{ bg: 'ojaSkyBlue', borderColor: 'ojaSkyBlue' }}
                  >
                    {title}
                  </Button>
                </Link>
              )}

              {Component && isAuth && <Component />}
            </React.Fragment>
          ))}
        </Flex>

        <Box
          px={2}
          pos="absolute"
          right={0}
          onClick={() => toggleMenu()}
          d={{ base: 'block', xl: 'none' }}
        >
          <IconButton
            p={0}
            w={6}
            fontSize={25}
            colorScheme="none"
            aria-label="Open Mobile Menu"
            _focus={{ outline: 'none' }}
            icon={isMenuOpen ? <FiMenu /> : <FiX />}
          />
        </Box>
      </Flex>

      {isMenuOpen && (
        <Box
          w="100%"
          px={10}
          pt={16}
          h="100vh"
          zIndex={1}
          pos="fixed"
          d={{ base: 'block', xl: 'none' }}
        >
          {menus
            .filter(menu => !menu.btnLink || !menu.Component)
            .map(menu => (
              <MobileDropdown
                item={menu}
                key={menu.id}
                toggleMenu={toggleMenu}
              />
            ))}
        </Box>
      )}
    </Box>
  )
}

export default LandingNav
