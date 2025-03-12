// src/components/PersonCard.jsx
const PersonCard = ({ person, onClick }) => {
    return (
      <div className="person-card" onClick={onClick}>
        <div className="card-image">
          {person.image ? (
            <img src={person.image} alt={person.name} />
          ) : (
            <div className="placeholder-image">
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>
        <div className="card-content">
          <div className="person-name">{person.name}</div>
          <div className="person-dates">{person.dates}</div>
        </div>
      </div>
    );
  };
  
  export default PersonCard;