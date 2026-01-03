'use server';

import fs from 'fs/promises';
import path from 'path';
import { FamilyData, Person, Connection } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

function getFamilyFilePath(familyName: string): string {
  const sanitized = familyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return path.join(DATA_DIR, `${sanitized}.json`);
}

export async function listFamilies(): Promise<string[]> {
  await ensureDataDir();
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));
  } catch {
    return [];
  }
}

export async function getFamilyData(familyName: string): Promise<FamilyData | null> {
  await ensureDataDir();
  const filePath = getFamilyFilePath(familyName);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as FamilyData;
  } catch {
    return null;
  }
}

export async function createFamily(familyName: string): Promise<FamilyData> {
  await ensureDataDir();
  const filePath = getFamilyFilePath(familyName);
  
  const newFamily: FamilyData = {
    familyName,
    people: [],
    connections: []
  };
  
  await fs.writeFile(filePath, JSON.stringify(newFamily, null, 2));
  return newFamily;
}

export async function saveFamilyData(familyName: string, data: FamilyData): Promise<void> {
  await ensureDataDir();
  const filePath = getFamilyFilePath(familyName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function addPerson(familyName: string, person: Omit<Person, 'id' | 'position'>): Promise<Person> {
  const data = await getFamilyData(familyName);
  if (!data) throw new Error('Family not found');
  
  const newPerson: Person = {
    ...person,
    id: Date.now().toString(),
    position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }
  };
  
  data.people.push(newPerson);
  await saveFamilyData(familyName, data);
  return newPerson;
}

export async function updatePersonPosition(
  familyName: string,
  personId: string,
  position: { x: number; y: number }
): Promise<void> {
  const data = await getFamilyData(familyName);
  if (!data) throw new Error('Family not found');
  
  const person = data.people.find(p => p.id === personId);
  if (person) {
    person.position = position;
    await saveFamilyData(familyName, data);
  }
}

export async function updatePerson(
  familyName: string,
  personId: string,
  updates: Partial<Person>
): Promise<void> {
  const data = await getFamilyData(familyName);
  if (!data) throw new Error('Family not found');
  
  const personIndex = data.people.findIndex(p => p.id === personId);
  if (personIndex !== -1) {
    data.people[personIndex] = { ...data.people[personIndex], ...updates };
    await saveFamilyData(familyName, data);
  }
}

export async function deletePerson(familyName: string, personId: string): Promise<void> {
  const data = await getFamilyData(familyName);
  if (!data) throw new Error('Family not found');
  
  data.people = data.people.filter(p => p.id !== personId);
  data.connections = data.connections.filter(
    c => c.source !== personId && c.target !== personId
  );
  await saveFamilyData(familyName, data);
}

export async function addConnection(
  familyName: string,
  connection: Omit<Connection, 'id'>
): Promise<Connection> {
  const data = await getFamilyData(familyName);
  if (!data) throw new Error('Family not found');
  
  const newConnection: Connection = {
    ...connection,
    id: `conn-${Date.now()}`
  };
  
  // Check if connection already exists
  const exists = data.connections.some(
    c => (c.source === connection.source && c.target === connection.target) ||
         (c.source === connection.target && c.target === connection.source && c.type === 'spouse')
  );
  
  if (!exists) {
    data.connections.push(newConnection);
    await saveFamilyData(familyName, data);
  }
  
  return newConnection;
}

export async function deleteConnection(familyName: string, connectionId: string): Promise<void> {
  const data = await getFamilyData(familyName);
  if (!data) throw new Error('Family not found');
  
  data.connections = data.connections.filter(c => c.id !== connectionId);
  await saveFamilyData(familyName, data);
}

