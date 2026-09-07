import { 
  DriverUser, 
  PassengerUser, 
  RideRequest, 
  VehicleOption, 
  DriverApplication, 
  SupportTicket, 
  PlatformStat,
  ChatMessage,
  EmergencyRequest
} from '../types';

export const INITIAL_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: 'SOS-9021',
    userId: 'pass_001',
    userName: 'John Michael Nabung',
    userRole: 'passenger',
    userPhone: '0912 345 6789',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rideId: 'TRIP-8850',
    location: {
      name: 'SM North EDSA, Quezon City',
      address: 'EDSA cor. North Ave, Quezon City, Metro Manila',
      lat: 14.6565,
      lng: 121.0289
    },
    emergencyType: 'Safety SOS',
    status: 'active',
    createdAt: '5 mins ago',
    notes: 'Passenger triggered Safety SOS button during trip. Vehicle route slowed down near North Ave flyover.',
    driverName: 'Juan Dela Cruz',
    driverPhone: '0917 888 1234',
    vehicleInfo: 'Toyota Vios (Sedan) • NDA 1234'
  },
  {
    id: 'SOS-8890',
    userId: 'driver_002',
    userName: 'Mark Reyes',
    userRole: 'driver',
    userPhone: '0918 222 3344',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rideId: 'TRIP-8812',
    location: {
      name: 'Commonwealth Ave, Diliman, Quezon City',
      address: 'Near UP Technohub, Commonwealth Ave',
      lat: 14.6548,
      lng: 121.0560
    },
    emergencyType: 'Vehicle Breakdown',
    status: 'responding',
    createdAt: '28 mins ago',
    assignedResponder: 'Quezon City Emergency Unit & Towing Service',
    notes: 'Rider reported rear tire puncture and mechanical stall in inner lane. Tow truck dispatched.',
    driverName: 'Mark Reyes',
    driverPhone: '0918 222 3344',
    vehicleInfo: 'Honda Click 125 • DEF 5678'
  }
];

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'sedan',
    name: 'Sedan',
    capacity: '1-4 seats',
    description: 'Comfortable rides for everyday travel',
    baseFare: 120,
    perKmRate: 15,
    etaMins: 3,
    icon: 'Car'
  },
  {
    id: 'suv',
    name: 'SUV',
    capacity: '1-6 seats',
    description: 'Spacious and perfect for group travel',
    baseFare: 180,
    perKmRate: 22,
    etaMins: 5,
    icon: 'CarFront'
  },
  {
    id: 'van',
    name: 'Van',
    capacity: '1-10 seats',
    description: 'Best for big groups and bulky items',
    baseFare: 250,
    perKmRate: 30,
    etaMins: 8,
    icon: 'Bus'
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    capacity: '1 passenger',
    description: 'Beat the traffic and get there faster',
    baseFare: 80,
    perKmRate: 10,
    etaMins: 2,
    icon: 'Bike'
  }
];

export const INITIAL_PASSENGER: PassengerUser = {
  id: 'pass_001',
  name: 'John Michael Nabung',
  phone: '0912 345 6789',
  email: 'john.nabung@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  rating: 4.8,
  completedRides: 25,
  walletBalance: 1250.00,
  savedPlacesCount: 6,
  promoVouchersCount: 3,
  savedPlaces: [
    {
      id: 'sp_1',
      label: 'Home',
      title: 'Home',
      address: 'Bagong Silang, Caloocan City',
      lat: 14.7735,
      lng: 121.0428
    },
    {
      id: 'sp_2',
      label: 'Work',
      title: 'UP Diliman Technohub',
      address: 'Commonwealth Ave, Diliman, Quezon City',
      lat: 14.6548,
      lng: 121.0560
    },
    {
      id: 'sp_3',
      label: 'Favorites',
      title: 'SM North EDSA',
      address: 'EDSA, Quezon City',
      lat: 14.6565,
      lng: 121.0289
    },
    {
      id: 'sp_4',
      label: 'Custom',
      title: 'SM City Fairview',
      address: 'Quirino Highway, Novaliches, Quezon City',
      lat: 14.7336,
      lng: 121.0583
    },
    {
      id: 'sp_5',
      label: 'Custom',
      title: 'University of Caloocan City',
      address: 'Bigte, Camarin, Caloocan City',
      lat: 14.7562,
      lng: 121.0345
    },
    {
      id: 'sp_6',
      label: 'Custom',
      title: 'Robinsons Magnolia',
      address: 'Doña Hemady St, New Manila, Quezon City',
      lat: 14.6186,
      lng: 121.0336
    }
  ]
};

export const INITIAL_DRIVER: DriverUser = {
  id: 'drv_001',
  name: 'Juan Dela Cruz',
  phone: '0917 888 1234',
  email: 'juan.delacruz@swiftride.com',
  driverIdCode: 'SWD-1204',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  rating: 4.9,
  totalTrips: 542,
  acceptanceRate: 98,
  walletBalance: 1250.00,
  todayEarnings: 1250.00,
  onlineHours: '5h 42m',
  vehicle: {
    type: 'sedan',
    model: 'Toyota Vios (Black)',
    plateNumber: 'NDA 1234',
    color: 'Metallic Black',
    seats: 4
  },
  city: 'Caloocan / Quezon City',
  status: 'online',
  isApproved: true,
  documents: {
    license: true,
    nbiClearance: true,
    orCr: true
  }
};

export const INITIAL_PAST_RIDES: RideRequest[] = [
  {
    id: 'TRIP-1024',
    passengerId: 'pass_001',
    passengerName: 'John Michael Nabung',
    passengerPhone: '0912 345 6789',
    passengerRating: 4.8,
    passengerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    pickup: {
      name: 'Bagong Silang',
      address: 'Bagong Silang, Caloocan City',
      lat: 14.7735,
      lng: 121.0428
    },
    dropoff: {
      name: 'SM North EDSA',
      address: 'SM North EDSA, Quezon City',
      lat: 14.6565,
      lng: 121.0289
    },
    vehicleType: 'sedan',
    fare: 180.00,
    originalFare: 180.00,
    discount: 0,
    distanceKm: 14.2,
    durationMins: 28,
    status: 'completed',
    driverId: 'drv_001',
    driverName: 'Juan Dela Cruz',
    driverPhone: '0917 888 1234',
    driverRating: 4.9,
    driverVehicle: 'Toyota Vios (NDA 1234)',
    driverPlate: 'NDA 1234',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    paymentMethod: 'GCash',
    createdAt: 'Today, 08:35 AM',
    completedAt: 'Today, 09:03 AM'
  },
  {
    id: 'TRIP-1023',
    passengerId: 'pass_002',
    passengerName: 'Maria Santos',
    passengerPhone: '0918 222 3456',
    passengerRating: 4.9,
    passengerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    pickup: {
      name: 'SM Fairview',
      address: 'SM Fairview, Quezon City',
      lat: 14.7336,
      lng: 121.0583
    },
    dropoff: {
      name: 'UP Diliman',
      address: 'UP Diliman, Quezon City',
      lat: 14.6537,
      lng: 121.0685
    },
    vehicleType: 'suv',
    fare: 150.00,
    originalFare: 150.00,
    discount: 0,
    distanceKm: 11.5,
    durationMins: 22,
    status: 'completed',
    driverId: 'drv_002',
    driverName: 'Mark Reyes',
    driverPhone: '0922 456 7890',
    driverRating: 4.7,
    driverVehicle: 'Mitsubishi Xpander',
    driverPlate: 'NCA 5678',
    driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    paymentMethod: 'Cash',
    createdAt: 'Yesterday, 06:20 PM',
    completedAt: 'Yesterday, 06:42 PM'
  },
  {
    id: 'TRIP-1022',
    passengerId: 'pass_001',
    passengerName: 'John Michael Nabung',
    passengerPhone: '0912 345 6789',
    passengerRating: 4.8,
    pickup: {
      name: 'Caloocan City Hall',
      address: 'Caloocan City Hall, Caloocan City',
      lat: 14.6472,
      lng: 120.9765
    },
    dropoff: {
      name: 'Robinsons Magnolia',
      address: 'Robinsons Magnolia, QC',
      lat: 14.6186,
      lng: 121.0336
    },
    vehicleType: 'sedan',
    fare: 210.00,
    originalFare: 210.00,
    discount: 0,
    distanceKm: 16.0,
    durationMins: 35,
    status: 'cancelled',
    cancellationReason: 'Ride was cancelled by you (Driver delayed)',
    paymentMethod: 'Wallet',
    createdAt: 'July 10, 2025, 09:15 AM'
  },
  {
    id: 'TRIP-1021',
    passengerId: 'pass_003',
    passengerName: 'Carla Reyes',
    passengerPhone: '0933 111 8899',
    passengerRating: 5.0,
    pickup: {
      name: 'Novaliches',
      address: 'Novaliches, Quezon City',
      lat: 14.7177,
      lng: 121.0366
    },
    dropoff: {
      name: 'Cubao',
      address: 'Cubao, Quezon City',
      lat: 14.6200,
      lng: 121.0533
    },
    vehicleType: 'sedan',
    fare: 210.00,
    originalFare: 210.00,
    discount: 0,
    distanceKm: 13.8,
    durationMins: 26,
    status: 'completed',
    driverId: 'drv_003',
    driverName: 'Carlo Santos',
    driverPhone: '0915 333 4455',
    driverRating: 5.0,
    driverVehicle: 'Toyota Vios',
    driverPlate: 'NBD 2468',
    paymentMethod: 'GCash',
    createdAt: 'July 8, 2025, 07:45 PM',
    completedAt: 'July 8, 2025, 08:11 PM'
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'TRIP-1024': [
    {
      id: 'msg_1',
      rideId: 'TRIP-1024',
      senderId: 'drv_001',
      senderRole: 'driver',
      senderName: 'Juan Dela Cruz',
      text: "Hi John! I'm on my way to your pickup location.",
      timestamp: '9:35 AM'
    },
    {
      id: 'msg_2',
      rideId: 'TRIP-1024',
      senderId: 'pass_001',
      senderRole: 'passenger',
      senderName: 'John Michael Nabung',
      text: "Hi Kuya! Thank you. I'm waiting outside the gate.",
      timestamp: '9:36 AM'
    },
    {
      id: 'msg_3',
      rideId: 'TRIP-1024',
      senderId: 'drv_001',
      senderRole: 'driver',
      senderName: 'Juan Dela Cruz',
      text: 'Got it! See you in a bit.',
      timestamp: '9:36 AM'
    },
    {
      id: 'msg_4',
      rideId: 'TRIP-1024',
      senderId: 'drv_001',
      senderRole: 'driver',
      senderName: 'Juan Dela Cruz',
      text: "I've arrived at your location. Look for the black Vios.",
      timestamp: '9:37 AM'
    },
    {
      id: 'msg_5',
      rideId: 'TRIP-1024',
      senderId: 'pass_001',
      senderRole: 'passenger',
      senderName: 'John Michael Nabung',
      text: 'Okay, coming na po.',
      timestamp: '9:37 AM'
    },
    {
      id: 'msg_6',
      rideId: 'TRIP-1024',
      senderId: 'drv_001',
      senderRole: 'driver',
      senderName: 'Juan Dela Cruz',
      text: 'No rush, take your time. 😊',
      timestamp: '9:38 AM'
    }
  ]
};

export const INITIAL_PENDING_APPLICATIONS: DriverApplication[] = [
  {
    id: 'APP-501',
    name: 'Juan Dela Cruz',
    phone: '0912 345 6789',
    email: 'juan.delacruz@gmail.com',
    vehicleType: 'sedan',
    vehicleModel: 'Toyota Vios Sedan',
    plateNumber: 'ABC 1234',
    city: 'Quezon City',
    submittedDate: 'May 31, 2025, 10:30 AM',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    experienceYears: 4
  },
  {
    id: 'APP-502',
    name: 'Mark Reyes',
    phone: '0922 456 7890',
    email: 'mark.reyes@gmail.com',
    vehicleType: 'motorcycle',
    vehicleModel: 'Honda Click 125 Motorcycle',
    plateNumber: 'DEF 5678',
    city: 'Caloocan City',
    submittedDate: 'May 31, 2025, 09:15 AM',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    experienceYears: 3
  },
  {
    id: 'APP-503',
    name: 'Ana Garcia',
    phone: '0933 567 8901',
    email: 'ana.garcia@gmail.com',
    vehicleType: 'suv',
    vehicleModel: 'Mitsubishi Xpander MPV',
    plateNumber: 'GHI 9101',
    city: 'Manila',
    submittedDate: 'May 30, 2025, 04:45 PM',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    experienceYears: 5
  },
  {
    id: 'APP-504',
    name: 'Rogelio Cruz',
    phone: '0944 678 9012',
    email: 'rogelio.cruz@gmail.com',
    vehicleType: 'motorcycle',
    vehicleModel: 'Yamaha NMAX Motorcycle',
    plateNumber: 'JKL 2345',
    city: 'Pasig City',
    submittedDate: 'May 30, 2025, 02:20 PM',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    experienceYears: 2
  },
  {
    id: 'APP-505',
    name: 'Angelina Lou',
    phone: '0955 789 0123',
    email: 'angelina.lou@gmail.com',
    vehicleType: 'van',
    vehicleModel: 'Suzuki Ertiga MPV',
    plateNumber: 'MNO 3456',
    city: 'Makati City',
    submittedDate: 'May 30, 2025, 11:05 AM',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    experienceYears: 6
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-301',
    userId: 'pass_001',
    userName: 'John Michael Nabung',
    userRole: 'passenger',
    subject: 'Fare calculation inquiry for route change',
    category: 'Payment & Wallet',
    status: 'open',
    priority: 'medium',
    createdAt: '25 mins ago',
    messages: [
      {
        sender: 'John Michael Nabung',
        text: 'Hello, I was charged ₱180 instead of the quoted ₱150 because we took a slight detour due to roadworks.',
        timestamp: '10:15 AM'
      }
    ]
  },
  {
    id: 'TICK-302',
    userId: 'drv_001',
    userName: 'Juan Dela Cruz',
    userRole: 'driver',
    subject: 'Weekly Incentive Bonus Payout',
    category: 'Trip Issue',
    status: 'in_progress',
    priority: 'low',
    createdAt: '2 hours ago',
    messages: [
      {
        sender: 'Juan Dela Cruz',
        text: 'Completed 20 trips this week, checking when the ₱100 bonus will reflect in wallet balance.',
        timestamp: '08:40 AM'
      }
    ]
  },
  {
    id: 'TICK-303',
    userId: 'pass_002',
    userName: 'Maria Santos',
    userRole: 'passenger',
    subject: 'Driver arrived early and was courteous',
    category: 'Safety',
    status: 'resolved',
    priority: 'low',
    createdAt: 'Yesterday',
    messages: [
      {
        sender: 'Maria Santos',
        text: 'Just wanted to give a commendation to driver Mark Reyes for returning my umbrella left in the back seat!',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export const INITIAL_PLATFORM_STATS: PlatformStat = {
  totalPassengers: 12542,
  activeDrivers: 2315,
  tripsToday: 1428,
  revenueToday: 254870,
  pendingDrivers: 18,
  supportTickets: 9,
  growth: {
    passengers: 12.5,
    drivers: 8.3,
    trips: 15.7,
    revenue: 18.6
  }
};

export const INITIAL_ACTIVITIES = [
  { id: 'act_1', text: 'Driver Juan Dela Cruz completed ride TRIP-1024 to SM North EDSA', time: '2 mins ago', type: 'trip' as const },
  { id: 'act_2', text: 'New Passenger John Michael Nabung verified wallet via GCash OTP', time: '8 mins ago', type: 'user' as const },
  { id: 'act_3', text: 'Driver application #APP-501 (Juan Dela Cruz) verified & approved', time: '15 mins ago', type: 'driver' as const },
  { id: 'act_4', text: 'Automated fleet dispatch paired ride TRIP-1023 in Quezon City', time: '24 mins ago', type: 'trip' as const },
  { id: 'act_5', text: 'Support Ticket #TICK-303 marked resolved by Commendation team', time: '45 mins ago', type: 'system' as const },
  { id: 'act_6', text: 'Driver Mark Reyes withdrew ₱1,500.00 via GCash Instant Payout', time: '1 hour ago', type: 'driver' as const }
];

export const POPULAR_LOCATIONS = [
  { name: 'Bagong Silang, Caloocan City', lat: 14.7735, lng: 121.0428, area: 'Caloocan' },
  { name: 'SM North EDSA, Quezon City', lat: 14.6565, lng: 121.0289, area: 'Quezon City' },
  { name: 'SM City Fairview, Quezon City', lat: 14.7336, lng: 121.0583, area: 'Quezon City' },
  { name: 'UP Diliman, Quezon City', lat: 14.6537, lng: 121.0685, area: 'Quezon City' },
  { name: 'Robinsons Magnolia, Quezon City', lat: 14.6186, lng: 121.0336, area: 'Quezon City' },
  { name: 'Caloocan City Hall, Caloocan City', lat: 14.6472, lng: 120.9765, area: 'Caloocan' },
  { name: 'University of Caloocan City (Camarin)', lat: 14.7562, lng: 121.0345, area: 'Caloocan' },
  { name: 'Novaliches Bayan, Quezon City', lat: 14.7177, lng: 121.0366, area: 'Quezon City' },
  { name: 'Cubao Araneta City, Quezon City', lat: 14.6200, lng: 121.0533, area: 'Quezon City' },
  { name: 'Trinoma Mall, Quezon City', lat: 14.6533, lng: 121.0333, area: 'Quezon City' },
  { name: 'Bonifacio Global City (BGC), Taguig', lat: 14.5547, lng: 121.0494, area: 'Taguig' },
  { name: 'Ayala Center Makati, Makati City', lat: 14.5518, lng: 121.0255, area: 'Makati' }
];

export const FAQS = [
  {
    q: 'How do I book a ride with SwiftRide?',
    a: 'Simply enter your pickup location and destination in the SwiftRide Passenger App, choose your preferred vehicle type (Sedan, SUV, Van, or Motorcycle), select your payment option, and tap "Confirm Booking". Our system will pair you with the nearest top-rated driver in seconds.'
  },
  {
    q: 'How do I cancel my booking?',
    a: 'You can cancel anytime before the driver arrives by tapping the "Cancel Ride" button on the live tracking screen. If cancelled within 3 minutes of driver acceptance, no cancellation fee applies.'
  },
  {
    q: 'How do I pay for my ride?',
    a: 'SwiftRide supports flexible cashless and cash options: GCash, Visa/Mastercard credit or debit cards, SwiftRide In-App Wallet, and direct Cash to driver upon arrival.'
  },
  {
    q: 'How can I contact my driver?',
    a: 'Once a driver accepts your trip, you can use our built-in real-time Chat Feature to send instant messages or tap the Call Driver button for direct voice contact without sharing private phone numbers.'
  },
  {
    q: 'How do I report a problem or an issue?',
    a: 'Go to the Help Center in your Profile or tap the 24/7 Live Support button. Our customer care team responds promptly to lost items, fare disputes, and safety inquiries.'
  },
  {
    q: 'How do I become a SwiftRide driver or partner rider?',
    a: 'Sign up through the Driver App by submitting your driver license, vehicle OR/CR, and NBI clearance. Once verified by our admin team (usually within 24 hours), you can go online and start earning immediately!'
  }
];

export const TESTIMONIALS = [
  {
    quote: "I feel safe every time I ride with SwiftRide. Drivers are professional and the app is very easy to use!",
    author: "Anne D.",
    location: "Caloocan City",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
  },
  {
    quote: "SwiftRide's motorcycle option gets me through EDSA and Commonwealth rush hour in half the time at affordable rates!",
    author: "Carlos P.",
    location: "Quezon City",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
  },
  {
    quote: "As a driver partner, the daily instant earnings payout and clear navigation HUD help me maximize my daily income.",
    author: "Juan Dela Cruz",
    location: "Driver Partner",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  }
];
