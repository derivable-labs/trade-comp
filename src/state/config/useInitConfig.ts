import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setConfigs, setEngine } from './reducer'
import configs from './configs'
import { addTokensReduce } from '../token/reducer'
import { Engine } from 'derivable-tools/dist/engine'
import { useWeb3React } from '../customWeb3React/hook'
import { DEFAULT_CHAIN, ZERO_ADDRESS } from '../../utils/constant'

export const useInitConfig = ({
                                library,
                                chainId,
                                useSubPage,
                                language,
                                useLocation,
                                useHistory,
                                env
                              }: {
  library: any
  useLocation: any
  useHistory: any
  chainId: number
  useSubPage: any
  language: string
  env: 'development' | 'production'
}) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { account } = useWeb3React()

  useEffect(() => {
    dispatch(
      addTokensReduce({
        tokens: [configs[chainId || DEFAULT_CHAIN].nativeToken],
        chainId: chainId || DEFAULT_CHAIN
      })
    )
    dispatch(
      setConfigs({
        configs: configs[chainId || DEFAULT_CHAIN],
        chainId: chainId || DEFAULT_CHAIN,
        useSubPage,
        language,
        env,
        location,
        useHistory
      })
    )
  }, [location, useHistory, chainId, useSubPage, language, env])

  useEffect(() => {
    if (!chainId) return
    if (account === ZERO_ADDRESS) {
      return console.log('=======await sync account========')
    }
    const engine = new Engine(
      account,
      {
        storage: {
          // @ts-ignore
          setItem: (itemName, value) => localStorage.setItem(itemName, value),
          // @ts-ignore
          getItem: (itemName) => localStorage.getItem(itemName)
        },
        signer: library?.getSigner(),
        account
      },
      chainId
    )
    dispatch(setEngine({ engine }))
  }, [library, account, chainId])
}
