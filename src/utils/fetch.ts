export const onlyLastResponse = <T>() => {
  let currentNo = 0
  let lastDoneNo = 0

  type WaitItem = {
    no: number
    abort: AbortController
  }

  const waitList: WaitItem[] = []

  const onCompleted = (no: number) => {
    lastDoneNo = no

    let num_remove = 0
    for (const item of waitList) {
      if (item.no > no) {
        break
      }

      if (item.no < no) {
        item.abort.abort('no longer interested')
      }

      num_remove += 1
    }

    waitList.splice(0, num_remove)
  }

  return async (p: Promise<T>, abort?: AbortController): Promise<T | null> => {
    currentNo += 1
    const no = currentNo

    if (abort) {
      waitList.push({ no, abort })
    }

    let ret: T
    try {
      ret = await p
    } catch (e) {
      if (lastDoneNo < no) {
        onCompleted(no)
        throw e
      }

      return null
    }

    if (lastDoneNo < no) {
      onCompleted(no)
      return ret
    }

    return null
  }
}
