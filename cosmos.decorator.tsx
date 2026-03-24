import type { Decorator } from "react-cosmos"

const decorator: Decorator = ({ children }) => {
  return <div style={{ padding: 16 }}>{children}</div>
}

export default decorator
