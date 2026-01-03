'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import FamilyTreeCanvas from '@/components/FamilyTreeCanvas';
import { FamilyData, PersonFormData, Person } from '@/types';
import {
  listFamilies,
  getFamilyData,
  createFamily,
  addPerson,
  updatePersonPosition,
  updatePerson,
  deletePerson,
  addConnection,
  deleteConnection
} from '@/actions/familyActions';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [families, setFamilies] = useState<string[]>([]);
  const [currentFamily, setCurrentFamily] = useState<string | null>(null);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Load families on mount
  useEffect(() => {
    const loadFamilies = async () => {
      const familyList = await listFamilies();
      setFamilies(familyList);
      
      // Auto-select first family if available
      if (familyList.length > 0) {
        setCurrentFamily(familyList[0]);
      }
      setLoading(false);
    };
    loadFamilies();
  }, []);

  // Load family data when selected
  useEffect(() => {
    const loadFamilyData = async () => {
      if (currentFamily) {
        setLoading(true);
        const data = await getFamilyData(currentFamily);
        setFamilyData(data);
        setLoading(false);
      } else {
        setFamilyData(null);
      }
    };
    loadFamilyData();
  }, [currentFamily]);

  const handleSelectFamily = useCallback((family: string) => {
    setCurrentFamily(family);
    setEditingPerson(null);
  }, []);

  const handleCreateFamily = useCallback(async (name: string) => {
    const newFamily = await createFamily(name);
    setFamilies(prev => [...prev, name.toLowerCase().replace(/[^a-z0-9]/g, '')]);
    setCurrentFamily(name.toLowerCase().replace(/[^a-z0-9]/g, ''));
    setFamilyData(newFamily);
  }, []);

  const handleAddPerson = useCallback(async (personData: PersonFormData) => {
    if (!currentFamily) return;
    
    const newPerson = await addPerson(currentFamily, {
      name: personData.name,
      birthDate: personData.birthDate,
      deathDate: personData.deathDate || null,
      bio: personData.bio,
      imageUrl: personData.imageUrl
    });

    setFamilyData(prev => prev ? {
      ...prev,
      people: [...prev.people, newPerson]
    } : null);
  }, [currentFamily]);

  const handleNodePositionChange = useCallback(async (personId: string, position: { x: number; y: number }) => {
    if (!currentFamily) return;
    
    await updatePersonPosition(currentFamily, personId, position);
    
    setFamilyData(prev => prev ? {
      ...prev,
      people: prev.people.map(p => 
        p.id === personId ? { ...p, position } : p
      )
    } : null);
  }, [currentFamily]);

  const handleConnect = useCallback(async (source: string, target: string, type: 'parent' | 'child' | 'spouse') => {
    if (!currentFamily) return;
    
    const newConnection = await addConnection(currentFamily, { source, target, type });
    
    setFamilyData(prev => prev ? {
      ...prev,
      connections: [...prev.connections, newConnection]
    } : null);
  }, [currentFamily]);

  const handleDeleteConnection = useCallback(async (connectionId: string) => {
    if (!currentFamily) return;
    
    await deleteConnection(currentFamily, connectionId);
    
    setFamilyData(prev => prev ? {
      ...prev,
      connections: prev.connections.filter(c => c.id !== connectionId)
    } : null);
  }, [currentFamily]);

  const handleEditPerson = useCallback((person: Person) => {
    setEditingPerson(person);
  }, []);

  const handleUpdatePerson = useCallback(async (person: Person) => {
    if (!currentFamily) return;
    
    await updatePerson(currentFamily, person.id, person);
    
    setFamilyData(prev => prev ? {
      ...prev,
      people: prev.people.map(p => p.id === person.id ? person : p)
    } : null);
    
    setEditingPerson(null);
  }, [currentFamily]);

  const handleDeletePerson = useCallback(async (personId: string) => {
    if (!currentFamily) return;
    
    await deletePerson(currentFamily, personId);
    
    setFamilyData(prev => prev ? {
      ...prev,
      people: prev.people.filter(p => p.id !== personId),
      connections: prev.connections.filter(c => c.source !== personId && c.target !== personId)
    } : null);
    
    if (editingPerson?.id === personId) {
      setEditingPerson(null);
    }
  }, [currentFamily, editingPerson]);

  const handleCancelEdit = useCallback(() => {
    setEditingPerson(null);
  }, []);

  if (loading && families.length === 0) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-zinc-400">Loading family tree...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-zinc-950 flex overflow-hidden">
      <Sidebar
        families={families}
        currentFamily={currentFamily}
        onSelectFamily={handleSelectFamily}
        onCreateFamily={handleCreateFamily}
        onAddPerson={handleAddPerson}
        editingPerson={editingPerson}
        onUpdatePerson={handleUpdatePerson}
        onCancelEdit={handleCancelEdit}
      />
      
      {familyData ? (
        <FamilyTreeCanvas
          familyData={familyData}
          onNodePositionChange={handleNodePositionChange}
          onConnect={handleConnect}
          onDeleteConnection={handleDeleteConnection}
          onEditPerson={handleEditPerson}
          onDeletePerson={handleDeletePerson}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-zinc-950">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 flex items-center justify-center border border-amber-500/20">
              <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-zinc-300 mb-2">Welcome to Family Tree</h2>
            <p className="text-zinc-500 max-w-sm">
              Select a family from the sidebar or create a new one to start building your family tree
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
