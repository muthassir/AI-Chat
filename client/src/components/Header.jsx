import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <header className="navbar bg-neutral flex justify-between items-center lg:px-36">
      <h1>DiwakarAI</h1>
      {path[1] === "createpost" ? (
        <button onClick={() => navigate("/")} className="btn-primary btn">
          Explore Posts
        </button>
      ) : (
        <button
          onClick={() => navigate("/createpost")}
          className="btn-primary btn"
        >
          Create Image
        </button>
      )}
    </header>
  );
}

export default Header;
