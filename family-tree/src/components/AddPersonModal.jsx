// src/components/AddPersonModal.jsx
import { useState } from 'react';

const AddPersonModal = ({ onClose, onSave }) => {
  const [personData, setPersonData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    relation: 'child',
    image: null,
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonData({ ...personData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create unique ID based on name
    const id = personData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    
    const formattedDates = `${new Date(personData.birthDate).getFullYear() || '????'} - ${
      personData.deathDate ? new Date(personData.deathDate).getFullYear() : ''
    }`;
    
    onSave({
      id,
      name: personData.name,
      dates: formattedDates,
      image: null, // Would handle file uploads in a real app
      bio: personData.bio,
      birthPlace: '',
      occupation: '',
      website: '',
      relatives: ['user'], // Default connection to the main user
      files: []
    });
  };

  return (
    <div className="modal-overlay active">
      <div className="modal">
        <div className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </div>
        <div className="modal-header">
          <h2 className="modal-title">Add New Family Member</h2>
        </div>
        <div className="modal-content">
          <form id="add-person-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="Enter full name" 
                value={personData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Birth Date</label>
              <input 
                type="date" 
                name="birthDate"
                className="form-input"
                value={personData.birthDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Death Date (if applicable)</label>
              <input 
                type="date" 
                name="deathDate"
                className="form-input"
                value={personData.deathDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Relationship</label>
              <select 
                name="relation"
                className="form-input"
                value={personData.relation}
                onChange={handleChange}
              >
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Profile Image</label>
              <div className="image-upload">
                <div className="upload-preview">
                  <i className="fas fa-user fa-2x"></i>
                </div>
                <div className="file-input-wrapper">
                  <button type="button" className="btn btn-outline">Select Image</button>
                  <input type="file" className="file-input" accept="image/*" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Biography</label>
              <textarea 
                name="bio"
                className="form-input" 
                rows="5" 
                placeholder="Enter life story, memories, or any details"
                value={personData.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Person</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;