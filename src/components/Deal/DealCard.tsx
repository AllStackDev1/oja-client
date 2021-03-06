import React from 'react'
import moment from 'moment'
import {
  Box,
  Text,
  Icon,
  Flex,
  Link,
  Heading,
  Progress
} from '@chakra-ui/react'
import { Link as ReactLink } from 'react-router-dom'
import {
  FaEye,
  FaMoneyBill,
  FaLongArrowAltUp,
  FaLongArrowAltDown
} from 'react-icons/fa'
import { DealStatusEnum, IActiveDealsLatestTransaction } from 'interfaces'
import { VendToIcon } from 'components/SVG'

const DealCard: React.FC<IActiveDealsLatestTransaction> = ({
  _id,
  debit,
  credit,
  status,
  progress,
  latestTransaction
}): JSX.Element => {
  const isTrue = latestTransaction?.type === 'Received'

  const getProgressColorSchema = (key: number) => {
    switch (true) {
      case key <= 25:
        return 'ojaColorSchemaError'
      case key <= 50:
        return 'orange'
      case key <= 75:
        return 'ojaColorSchemaSkyBlue'
      case key <= 100:
        return 'green'
      default:
        return 'ojaColorSchemaError'
    }
  }

  const getBtnLinkData = () => {
    switch (status) {
      case DealStatusEnum.PENDING:
        return { to: 'funding', icon: FaMoneyBill, title: 'Fund' }
      case DealStatusEnum.PROCESSING:
      default:
        return { to: 'deals', icon: FaEye, title: 'Details' }
    }
  }

  const { to, icon, title } = getBtnLinkData()

  return (
    <Box p={5} w="full">
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <Icon as={VendToIcon} color="ojaDark" />
          <Text ml={3} fontSize="md" letterSpacing="-0.4px">
            {debit?.currency?.name} to {credit?.currency?.name}
          </Text>
        </Flex>
        <Link
          px={3}
          py={1}
          d="flex"
          to={`/dashboard/${to}/${_id}`}
          rounded="5px"
          as={ReactLink}
          borderWidth={1}
          alignItems="center"
          color="ojaSkyBlue"
          borderColor="ojaSkyBlue"
          bgColor="ojaSkyBlueFade"
          _hover={{ textDecor: 'none' }}
        >
          <Icon as={icon} />
          <Text as="span" ml={2}>
            {title}
          </Text>
        </Link>
      </Flex>
      {latestTransaction ? (
        <Text fontSize="sm" letterSpacing="-0.4px" color="gray.400">
          {isTrue ? credit?.currency?.symbol : debit?.currency?.symbol}
          {latestTransaction.amount}
          <Icon
            boxSize={4}
            as={isTrue ? FaLongArrowAltUp : FaLongArrowAltDown}
            color={isTrue ? 'green.300' : 'red.300'}
          />{' '}
          {isTrue ? 'received from' : 'sent to'} {latestTransaction.user}
        </Text>
      ) : (
        <Box h={5} />
      )}
      <Heading mt={2} fontSize="x-small" lineHeight="12px">
        Deals Progress
      </Heading>
      <Flex w="full" align="center">
        <Box w="50%" mr={5}>
          <Progress
            value={progress}
            h={1}
            colorScheme={getProgressColorSchema(progress)}
          />
        </Box>
        <Text
          as="span"
          fontWeight={800}
          fontSize="x-small"
          color={getProgressColorSchema(progress)}
        >
          {progress}%
        </Text>
      </Flex>
      {latestTransaction ? (
        <Text
          mt={2}
          mb={3}
          fontSize="sm"
          fontWeight="light"
          letterSpacing="-0.4px"
        >
          {moment(latestTransaction.createdAt).fromNow()}
        </Text>
      ) : (
        <Box h={4} />
      )}
    </Box>
  )
}

export default DealCard
