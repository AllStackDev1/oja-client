import React from 'react'
import Wrapper from 'containers/Layout/Wrapper'
import { Box, Text, Icon, Flex, Grid, GridItem } from '@chakra-ui/react'
import { IoMdInformationCircle } from 'react-icons/io'
import {
  AmountSentCard,
  RecentTransactions,
  AmountReceivedCard,
  ActiveTransactions
} from 'components/Dashboard/Home'

const Home = (): JSX.Element => {
  return (
    <Wrapper
      title="Home | Dashboard"
      href="/dashboard/home"
      content="This is the application dashboard home page"
    >
      <Grid mx={10} columnGap={6} templateColumns="repeat(3, 1fr)">
        <GridItem colSpan={2}>
          <Box borderTopRadius="lg" boxShadow="main">
            <Box p={6}>
              <Text fontWeight={600} fontSize="md">
                Dollar to Naira
              </Text>
              <Text fontWeight="300" fontSize="26px">
                100,000.00
              </Text>
            </Box>
            <Flex p={6} color="white" bgColor="ojaDark">
              <Icon as={IoMdInformationCircle} boxSize={6} />
              <Text ml={3} fontSize="sm" lineHeight="150%">
                Cas should reflect Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incid id unt ut labore et
                dolore magna aliqua
              </Text>
            </Flex>
          </Box>
          <RecentTransactions />
        </GridItem>
        <GridItem colSpan={1}>
          <Grid rowGap={8}>
            <AmountSentCard />
            <AmountReceivedCard />

            <ActiveTransactions />
          </Grid>
        </GridItem>
      </Grid>
    </Wrapper>
  )
}

export default Home
