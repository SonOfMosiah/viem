import { useEffect, useState } from 'react'
import { fetchBalance } from 'viem/actions'
import { NetworkProvider } from 'viem/providers/network'
import { WalletProvider } from 'viem/providers/wallet'

export function FetchBalance({
  address = '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  provider,
}: {
  address?: `0x${string}`
  provider: NetworkProvider | WalletProvider
}) {
  const [balance, setBalance] = useState<bigint>()
  useEffect(() => {
    ;(async () => {
      setBalance(
        await fetchBalance(provider, {
          address,
        }),
      )
    })()
  }, [address, provider])
  return <div>Balance: {balance?.toString()} wei</div>
}
