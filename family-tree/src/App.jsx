import './styles/index.css';

import AddPersonModal from './components/AddPersonModal';
import FamilyTree from './components/FamilyTree';
import PersonDetails from './components/PersonDetails';
import { familyData } from './data/sampleData';
// src/App.jsx
import { useState } from 'react';

function App() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState(familyData);
  
  const handleAddPerson = (newPerson) => {
    setFamilyMembers({
      ...familyMembers,
      [newPerson.id]: newPerson
    });
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <i className="fas fa-tree"></i>
          <span>FamilyConnect</span>
        </div>
        <div className="user-actions">
          <button className="btn btn-outline">Share Tree</button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </header>
      
      <main className="container">
        <div className="tree-container">
          <div className="tree-controls">
            <h2 className="tree-title">Johnson Family Tree</h2>
            <div className="tree-actions">
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <i className="fas fa-user-plus"></i> Add Person
              </button>
            </div>
          </div>
          
          <FamilyTree 
            familyData={familyMembers} 
            onSelectPerson={setSelectedPerson} 
          />
        </div>
      </main>
      
      {selectedPerson && (
        <PersonDetails 
          person={familyMembers[selectedPerson]} 
          familyData={familyMembers}
          onClose={() => setSelectedPerson(null)}
          onSelectPerson={setSelectedPerson}
        />
      )}
      
      {isModalOpen && (
        <AddPersonModal 
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddPerson}
        />
      )}
    </div>
  );
}

export default App;