// src/components/PersonDetails.jsx
const PersonDetails = ({ person, familyData, onClose, onSelectPerson }) => {
    if (!person) return null;
  
    return (
      <div className="details-panel active">
        <div className="details-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </div>
        
        <div className="details-header">
          <div className="details-image">
            {person.image ? (
              <img src={person.image} alt={person.name} />
            ) : (
              <div className="placeholder-image">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <div className="details-name">{person.name}</div>
          <div className="details-dates">{person.dates}</div>
        </div>
        
        <div className="details-section">
          <div className="section-title">
            <i className="fas fa-book"></i> Biography
          </div>
          <div className="details-bio">{person.bio}</div>
        </div>
        
        <div className="details-section">
          <div className="section-title">
            <i className="fas fa-info-circle"></i> Personal Information
          </div>
          <div className="details-info">
            <div className="info-item">
              <div className="info-label">Birth Place:</div>
              <div className="info-value">{person.birthPlace}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Occupation:</div>
              <div className="info-value">{person.occupation}</div>
            </div>
            {person.website && (
              <div className="info-item">
                <div className="info-label">Website:</div>
                <div className="info-value">
                  <a href={`https://${person.website}`} target="_blank" rel="noopener noreferrer">
                    {person.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="details-section">
          <div className="section-title">
            <i className="fas fa-users"></i> Family Connections
          </div>
          <div className="details-relatives">
            {person.relatives?.map(relativeId => {
              const relative = familyData[relativeId];
              if (!relative) return null;
              
              return (
                <div 
                  key={relativeId} 
                  className="relative-item" 
                  onClick={() => onSelectPerson(relativeId)}
                >
                  <div className="relative-image">
                    {relative.image ? (
                      <img src={relative.image} alt={relative.name} />
                    ) : (
                      <div className="placeholder-image">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="relative-info">
                    <div className="relative-name">{relative.name}</div>
                    <div className="relative-relation">
                      {getRelationship(relativeId)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {person.files && person.files.length > 0 && (
          <div className="details-section">
            <div className="section-title">
              <i className="fas fa-paperclip"></i> Documents & Files
            </div>
            <div className="details-files">
              {person.files.map((file, index) => {
                const fileIcon = getFileIcon(file);
                return (
                  <div key={index} className="file-item">
                    <div className="file-icon">
                      <i className={`fas ${fileIcon}`}></i>
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file}</div>
                      <div className="file-size">
                        {(Math.random() * 3 + 0.5).toFixed(1)} MB
                      </div>
                    </div>
                    <div className="file-actions">
                      <button className="file-btn">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="file-btn">
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="details-actions">
          <button className="btn btn-outline">
            <i className="fas fa-edit"></i> Edit Details
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Add Relative
          </button>
        </div>
      </div>
    );
  };
  
  function getRelationship(relativeId) {
    const relationships = {
      'father': 'Father',
      'mother': 'Mother',
      'brother': 'Brother',
      'sister': 'Sister',
      'grandpa': 'Grandfather',
      'grandma': 'Grandmother',
      'user': 'Self'
    };
    return relationships[relativeId] || 'Relative';
  }
  
  function getFileIcon(fileName) {
    if (fileName.includes('Photo') || fileName.includes('picture')) return 'fa-file-image';
    if (fileName.includes('Certificate') || fileName.includes('License')) return 'fa-file-pdf';
    if (fileName.includes('Recipe')) return 'fa-file-word';
    if (fileName.includes('Video')) return 'fa-file-video';
    return 'fa-file';
  }
  
  export default PersonDetails;