import React, { useMemo } from 'react'
import { Modal } from '../ui/Modal'
import { Box } from '../ui/Box'
import { useListTokens } from '../../state/token/hook'
import { TokenIcon } from '../ui/TokenIcon'
import { useWalletBalance } from '../../state/wallet/hooks/useBalances'
import { TokenSymbol } from '../ui/TokenSymbol'
import { Text, TextGrey } from '../ui/Text'
import './style.scss'
import isEqual from 'react-fast-compare'
import { useResource } from '../../state/resources/hooks/useResource'
import {
  decodeErc1155Address,
  isErc1155Address,
  IEW,
  NUM,
  zerofy,
} from '../../utils/helpers'
import { MIN_POSITON_VALUE_USD_TO_DISPLAY, ZERO_ADDRESS } from '../../utils/constant'
import { useTokenValue } from '../SwapBox/hooks/useTokenValue'

const Component = ({
  visible,
  setVisible,
  tokens: tokensToSelect,
  onSelectToken,
  displayFee = false
}: {
  visible: boolean
  setVisible: any
  tokens: string[]
  onSelectToken: any
  displayFee?: boolean
}) => {
  return (
    <Modal setVisible={setVisible} visible={visible} title='Select Token'>
      <div className='select-token-modal'>
        {tokensToSelect.map((address: any, key: number) => {
          return (
            <Option
              key={key}
              address={address}
              setVisible={setVisible}
              onSelectToken={onSelectToken}
            />
          )
        })}
      </div>
    </Modal>
  )
}

const Option = ({
  onSelectToken,
  address,
  setVisible
}: {
  setVisible: any
  address: string
  onSelectToken: any
}) => {
  const { tokens } = useListTokens()
  const { pools } = useResource()
  const { balances } = useWalletBalance()

  const { value } = useTokenValue({
    tokenAddress: address,
    amount: IEW(balances[address], tokens[address]?.decimal || 18)
  })

  if (NUM(value) < MIN_POSITON_VALUE_USD_TO_DISPLAY) {
    return <React.Fragment/>
  }

  const [reserve, tokenR] = useMemo(() => {
    if (isErc1155Address(address)) {
      const { address: poolAddress } = decodeErc1155Address(address)
      const pool = pools[poolAddress]

      return [IEW(pool.states.R, tokens[pool.TOKEN_R].decimals), pool.TOKEN_R]
    }
    return ['0', ZERO_ADDRESS]
  }, [])

  const { value: price } = useTokenValue({
    tokenAddress: tokenR,
    amount: reserve
  })

  const symbol = <TokenSymbol token={address} />
  return (
    <Box
      className='option'
      onClick={() => {
        onSelectToken(address)
        setVisible(false)
      }}
    >
      <TokenIcon size={24} tokenAddress={address} />
      <div className='option__name-and-lp'>
        <Text>{symbol}</Text>
        {price && Number(price) > 0 ? (
          <div>
            <TextGrey>
              ${zerofy(NUM(price))}
            </TextGrey>
          </div>
        ) : (
          ''
        )}
      </div>
      {balances[address] && balances[address].gt(0) && (
        <div className='option__balance'>
          <Text>
            {zerofy(NUM(IEW(balances[address], tokens[address]?.decimal ?? 18)))}
          </Text>
          <TextGrey>
            ${zerofy(NUM(value))}
          </TextGrey>
        </div>
      )}
    </Box>
  )
}

export const SelectTokenModal = React.memo(Component, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
)
