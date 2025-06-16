
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
    
    if (modification.description.includes('beach')) {
      setItinerary(prev => [...prev, {
        day: 5,
        title: "Extended Beach Paradise",
        activities: [
          "🏖️ Full day at Kata Beach",
          "🏄‍♂️ Water sports activities",
          "🍹 Beachside lunch",
          "🌅 Sunset photography session"
        ]
      }]);
      setCustomizationProgress(prev => Math.min(prev + 20, 100));
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
