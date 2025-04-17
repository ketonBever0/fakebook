import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div>
      <div>Navbar</div>
      <Link to={"/"}>Home</Link>
      <Link to={"/users"}>Users</Link>
    </div>

  )
}
