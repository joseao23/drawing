
import React from 'react';
import { Person } from '../types';

interface PersonCardProps {
  person: Person;
  isSelected: boolean;
  onToggle: (id: string) => void;
  disabled: boolean;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, isSelected, onToggle, disabled }) => {
  return (
    <div 
      onClick={() => !disabled && onToggle(person.id)}
      className={`relative group cursor-pointer transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
      }`}
    >
      {/* 縮小邊框寬度與圓角 */}
      <div className={`aspect-square rounded-[12px] overflow-hidden border-[2px] transition-all duration-300 ${
        isSelected 
          ? 'border-[#00A0E9] bg-white shadow-[0_3px_0_#0080BA]' 
          : 'border-gray-200 opacity-60 grayscale bg-white'
      }`}>
        <img 
          src={person.photoUrl} 
          alt={person.name} 
          className="w-full h-full object-cover p-0.5 rounded-[10px]"
        />
      </div>
      
      <div className="mt-1 text-center">
        {/* 縮小字體與內距 */}
        <span className={`text-[10px] font-black tracking-tight transition-colors duration-300 px-1.5 py-0.2 rounded-full ${
          isSelected ? 'bg-[#00A0E9] text-white' : 'text-gray-500'
        }`}>
          {person.name}
        </span>
      </div>
    </div>
  );
};
