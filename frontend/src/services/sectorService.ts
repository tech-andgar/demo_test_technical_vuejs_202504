import type { Sector } from '../models/sector';
import { fetchFilterOptions } from './api';

export const getSectors = async (): Promise<Sector[]> => {
  try {
    const { sectors } = await fetchFilterOptions();
    return sectors.filter(sector => sector.id !== undefined) as Sector[];
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
}; 
