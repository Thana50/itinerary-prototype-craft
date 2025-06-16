
interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

export const detectModification = (message: string): Modification | null => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('cooking class') && lowercaseMessage.includes('day 3')) {
    return {
      id: Date.now().toString(),
      description: "Added Thai cooking class to Day 3",
      priceChange: 45,
      timestamp: new Date()
    };
  }
  
  if (lowercaseMessage.includes('more beach') || lowercaseMessage.includes('beach day')) {
    return {
      id: Date.now().toString(),
      description: "Extended beach activities",
      priceChange: 25,
      timestamp: new Date()
    };
  }
  
  if (lowercaseMessage.includes('spa') || lowercaseMessage.includes('massage')) {
    return {
      id: Date.now().toString(),
      description: "Added luxury spa treatment",
      priceChange: 80,
      timestamp: new Date()
    };
  }
  
  return null;
};
