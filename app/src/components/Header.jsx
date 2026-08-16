import "./Header.css";

function Header({ name, grade, position, team }) {
  return (
    <header className="sl-header">

      <div className="sl-header-overlay" />

      <div className="sl-header-content">

        <div className="hunter-rank">
          <span>PROJECT DRIVE SYSTEM</span>
        </div>

        <h1>PROJECT DRIVE</h1>

        <h2>{name}</h2>

        <p>
          {grade} • {position}
        </p>

        <p>{team}</p>

      </div>

    </header>
  );
}

export default Header;