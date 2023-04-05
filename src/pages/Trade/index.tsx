import React, { useEffect, useState } from 'react'
import './style.scss'
import { ExposureBox } from '../../Components/ExposureBox'
import { PoolTableCompact } from '../../Components/PoolTable'
import { useConfigs } from '../../state/config/useConfigs'
import { useCurrentPool } from '../../state/currentPool/hooks/useCurrentPool'
import { Chart } from '../../Components/Chart'
import { SWAP_TAB } from '../../utils/constant'
import { SwapBox } from '../../Components/SwapBox'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { Card } from '../../Components/ui/Card'
import { PoolDetailAndHistory } from '../../Components/PoolDetailAndHistory'
import { useListTokens } from '../../state/token/hook'
import { numberToWei, weiToNumber } from '../../utils/helpers'
// import fetch from 'fetch'

export const Trade = ({ tab }: {
  tab: Symbol
}) => {
  const { cToken, quoteToken, baseToken, baseId, basePrice, poolAddress } = useCurrentPool()
  const { chainId, useHistory, ddlEngine } = useConfigs()
  const { tokens } = useListTokens()
  const history = useHistory()
  const [changedIn24h, setChangedIn24h] = useState<number>(10)
  const { width } = useWindowSize()
  const isPhone = width && width < 992

  useEffect(() => {
    console.log(tokens[baseToken] , tokens[quoteToken] , cToken , ddlEngine)
    if (tokens[baseToken] && tokens[quoteToken] && cToken && ddlEngine) {
      getChangedIn24h(tokens[baseToken], tokens[quoteToken])
      ddlEngine.PRICE.get24hChange({
        baseToken: tokens[baseToken],
        cToken,
        chainId: chainId.toString(),
        quoteToken: tokens[quoteToken],
        currentPrice: weiToNumber(numberToWei(basePrice), 18 + tokens[quoteToken].decimal - tokens[baseToken].decimal)
      }).then((value1) => {
        setChangedIn24h(value1)
      })
      // console.log('khanh', tokens[baseToken], tokens[quoteToken])
      // ddlEngine.PRICE.get24hChangeByLog({
      //   baseId,
      //   currentPrice: basePrice,
      //   baseToken: tokens[baseToken],
      //   quoteToken: tokens[quoteToken],
      //   cToken
      // }).then((value) => {
      //   setChangedIn24h(value)
      // }).catch((e) => {
      //   console.error(e)
      //   ddlEngine.PRICE.get24hChange({
      //     baseToken: tokens[baseToken],
      //     cToken,
      //     chainId: chainId.toString(),
      //     quoteToken: tokens[quoteToken],
      //     currentPrice: basePrice
      //   })
      //     .then((value1) => {
      //       setChangedIn24h(value1)
      //     })
      // })
    }
  }, [chainId, tokens, ddlEngine, cToken, quoteToken, baseToken])

    async function getChangedIn24h(token0: any, token1: any) {
      let symbol0 = token0.symbol
      let symbol1 = token1.symbol
      if (token0.symbol == 'WETH') symbol0 = 'ETH'

      if (token1.symbol == 'WETH') symbol1 = 'ETH'
      let url = `https://www.kucoin.com/_api/quicksilver/universe-currency/symbols/stats/${symbol0}-${symbol1}/`
      console.log('@@@', url)
      fetch(url)
        .then((response) => console.log('alo', response))
        // .then((toDoListArray) => console.log('toDoListArray',toDoListArray))
        console.log('DONEEEEEEE')
    }

  return (
    <div className='exposure-page'>
      <div className='exposure-page__content'>
        <div className='exposure-page__content--left'>
          <Chart changedIn24h={changedIn24h} />
          {
            !isPhone && <div className='hidden-on-phone'>
              <PoolDetailAndHistory poolAddress={poolAddress} />
            </div>
          }
        </div>
        <div className='exposure-page__content--right'>
          <Tabs
            selectedIndex={tab === SWAP_TAB.EXPOSURE ? 0 : 1}
            onSelect={(index) => {
              history.push(index === 0 ? '/exposure' : '/swap')
            }}
          >
            <TabList>
              <Tab>Exposure</Tab>
              <Tab>Swap</Tab>
            </TabList>
            <TabPanel>
              <Card className='trade-box card-in-tab'>
                <ExposureBox changedIn24h={changedIn24h} />
              </Card>
            </TabPanel>
            <TabPanel>
              <Card className='trade-box card-in-tab'>
                <SwapBox />
              </Card>
            </TabPanel>
          </Tabs>
          <Card>
            <PoolTableCompact />
          </Card>
          {
            isPhone && <div className='hidden-on-desktop'>
              <PoolDetailAndHistory poolAddress={poolAddress} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}
