import "../styles/Navigation.css";

function Navigation({ page, setPage }) {

  const tabs = [

    {
      id:"dashboard",
      icon:"📊",
      label:"Dashboard",
    },

    {
      id:"workout",
      icon:"🏋️",
      label:"Workout",
    },

    {
      id:"exercise-library",
      icon:"📚",
      label:"Exercise Library",
    },

    {
      id:"progress",
      icon:"📈",
      label:"Progress",
    },

    {
      id:"performance",
      icon:"⚡",
      label:"Performance",
    },

    {
      id:"history",
      icon:"📖",
      label:"History",
    },

    {
  id: "calendar",
  icon: "📅",
  label: "Calendar",
},

    {
      id:"profile",
      icon:"👤",
      label:"Profile",
    },

    {
      id:"recruit",
      icon:"🏈",
      label:"Recruit",
    },

    {
      id: "coaching",
      icon: "🧠",
      label: "Coaching",
    },

  ];

  return (

    <nav className="sl-nav">

      {tabs.map((tab)=>(

        <button

          key={tab.id}

          className={`sl-nav-btn ${
            page===tab.id ? "active" : ""
          }`}

          onClick={()=>
            setPage(tab.id)
          }

        >

          <span className="nav-icon">

            {tab.icon}

          </span>

          {tab.label}

        </button>

      ))}

    </nav>

  );

}

export default Navigation;