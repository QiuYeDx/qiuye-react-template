import { act } from "@testing-library/react"

import { useCounterStore } from "@/stores/counter-store"

describe("useCounterStore", () => {
  beforeEach(() => useCounterStore.setState({ count: 0 }))

  it("increments, decrements and resets", () => {
    const { increment, decrement, reset } = useCounterStore.getState()

    act(() => {
      increment()
      increment()
      decrement()
    })
    expect(useCounterStore.getState().count).toBe(1)

    act(() => reset())
    expect(useCounterStore.getState().count).toBe(0)
  })

  it("persists the count to localStorage", () => {
    act(() => useCounterStore.getState().increment())

    const stored = JSON.parse(localStorage.getItem("counter") ?? "{}")
    expect(stored.state).toEqual({ count: 1 })
  })
})
