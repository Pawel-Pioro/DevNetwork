import { Outlet, Link } from "react-router-dom";

function Layout() {
  return(
    <>
        <Link to="/login">Login</Link>
        <Outlet />
    </>
  )
}

export default Layout;
