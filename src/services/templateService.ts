
import { ItineraryTemplate } from '@/types/templates';
import { mockTemplates } from '@/data/mockTemplateData';

export const templateService = {
  async searchTemplates(query: string): Promise<ItineraryTemplate[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) {
      return mockTemplates;
    }
    
    const searchTerm = query.toLowerCase();
    return mockTemplates.filter(template => 
      template.destination.toLowerCase().includes(searchTerm) ||
      template.name.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  async getTemplate(id: string): Promise<ItineraryTemplate | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTemplates.find(template => template.id === id) || null;
  },

  async getPopularTemplates(): Promise<ItineraryTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTemplates
      .sort((a, b) => b.timesUsed - a.timesUsed)
      .slice(0, 6);
  },

  async getRecentTemplates(): Promise<ItineraryTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTemplates
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, 4);
  }
};
