export interface Person {
  id: string;
  name: string;
  birthDate: string;
  deathDate: string | null;
  bio: string;
  imageUrl: string;
  position: { x: number; y: number };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'parent' | 'child' | 'spouse';
}

export interface FamilyData {
  familyName: string;
  people: Person[];
  connections: Connection[];
}

export interface PersonFormData {
  name: string;
  birthDate: string;
  deathDate: string;
  bio: string;
  imageUrl: string;
}

