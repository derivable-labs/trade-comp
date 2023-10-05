import React, { Fragment } from 'react'
import { IEW, formatFloat, getTitleBuyTradeType, whatDecimalSeparator, zerofy } from '../../../utils/helpers'
import formatLocalisedCompactNumber, { formatWeiToDisplayNumber } from '../../../utils/formatBalance'
import { TokenSymbol } from '../../ui/TokenSymbol'
import { TRADE_TYPE } from '../../../utils/constant'
import { useWalletBalance } from '../../../state/wallet/hooks/useBalances'
import { useListTokens } from '../../../state/token/hook'
import { Box } from '../../ui/Box'
import { useSettings } from '../../../state/setting/hooks/useSettings'
import { useTokenValue } from '../../SwapBox/hooks/useTokenValue'
import { bn } from 'derivable-tools/dist/utils/helper'
import { SkeletonLoader } from '../../ui/SkeletonLoader'

type Props = {
    outputTokenAddress: string,
    tradeType: TRADE_TYPE,
    amountIn: string,
    amountOut: string,
    valueOut: string,
    power: number,
}
export const EstimateBox = ({
  outputTokenAddress,
  tradeType,
  amountIn,
  amountOut,
  valueOut,
  power
}: Props) => {
  const { balances } = useWalletBalance()
  const { tokens } = useListTokens()
  const { settings } = useSettings()
  const showSize =
  tradeType === TRADE_TYPE.LONG || tradeType === TRADE_TYPE.SHORT
  const { value: valueOutBefore } = useTokenValue({
    amount: IEW(
      balances[outputTokenAddress],
      tokens[outputTokenAddress]?.decimal || 18
    ),
    tokenAddress: outputTokenAddress
  })
  if (!outputTokenAddress) return <Fragment/>
  return (
    <Box
      borderColor={
        tradeType === TRADE_TYPE.LONG
          ? 'buy'
          : tradeType === TRADE_TYPE.SHORT
            ? 'sell'
            : 'blue'
      }
      className='estimate-box swap-info-box mt-1 mb-1'
    >
      <span
        className={`estimate-box__leverage ${getTitleBuyTradeType(
          tradeType
        ).toLowerCase()}`}
      >
        <TokenSymbol token={outputTokenAddress} />
      </span>
      <div className='position-delta--box'>
        <div className='position-delta--left'>
          {settings.showBalance && <div>Balance</div>}
          <div>Value</div>
          {showSize && <div>Size</div>}
        </div>
        <SkeletonLoader loading={balances[outputTokenAddress] == null}>
          {balances[outputTokenAddress]?.gt(0) && (
            <div className='position-delta--group'>
              <div className='position-delta--right'>
                {settings.showBalance && (
                  <div>
                    {
                      formatWeiToDisplayNumber(
                        balances[outputTokenAddress] ?? bn(0),
                        4,
                        tokens[outputTokenAddress]?.decimal || 18
                      ).split('.')[0]
                    }
                  </div>
                )}
                <div>
                  ${zerofy(formatFloat(valueOutBefore)).split('.')[0]}
                </div>
                {showSize && (
                  <div>
                    $
                    {
                      zerofy(
                        formatFloat(Number(valueOutBefore) * power)
                      ).split('.')[0]
                    }
                  </div>
                )}
              </div>
              <div className='position-delta--left'>
                {settings.showBalance && (
                  <div>
                    {formatWeiToDisplayNumber(
                      balances[outputTokenAddress] ?? bn(0),
                      4,
                      tokens[outputTokenAddress]?.decimal || 18
                    ).match(/\.\d+$/g) || '\u00A0'}
                  </div>
                )}
                <div>
                  {zerofy(formatFloat(valueOutBefore)).match(/\.\d+$/g) ||
                    '\u00A0'}
                </div>
                {showSize && (
                  <div>
                    {zerofy(
                      formatFloat(Number(valueOutBefore) * power)
                    ).match(/\.\d+$/g) || '\u00A0'}
                  </div>
                )}
              </div>
            </div>
          )}
        </SkeletonLoader>
        {!Number(amountIn) || !balances[outputTokenAddress]?.gt(0) ? (
          ''
        ) : (
          <div className='position-delta--left'>
            {settings.showBalance && <div>{'->'}</div>}
            {showSize && <div>{'->'}</div>}
            <div>{'->'}</div>
          </div>
        )}
        {!Number(amountIn) ? (
          ''
        ) : (
          <SkeletonLoader loading={!Number(valueOut)}>
            <div className='position-delta--group'>
              <div className='position-delta--right'>
                {settings.showBalance && (
                  <div>
                    {
                      formatLocalisedCompactNumber(
                        formatFloat(amountOut)
                      ).split(whatDecimalSeparator())[0]
                    }
                  </div>
                )}
                <div>
                  $
                  {
                    formatLocalisedCompactNumber(
                      formatFloat(valueOut)
                    ).split(whatDecimalSeparator())[0]
                  }
                </div>
                {showSize && (
                  <div>
                    $
                    {
                      formatLocalisedCompactNumber(
                        formatFloat(Number(valueOut) * power)
                      ).split('.')[0]
                    }
                  </div>
                )}
              </div>
              <div className='position-delta--left'>
                {settings.showBalance && (
                  <div>
                    {formatLocalisedCompactNumber(
                      formatFloat(amountOut)
                    ).match(/\.\d+$/g) || '\u00A0'}
                  </div>
                )}
                <div>
                  {formatLocalisedCompactNumber(
                    formatFloat(valueOut)
                  ).match(/\.\d+$/g) || '\u00A0'}
                </div>
                {showSize && (
                  <div>
                    {formatLocalisedCompactNumber(
                      formatFloat(Number(valueOut) * power)
                    ).match(/\.\d+$/g) || '\u00A0'}
                  </div>
                )}
              </div>
            </div>
          </SkeletonLoader>
        )}
      </div>
    </Box>
  )
}
