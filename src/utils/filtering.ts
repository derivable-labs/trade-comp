import { isAddress } from '../state/lists/utils/isAddress'
import { PoolSearch } from './type'

const alwaysTrue = () => true

/** Creates a filter function that filters tokens that do not match the query. */
export function getTokenFilter<T extends PoolSearch >(query: string): (token: T) => boolean {
  const searchingAddress = isAddress(query)

  if (searchingAddress) {
    const address = searchingAddress.toLowerCase()
    return (t: T) => 'address' in t && address === t.baseToken.address.toLowerCase()
  }

  const queryParts = query
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (queryParts.length === 0) return alwaysTrue

  const match = (s: string): boolean => {
    const parts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    return queryParts.every((p) => p.length === 0 || parts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ baseToken: { name, symbol } }: T): boolean => Boolean((symbol && match(symbol)) || (name && match(name)))
}
