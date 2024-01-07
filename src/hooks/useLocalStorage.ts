import { useCallback, useMemo } from 'react'

const useLocalStorage = (
  name: string
): [string | null, (value: string) => void] => {
  const data = useMemo(() => localStorage.getItem(name), [name])

  const setLocalValue = useCallback((value: string) => {
    localStorage.setItem(name, value)
  }, [])
  return useMemo(() => [data, setLocalValue], [data, setLocalValue])
}

export default useLocalStorage
