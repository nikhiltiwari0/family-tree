import PersonCard from './PersonCard';
// src/components/FamilyTree.jsx
import { useEffect } from 'react';

const FamilyTree = ({ familyData, onSelectPerson }) => {
  // Group family members by generation
  const generations = {
    0: ['grandpa', 'grandma'],
    1: ['father', 'mother'],
    2: ['brother', 'user']
  };

  useEffect(() => {
    // This would be where you'd implement any tree visualization logic
    // Such as drawing connection lines between family members
    console.log("Family tree mounted or updated");
  }, [familyData]);

  return (
    <div className="family-tree">
      {Object.entries(generations).map(([genIndex, members]) => (
        <div key={genIndex} className="tree-level">
          {members.map((memberId, index) => {
            const person = familyData[memberId];
            if (!person) return null;
            
            return (
              <div 
                key={memberId} 
                className="tree-node"
                style={{ animationDelay: `${index * 0.1 + parseInt(genIndex) * 0.2}s` }}
              >
                <PersonCard 
                  person={person} 
                  onClick={() => onSelectPerson(memberId)} 
                />
                <div className="add-relative">
                  <button className="add-btn">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default FamilyTree;
