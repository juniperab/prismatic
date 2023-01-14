
export interface FetchError {
  error: {
    status: number,
    message: string,
  },
}

export function isFetchError(err: any): err is FetchError {
  const fetchError = err as FetchError
  return fetchError?.error?.status !== undefined && fetchError?.error?.message !== undefined
}

export async function typedFetch<T>(uri: string): Promise<T | FetchError> {
  const response: Response = await window.fetch(uri)
  return await response.json()
}

