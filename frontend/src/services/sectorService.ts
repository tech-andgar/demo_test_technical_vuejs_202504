import { Sector } from '../models/sector';
import { kivaAPI } from '../api/kivaAPI';

export const getSectors = async (): Promise<Sector[]> => {
  const query = `
    {
      lend {
        loans {
          values {
            sector {
              name
              id
            }
          }
        }
      }
    }
  `;

  try {
    const response = await kivaAPI.post('', { query });
    const loans = response.data.data.lend.loans.values;
    
    // Extract unique sectors
    const sectorsMap = new Map<number, Sector>();
    loans.forEach((loan: any) => {
      if (loan.sector && !sectorsMap.has(loan.sector.id)) {
        sectorsMap.set(loan.sector.id, {
          id: loan.sector.id,
          name: loan.sector.name
        });
      }
    });
    
    return Array.from(sectorsMap.values());
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
} 
