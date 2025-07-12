export interface ActiveNegotiation {
  id: string | number;
  provider: string;
  service: string;
  serviceType: "hotel" | "tour" | "transfer" | "restaurant" | "activity";
  originalRate: number;
  targetRate: number;
  currentOffer: number;
  status: string;
  statusColor: string;
  lastUpdate: string;
  groupSize: number;
  duration: number;
}