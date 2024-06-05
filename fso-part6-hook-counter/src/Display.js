import { useCounterValue } from "./CounterContext"

export const Display = () => {
  const counter = useCounterValue()
  return <div>{counter}</div>
}
