/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import {
  Box,
  Icon,
  Grid,
  Flex,
  Text,
  GridItem,
  Heading,
  useDisclosure
} from '@chakra-ui/react'
import LoadingBar from 'react-top-loading-bar'

import Wrapper from 'containers/Layout/Wrapper'
import { DealCard } from 'components/Deal'
import { CustomButton } from 'components/Auth'

import useApi from 'context/Api'
import ReloadCard from 'components/ReloadCard'
import { CreateDealModal } from 'components/Deal/Create'
import { EmptyTableIcon } from 'components/SVG'

const Deals = (): JSX.Element => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const ref = React.useRef<any>()
  const { push } = useHistory()
  const { getDeals } = useApi()

  const { data, isLoading, error, refetch, isFetching } = useQuery(
    'deals',
    () => getDeals(),
    {
      retry: true,
      refetchOnMount: 'always',
      staleTime: 10 * 60 * 1000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    }
  )

  React.useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('new-deal') || 'null')
    if (data) {
      push(`/dashboard/funding/${data._id}`)
    }
  }, [])

  React.useEffect(() => {
    if (!isFetching) {
      ref.current?.complete()
    }
  }, [isFetching])

  return (
    <div>
      <LoadingBar color="#00D0BE" height={3} ref={ref} />
      <Wrapper
        title="Oj'a. | Deals"
        href="/dashboard/deals"
        content="This page shows all deals"
      >
        <Box px={{ xl: 10 }} mt={{ xl: 10 }} w="full">
          <Flex w="full" mb={{ xl: 5 }} align="center" justify="space-between">
            <Heading>Your Deals</Heading>
            <Box w={{ xl: 80 }}>
              <CustomButton
                px={8}
                h={{ xl: 20 }}
                w="full"
                d="flex"
                type="button"
                color="white"
                bgColor="ojaDark"
                title="CREATE NEW DEAL"
                _hover={{ bgColor: 'ojaDark' }}
                fontSize={{ base: 'sm', xl: 'md' }}
                onClick={() => onOpen()}
                rightIcon={
                  <FiArrowRight fontSize={20} className="auth-btn-arrow" />
                }
              />
            </Box>
          </Flex>
          {isLoading || error ? (
            <ReloadCard
              h="50vh"
              error={error}
              justify="center"
              refetch={refetch}
              text="fetching deals"
              isLoading={isLoading}
            />
          ) : (
            <>
              {!data?.data?.length ? (
                <Flex h={120} align="center" flexDir="column" justify="center">
                  <Icon as={EmptyTableIcon} boxSize={10} />
                  <Text mt={10}>There are no deal(s) made yet</Text>
                </Flex>
              ) : (
                <Grid
                  gap={5}
                  templateRows="repeat(4, 1fr)"
                  templateColumns={{
                    base: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                    '2xl': 'repeat(3, 1fr)',
                    '4xl': 'repeat(4, 1fr)'
                  }}
                >
                  {data?.data?.map(r => (
                    <GridItem
                      key={r._id}
                      rounded="lg"
                      borderWidth={1}
                      boxShadow="main"
                      borderColor="gray.100"
                    >
                      <DealCard {...r} />
                    </GridItem>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Box>
        <CreateDealModal onClose={onClose} isOpen={isOpen} />
      </Wrapper>
    </div>
  )
}

export default Deals
