
interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

export const detectModification = (message: string): Modification | null => {
  const lowercaseMessage = message.toLowerCase();
  
  // Scenario 1: Cooking class on Day 3
  if (lowercaseMessage.includes('cooking class') && lowercaseMessage.includes('day 3')) {
    return {
      id: Date.now().toString(),
      description: "Added Thai cooking class to Day 3",
      priceChange: 45,
      timestamp: new Date()
    };
  }
  
  // Scenario 2: Extended beach activities
  if (lowercaseMessage.includes('more beach') || lowercaseMessage.includes('beach day')) {
    return {
      id: Date.now().toString(),
      description: "Extended beach activities",
      priceChange: 25,
      timestamp: new Date()
    };
  }
  
  // Scenario 3: Spa treatment
  if (lowercaseMessage.includes('spa') || lowercaseMessage.includes('massage')) {
    return {
      id: Date.now().toString(),
      description: "Added luxury spa treatment",
      priceChange: 80,
      timestamp: new Date()
    };
  }
  
  // Scenario 4: Add another day
  if (lowercaseMessage.includes('add another day') || 
      lowercaseMessage.includes('add a day') || 
      lowercaseMessage.includes('extend trip') ||
      lowercaseMessage.includes('one more day')) {
    return {
      id: Date.now().toString(),
      description: "Added Day 5 to the itinerary",
      priceChange: 150,
      timestamp: new Date()
    };
  }
  
  // Scenario 5: Snorkeling activity
  if ((lowercaseMessage.includes('add') || lowercaseMessage.includes('include')) && 
      lowercaseMessage.includes('snorkel')) {
    return {
      id: Date.now().toString(),
      description: "Added snorkeling excursion",
      priceChange: 65,
      timestamp: new Date()
    };
  }
  
  return null;
};
