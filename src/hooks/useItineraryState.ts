
import { useState } from "react";

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

interface Modification {
  id: string;
  description: string;
  priceChange: number;
  timestamp: Date;
}

export const useItineraryState = () => {
  const [totalPrice, setTotalPrice] = useState(3100);
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [customizationProgress, setCustomizationProgress] = useState(25);
  
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      day: 1,
      title: "Arrival & Patong Beach",
      activities: [
        "🚌 Airport transfer to hotel",
        "🏨 Hotel check-in and welcome drink", 
        "🏖️ Patong Beach sunset walk",
        "🍽️ Halal dinner at local Thai restaurant"
      ]
    },
    {
      day: 2,
      title: "Phi Phi Islands Adventure",
      activities: [
        "🛥️ Island hopping boat tour",
        "🤿 Snorkeling at Maya Bay",
        "🍽️ Halal lunch on boat",
        "🌅 Return to hotel evening"
      ]
    },
    {
      day: 3,
      title: "Cultural Phuket Experience", 
      activities: [
        "🛕 Big Buddha Temple visit",
        "🏛️ Old Town Phuket walking tour",
        "💆 Traditional Thai massage",
        "🍜 Halal street food experience"
      ]
    },
    {
      day: 4,
      title: "Adventure & Nature",
      activities: [
        "🌿 Zip lining through jungle",
        "🏍️ ATV adventure tour", 
        "🐘 Elephant sanctuary visit",
        "🏊 Pool relaxation time"
      ]
    }
  ]);

  const updateItinerary = (modification: Modification) => {
    // Scenario 1: Cooking class on Day 3
    if (modification.description.includes('cooking class')) {
      setItinerary(prev => prev.map(day => 
        day.day === 3 
          ? {
              ...day,
              title: "Cultural & Culinary Experience",
              activities: [...day.activities, "👨‍🍳 Thai cooking class (evening)"]
            }
          : day
      ));
      setCustomizationProgress(prev => Math.min(prev + 15, 100));
    }
    
    // Scenario 2: Extended beach activities (adds new day)
    if (modification.description.includes('Extended beach')) {
      setItinerary(prev => {
        const hasDay5 = prev.some(day => day.day === 5);
        if (!hasDay5) {
          return [...prev, {
            day: 5,
            title: "Extended Beach Paradise",
            activities: [
              "🏖️ Full day at Kata Beach",
              "🏄‍♂️ Water sports activities",
              "🍹 Beachside lunch",
              "🌅 Sunset photography session"
            ]
          }];
        }
        return prev;
      });
      setCustomizationProgress(prev => Math.min(prev + 20, 100));
    }
    
    // Scenario 3: Spa treatment on Day 3
    if (modification.description.includes('spa treatment')) {
      setItinerary(prev => prev.map(day => 
        day.day === 3 
          ? {
              ...day,
              title: "Cultural Phuket & Wellness",
              activities: [...day.activities.filter(a => !a.includes('massage')), "💆‍♀️ Luxury spa treatment (2 hours)"]
            }
          : day
      ));
      setCustomizationProgress(prev => Math.min(prev + 10, 100));
    }
    
    // Scenario 4: Add another day
    if (modification.description.includes('Added Day 5')) {
      setItinerary(prev => {
        const hasDay5 = prev.some(day => day.day === 5);
        if (!hasDay5) {
          return [...prev, {
            day: 5,
            title: "Island Discovery Day",
            activities: [
              "🏝️ James Bond Island tour",
              "🛶 Sea kayaking adventure",
              "🍽️ Halal seafood lunch",
              "📸 Scenic viewpoints visit"
            ]
          }];
        }
        return prev;
      });
      setCustomizationProgress(prev => Math.min(prev + 20, 100));
    }
    
    // Scenario 5: Snorkeling excursion on Day 2
    if (modification.description.includes('snorkeling')) {
      setItinerary(prev => prev.map(day => 
        day.day === 2 
          ? {
              ...day,
              title: "Phi Phi Islands & Snorkeling",
              activities: [...day.activities, "🤿 Premium snorkeling gear rental"]
            }
          : day
      ));
      setCustomizationProgress(prev => Math.min(prev + 12, 100));
    }
  };

  const addModification = (modification: Modification) => {
    setModifications(prev => [modification, ...prev]);
    setTotalPrice(prev => prev + (modification.priceChange * 4)); // 4 people
  };

  return {
    itinerary,
    totalPrice,
    modifications,
    customizationProgress,
    updateItinerary,
    addModification
  };
};
