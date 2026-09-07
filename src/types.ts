export type VehicleCategory = 'sedan' | 'suv' | 'van' | 'motorcycle';

export interface VehicleOption {
  id: VehicleCategory;
  name: string;
  capacity: string;
  description: string;
  baseFare: number;
  perKmRate: number;
  etaMins: number;
  icon: string;
  image?: string;
}

export type RideStatus = 
  | 'idle'
  | 'searching'
  | 'requested'
  | 'accepted'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerRating: number;
  passengerAvatar?: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  vehicleType: VehicleCategory;
  fare: number;
  originalFare: number;
  discount: number;
  promoCode?: string;
  distanceKm: number;
  durationMins: number;
  status: RideStatus;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  driverVehicle?: string;
  driverPlate?: string;
  driverAvatar?: string;
  paymentMethod: 'Cash' | 'GCash' | 'Visa' | 'Mastercard' | 'Wallet';
  createdAt: string;
  completedAt?: string;
  etaMins?: number;
  routeProgress?: number; // 0 to 100%
  cancellationReason?: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderRole: 'passenger' | 'driver';
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface DriverUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  driverIdCode: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  acceptanceRate: number;
  walletBalance: number;
  todayEarnings: number;
  onlineHours: string;
  vehicle: {
    type: VehicleCategory;
    model: string;
    plateNumber: string;
    color: string;
    seats: number;
  };
  city: string;
  status: 'online' | 'offline' | 'busy';
  isApproved: boolean;
  documents: {
    license: boolean;
    nbiClearance: boolean;
    orCr: boolean;
  };
}

export interface PassengerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  completedRides: number;
  walletBalance: number;
  savedPlacesCount: number;
  promoVouchersCount: number;
  savedPlaces: {
    id: string;
    label: 'Home' | 'Work' | 'Favorites' | 'Custom';
    title: string;
    address: string;
    lat: number;
    lng: number;
  }[];
}

export interface DriverApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: VehicleCategory;
  vehicleModel: string;
  plateNumber: string;
  city: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar: string;
  experienceYears: number;
  documents?: string[];
}

export interface AdminActivity {
  id: string;
  text: string;
  time: string;
  type?: 'trip' | 'driver' | 'user' | 'system';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: 'passenger' | 'driver';
  subject: string;
  category: 'Trip Issue' | 'Payment & Wallet' | 'App Bug' | 'Driver Conduct' | 'Safety';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: {
    sender: string;
    text: string;
    timestamp: string;
  }[];
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: 'passenger' | 'driver';
  userPhone: string;
  userAvatar?: string;
  rideId?: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  emergencyType: 'Safety SOS' | 'Accident' | 'Medical' | 'Harassment' | 'Vehicle Breakdown' | 'Panic Button';
  status: 'active' | 'responding' | 'resolved' | 'dismissed';
  createdAt: string;
  notes?: string;
  assignedResponder?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: string;
}

export interface PlatformStat {
  totalPassengers: number;
  activeDrivers: number;
  tripsToday: number;
  revenueToday: number;
  pendingDrivers: number;
  supportTickets: number;
  growth: {
    passengers: number;
    drivers: number;
    trips: number;
    revenue: number;
  };
}

export type ActivePlatformView = 
  | 'passenger'
  | 'driver'
  | 'admin';

