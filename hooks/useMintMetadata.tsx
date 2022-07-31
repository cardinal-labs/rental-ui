import type { AccountData } from '@cardinal/common'
import type { TokenData } from 'apis/api'
import { useQueries, useQuery } from 'react-query'

export const mintMetadataQueryKey = (tokenData: TokenData) => {
  return ['useMintMetadata', tokenData.metaplexData?.parsed.mint?.toString()]
}

export const mintMetadataQuery = async (
  tokenData: TokenData & { metadata?: AccountData<any> }
) => {
  if (tokenData?.metadata) return tokenData.metadata
  if (!tokenData?.metaplexData?.parsed.data.uri) return
  const json = await fetch(tokenData?.metaplexData?.parsed.data.uri).then((r) =>
    r.json()
  )
  return {
    pubkey: tokenData.metaplexData.pubkey,
    parsed: json,
  }
}

export const useMintMetadata = (tokenData: TokenData) => {
  return useQuery<AccountData<any> | undefined>(
    [mintMetadataQueryKey(tokenData)],
    async () => {
      return mintMetadataQuery(tokenData)
    },
    { refetchOnMount: false }
  )
}

export const useMintMetadatas = (tokenDatas: TokenData[]) => {
  return useQueries(
    tokenDatas.map((tokenData) => {
      return {
        queryKey: mintMetadataQueryKey(tokenData),
        queryFn: () => mintMetadataQuery(tokenData),
      }
    })
  )
}
