
// Mock data service for prototype demo
export interface MockItinerary {
  id: string
  agent_id: string
  traveler_id?: string
  name: string
  destination: string
  start_date: string
  end_date: string
  number_of_travelers: number
  preferences: string
  status: 'draft' | 'shared' | 'confirmed' | 'modified'
  days: { day: number; title: string; activities: string[] }[]
  share_token?: string
  created_at: string
  updated_at: string
}

export interface MockNegotiation {
  id: string
  itinerary_id: string
  agent_id: string
  vendor_id: string
  service_type: string
  description: string
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected'
  messages: any[]
  created_at: string
  updated_at: string
}

// Mock storage
let mockItineraries: MockItinerary[] = []
let mockNegotiations: MockNegotiation[] = []

export const mockDataService = {
  // Itinerary methods
  async createItinerary(data: Omit<MockItinerary, 'id' | 'created_at' | 'updated_at'>) {
    const itinerary: MockItinerary = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockItineraries.push(itinerary)
    return itinerary
  },

  async getItinerary(id: string) {
    return mockItineraries.find(it => it.id === id)
  },

  async getAgentItineraries(agentId: string) {
    return mockItineraries.filter(it => it.agent_id === agentId)
  },

  async shareItinerary(id: string, travelerEmail: string) {
    const itinerary = mockItineraries.find(it => it.id === id)
    if (itinerary) {
      itinerary.share_token = crypto.randomUUID()
      itinerary.status = 'shared'
      itinerary.updated_at = new Date().toISOString()
    }
    return itinerary
  },

  // Negotiation methods
  async createNegotiation(data: Omit<MockNegotiation, 'id' | 'created_at' | 'updated_at'>) {
    const negotiation: MockNegotiation = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockNegotiations.push(negotiation)
    return negotiation
  },

  async getVendorNegotiations(vendorId: string) {
    return mockNegotiations.filter(neg => neg.vendor_id === vendorId)
  },

  async getAgentNegotiations(agentId: string) {
    return mockNegotiations.filter(neg => neg.agent_id === agentId)
  }
}
