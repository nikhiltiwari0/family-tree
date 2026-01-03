'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, Calendar, Heart, Trash2, Edit3 } from 'lucide-react';
import { Person } from '@/types';

interface PersonNodeData extends Record<string, unknown> {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (personId: string) => void;
}

function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const { person, onEdit, onDelete } = data as PersonNodeData;
  
  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const birthYear = person.birthDate ? new Date(person.birthDate).getFullYear() : null;
  const deathYear = person.deathDate ? new Date(person.deathDate).getFullYear() : null;
  const lifespan = birthYear ? `${birthYear}${deathYear ? ` - ${deathYear}` : ' - Present'}` : '';

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-zinc-800 hover:!bg-amber-400 transition-colors"
      />
      
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-4 min-w-[220px] max-w-[280px] border border-zinc-700/50 shadow-xl shadow-black/20 hover:border-amber-500/30 transition-all duration-300">
        {/* Action buttons */}
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(person);
            }}
            className="p-1.5 bg-blue-500 hover:bg-blue-400 rounded-full text-white shadow-lg transition-colors"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(person.id);
            }}
            className="p-1.5 bg-red-500 hover:bg-red-400 rounded-full text-white shadow-lg transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Profile Image or Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            {person.imageUrl ? (
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-zinc-600"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border-2 border-zinc-600">
                <User className="w-7 h-7 text-amber-500" />
              </div>
            )}
            {person.deathDate && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-zinc-700 rounded-full flex items-center justify-center border border-zinc-600">
                <Heart className="w-3 h-3 text-zinc-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-100 text-sm truncate leading-tight">
              {person.name}
            </h3>
            {lifespan && (
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-400">{lifespan}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {person.bio}
          </p>
        )}

        {/* Dates detail on hover */}
        <div className="mt-2 pt-2 border-t border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
            {person.birthDate && (
              <span>Born: {formatDate(person.birthDate)}</span>
            )}
            {person.deathDate && (
              <span>Died: {formatDate(person.deathDate)}</span>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-zinc-800 hover:!bg-amber-400 transition-colors"
      />
    </div>
  );
}

export default memo(PersonNode);

