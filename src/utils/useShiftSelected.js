import React, { useState } from 'react'

export const useShiftSelected = (initialState, change) => {
  const [previousSelected, setPreviousSelected] = useState(null)
  const [previousChecked, setPreviousChecked] = useState(null)
  const [currentSelected, setCurrentSelected] = useState(null)

  const onChange = useCallback(
    (event, item) => {
      if (event.nativeEvent.shiftKey) {
        const current = initialState.findIndex((x) => x === item)
        const previous = initialState.findIndex((x) => x === previousSelected)
        const previousCurrent = initialState.findIndex((x) => x === currentSelected)
        const start = Math.min(current, previous)
        const end = Math.max(current, previous)
        if (start > -1 && end > -1) {
          change(previousChecked, initialState.slice(start, end + 1))
          if (previousCurrent > end) {
            change(!previousChecked, initialState.slice(end + 1, previousCurrent + 1))
          }
          if (previousCurrent < start) {
            change(!previousChecked, initialState.slice(previousCurrent, start))
          }
          setCurrentSelected(item)
          return
        }
      } else {
        setPreviousSelected(item)
        setCurrentSelected(null)
        setPreviousChecked(event.target.checked)
      }
      change(event.target.checked, [item])
    },
    [
      change,
      initialState,
      previousSelected,
      setPreviousSelected,
      previousChecked,
      setPreviousChecked,
      currentSelected,
      setCurrentSelected,
    ]
  )

  return onChange
}
