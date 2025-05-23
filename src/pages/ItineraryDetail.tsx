
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, DollarSign, Share, MessageSquare, Edit } from "lucide-react";

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real application, you would fetch this data from your API
  const itinerary = {
    id,
    title: "European Adventure",
    destination: "France, Italy, Spain",
    dates: "June 15 - June 30, 2025",
    status: "review",
    client: "John & Sarah Smith",
    totalPrice: 8900,
    perPersonPrice: 4450,
    description: "A 15-day exploration of Europe's most beautiful cities and landscapes.",
    days: [
      {
        day: 1,
        date: "June 15, 2025",
        location: "Paris, France",
        activities: [
          { time: "10:00 AM", description: "Arrival and hotel check-in" },
          { time: "1:00 PM", description: "Lunch at Le Bistrot" },
          { time: "3:00 PM", description: "Guided tour of the Louvre" },
          { time: "7:00 PM", description: "Dinner cruise on the Seine" }
        ],
        accommodation: "Grand Hotel Paris"
      },
      {
        day: 2,
        date: "June 16, 2025",
        location: "Paris, France",
        activities: [
          { time: "9:00 AM", description: "Visit to Eiffel Tower" },
          { time: "12:30 PM", description: "Lunch at Café Madeleine" },
          { time: "2:30 PM", description: "Montmartre walking tour" },
          { time: "7:30 PM", description: "Dinner at Le Petit Bistro" }
        ],
        accommodation: "Grand Hotel Paris"
      },
      {
        day: 3,
        date: "June 17, 2025",
        location: "Paris to Rome",
        activities: [
          { time: "8:00 AM", description: "Check out and transfer to airport" },
          { time: "11:30 AM", description: "Flight to Rome" },
          { time: "2:00 PM", description: "Arrival and hotel check-in" },
          { time: "5:00 PM", description: "Evening walk and dinner in Trastevere" }
        ],
        accommodation: "Roma Luxe Hotel"
      }
    ],
    services: [
      { name: "Flights", provider: "Air Europa", price: 1800 },
      { name: "Hotels", provider: "Various", price: 4500 },
      { name: "Tours", provider: "Local Guides", price: 1200 },
      { name: "Transfers", provider: "Euro Transport", price: 800 },
      { name: "Insurance", provider: "SafeTravel Inc", price: 600 }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{itinerary.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{itinerary.destination}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{itinerary.dates}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
              <p>15 days / 14 nights</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Travelers</h3>
              <p>2 Adults</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Price</h3>
              <p className="text-xl font-bold flex items-center">
                <DollarSign className="h-5 w-5 mr-1" />
                {itinerary.totalPrice}
              </p>
              <p className="text-sm text-muted-foreground">
                (${itinerary.perPersonPrice} per person)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Approve Itinerary</Button>
          </CardFooter>
        </Card>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="itinerary">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="notes">Notes & Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary" className="space-y-6 mt-6">
              <p className="text-muted-foreground">{itinerary.description}</p>
              
              {itinerary.days.map((day) => (
                <Card key={day.day}>
                  <CardHeader>
                    <CardTitle>Day {day.day}: {day.location}</CardTitle>
                    <CardDescription>{day.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="flex">
                          <div className="w-24 font-medium">{activity.time}</div>
                          <div>{activity.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center w-full text-sm text-muted-foreground">
                      <span className="font-medium mr-2">Accommodation:</span> 
                      {day.accommodation}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Included Services</CardTitle>
                  <CardDescription>
                    Breakdown of all services included in your itinerary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {itinerary.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">Provider: {service.provider}</p>
                        </div>
                        <div className="font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {service.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="font-medium">Total</div>
                  <div className="font-bold text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {itinerary.totalPrice}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>This section would contain notes, special requests, and communication between travelers and agents.</p>
                    <p className="text-muted-foreground">Currently empty for this itinerary.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add a Note
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetail;
