'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus,
  Users,
  FolderPlus,
  ChevronDown,
  X,
  Save,
  TreePine,
  Calendar,
  FileText,
  Image,
  Sparkles
} from 'lucide-react';
import { PersonFormData, Person } from '@/types';

interface SidebarProps {
  families: string[];
  currentFamily: string | null;
  onSelectFamily: (family: string) => void;
  onCreateFamily: (name: string) => void;
  onAddPerson: (person: PersonFormData) => void;
  editingPerson: Person | null;
  onUpdatePerson: (person: Person) => void;
  onCancelEdit: () => void;
}

export default function Sidebar({
  families,
  currentFamily,
  onSelectFamily,
  onCreateFamily,
  onAddPerson,
  editingPerson,
  onUpdatePerson,
  onCancelEdit
}: SidebarProps) {
  const [showNewFamily, setShowNewFamily] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    birthDate: '',
    deathDate: '',
    bio: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (editingPerson) {
      setFormData({
        name: editingPerson.name,
        birthDate: editingPerson.birthDate || '',
        deathDate: editingPerson.deathDate || '',
        bio: editingPerson.bio || '',
        imageUrl: editingPerson.imageUrl || ''
      });
    } else {
      setFormData({
        name: '',
        birthDate: '',
        deathDate: '',
        bio: '',
        imageUrl: ''
      });
    }
  }, [editingPerson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingPerson) {
      onUpdatePerson({
        ...editingPerson,
        ...formData,
        deathDate: formData.deathDate || null
      });
    } else {
      onAddPerson(formData);
    }

    setFormData({
      name: '',
      birthDate: '',
      deathDate: '',
      bio: '',
      imageUrl: ''
    });
  };

  const handleCreateFamily = () => {
    if (newFamilyName.trim()) {
      onCreateFamily(newFamilyName.trim());
      setNewFamilyName('');
      setShowNewFamily(false);
    }
  };

  return (
    <aside className="w-80 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-zinc-100 tracking-tight">Family Tree</h1>
            <p className="text-xs text-zinc-500">Build your legacy</p>
          </div>
        </div>
      </div>

      {/* Family Selector */}
      <div className="p-4 border-b border-zinc-800">
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
          <Users size={14} />
          SELECT FAMILY
        </label>
        
        <div className="relative">
          <select
            value={currentFamily || ''}
            onChange={(e) => onSelectFamily(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 appearance-none cursor-pointer hover:border-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all outline-none"
          >
            <option value="" disabled>Choose a family...</option>
            {families.map(family => (
              <option key={family} value={family}>
                {family.charAt(0).toUpperCase() + family.slice(1)} Family
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>

        {/* New Family Button */}
        {!showNewFamily ? (
          <button
            onClick={() => setShowNewFamily(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 rounded-xl text-sm text-zinc-300 transition-all"
          >
            <FolderPlus size={16} />
            New Family
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              placeholder="Family name..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFamily()}
            />
            <button
              onClick={handleCreateFamily}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 rounded-xl text-zinc-900 transition-colors"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => setShowNewFamily(false)}
              className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Person Form */}
      {currentFamily && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <UserPlus size={14} />
              {editingPerson ? 'EDIT PERSON' : 'ADD PERSON'}
            </label>
            {editingPerson && (
              <button
                onClick={onCancelEdit}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
                <Sparkles size={12} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name..."
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
                  <Calendar size={12} />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
                  <Calendar size={12} />
                  Death Date
                </label>
                <input
                  type="date"
                  value={formData.deathDate}
                  onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
                <FileText size={12} />
                Biography
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="A short biography..."
                rows={3}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
                <Image size={12} />
                Image URL / Local Path
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/images/photo.jpg or https://..."
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-sm font-semibold text-zinc-900 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30"
            >
              {editingPerson ? (
                <>
                  <Save size={16} />
                  Update Person
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Add to Tree
                </>
              )}
            </button>
          </form>

          {/* Connection Instructions */}
          <div className="mt-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
            <h4 className="text-xs font-medium text-zinc-400 mb-2">💡 Tips</h4>
            <ul className="text-xs text-zinc-500 space-y-1.5">
              <li>• Drag nodes to reposition them</li>
              <li>• Drag from bottom handle to top handle to connect</li>
              <li>• Click a connection to select relationship type</li>
              <li>• Changes save automatically</li>
            </ul>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentFamily && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <TreePine className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-500">Select or create a family to get started</p>
          </div>
        </div>
      )}
    </aside>
  );
}

