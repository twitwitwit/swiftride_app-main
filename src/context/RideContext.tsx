import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ActivePlatformView, 
  AdminActivity,
  ChatMessage, 
  DriverApplication, 
  DriverUser, 
  EmergencyRequest,
  LocationPoint, 
  PassengerUser, 
  PlatformStat, 
  RideRequest, 
  RideStatus, 
  SupportTicket, 
  VehicleCategory 
} from '../types';
import { 
  INITIAL_ACTIVITIES,
  INITIAL_CHAT_MESSAGES, 
  INITIAL_DRIVER, 
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_PASSENGER, 
  INITIAL_PAST_RIDES, 
  INITIAL_PENDING_APPLICATIONS, 
  INITIAL_PLATFORM_STATS, 
  INITIAL_SUPPORT_TICKETS 
} from '../data/mockData';
import { apiFetch, getWebSocketUrl } from '../lib/api';

interface RideContextType {
  platformView: ActivePlatformView;
  setPlatformView: (view: ActivePlatformView) => void;
  currentView: ActivePlatformView;
  setCurrentView: (view: ActivePlatformView) => void;
  
  // Users
  passenger: PassengerUser;
  driver: DriverUser;
  updatePassenger: (data: Partial<PassengerUser>) => void;
  updatePassengerStatus: (id: string, status: string) => Promise<void>;
  updateDriver: (data: Partial<DriverUser>) => void;
  
  // Rides
  activeRide: RideRequest | null;
  rideHistory: RideRequest[];
  incomingDriverRide: RideRequest | null; // For the driver to see incoming pop-up
  driverIncomingCountdown: number; // 30s countdown
  
  // Actions
  requestRide: (params: {
    pickup: LocationPoint;
    dropoff: LocationPoint;
    vehicleType: VehicleCategory;
    fare: number;
    originalFare: number;
    discount: number;
    promoCode?: string;
    distanceKm: number;
    durationMins: number;
    paymentMethod: 'Cash' | 'GCash' | 'Visa' | 'Mastercard' | 'Wallet';
  }) => string;
  
  driverAcceptRide: (rideId: string) => void;
  driverDeclineRide: (rideId: string) => void;
  driverArriveAtPickup: (rideId: string) => void;
  startRideTrip: (rideId: string) => void;
  completeRideTrip: (rideId: string) => void;
  cancelActiveRide: (rideId: string, reason: string) => void;
  
  // Chat
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (rideId: string, senderRole: 'passenger' | 'driver', text: string) => void;
  
  // Wallet
  topUpWallet: (amount: number, method: string) => void;
  withdrawEarnings: (amount: number, method: string) => void;
  toggleDriverOnline: () => void;
  
  // Admin & Applications
  pendingApplications: DriverApplication[];
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string) => void;
  approveDriverApplication: (appId: string) => void;
  rejectDriverApplication: (appId: string) => void;
  activities: AdminActivity[];
  addActivity: (text: string, type?: 'trip' | 'driver' | 'user' | 'system') => void;
  
  // Support
  supportTickets: SupportTicket[];
  createSupportTicket: (subject: string, category: any, message: string, role: 'passenger' | 'driver') => void;
  replySupportTicket: (ticketId: string, replyText: string) => void;
  resolveSupportTicket: (ticketId: string) => void;

  // Emergency Requests & SOS Alerts
  emergencyRequests: EmergencyRequest[];
  triggerEmergencyRequest: (params?: {
    userId?: string;
    userName?: string;
    userRole?: 'passenger' | 'driver';
    userPhone?: string;
    userAvatar?: string;
    rideId?: string;
    location?: LocationPoint;
    emergencyType?: 'Safety SOS' | 'Accident' | 'Medical' | 'Harassment' | 'Vehicle Breakdown' | 'Panic Button';
    notes?: string;
  }) => string;
  resolveEmergencyRequest: (id: string, notes?: string) => void;
  updateEmergencyStatus: (id: string, status: 'active' | 'responding' | 'resolved' | 'dismissed', responder?: string) => void;
  
  // Platform Stats
  platformStats: PlatformStat;
  
  // Notifications & Sound trigger state
  notification: { title: string; message: string; type: 'info' | 'success' | 'warning' } | null;
  clearNotification: () => void;
  closeNotification: () => void;
  showNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  resetAllDemoData: () => void;
  savePlatformSettings: (settings: Record<string, unknown>) => Promise<void>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformView, setPlatformView] = useState<ActivePlatformView>('passenger');
  
  const [passenger, setPassenger] = useState<PassengerUser>(() => {
    const saved = localStorage.getItem('swiftride_passenger');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PASSENGER,
          ...parsed,
          savedPlaces: Array.isArray(parsed?.savedPlaces) && parsed.savedPlaces.length > 0 
            ? parsed.savedPlaces 
            : INITIAL_PASSENGER.savedPlaces
        };
      } catch {
        return INITIAL_PASSENGER;
      }
    }
    return INITIAL_PASSENGER;
  });
  
  const [driver, setDriver] = useState<DriverUser>(() => {
    const saved = localStorage.getItem('swiftride_driver');
    return saved ? JSON.parse(saved) : INITIAL_DRIVER;
  });
  
  const [rideHistory, setRideHistory] = useState<RideRequest[]>(() => {
    const saved = localStorage.getItem('swiftride_history');
    return saved ? JSON.parse(saved) : INITIAL_PAST_RIDES;
  });
  
  const [activeRide, setActiveRide] = useState<RideRequest | null>(() => {
    const saved = localStorage.getItem('swiftride_active_ride');
    return saved ? JSON.parse(saved) : null;
  });

  const [incomingDriverRide, setIncomingDriverRide] = useState<RideRequest | null>(null);
  const [driverIncomingCountdown, setDriverIncomingCountdown] = useState<number>(30);

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('swiftride_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [pendingApplications, setPendingApplications] = useState<DriverApplication[]>(() => {
    const saved = localStorage.getItem('swiftride_apps');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_APPLICATIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('swiftride_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem('swiftride_emergencies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EMERGENCY_REQUESTS;
      }
    }
    return INITIAL_EMERGENCY_REQUESTS;
  });

  const [activities, setActivities] = useState<AdminActivity[]>(() => {
    const saved = localStorage.getItem('swiftride_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACTIVITIES;
      }
    }
    return INITIAL_ACTIVITIES;
  });

  const [platformStats, setPlatformStats] = useState<PlatformStat>(INITIAL_PLATFORM_STATS);

  const [notification, setNotification] = useState<{ title: string; message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('swiftride_passenger', JSON.stringify(passenger));
  }, [passenger]);

  useEffect(() => {
    localStorage.setItem('swiftride_emergencies', JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  // Real-time Express & WebSocket API Backend Syncing
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statsRes, appsRes, ticketsRes, emergenciesRes] = await Promise.allSettled([
          apiFetch('/stats'),
          apiFetch('/drivers/pending'),
          apiFetch('/tickets'),
          apiFetch('/emergencies')
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const stats = await statsRes.value.json();
          setPlatformStats(prev => ({ ...prev, ...stats }));
        }

        if (appsRes.status === 'fulfilled' && appsRes.value.ok) {
          const apps = await appsRes.value.json();
          if (Array.isArray(apps) && apps.length > 0) {
            setPendingApplications(apps);
          }
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
          const tickets = await ticketsRes.value.json();
          if (Array.isArray(tickets) && tickets.length > 0) {
            setSupportTickets(tickets);
          }
        }

        if (emergenciesRes.status === 'fulfilled' && emergenciesRes.value.ok) {
          const emergencies = await emergenciesRes.value.json();
          if (Array.isArray(emergencies) && emergencies.length > 0) {
            setEmergencyRequests(emergencies);
          }
        }
      } catch (e) {
        console.log('Central Backend Server using local fallback');
      }
    };

    fetchInitialData();

    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(getWebSocketUrl());
      socket.onopen = () => console.log('⚡ Connected to Central SwiftRide WebSocket Gateway');
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'driver_application_submitted') {
            setPendingApplications(prev => [data.payload, ...prev]);
            setNotification({
              title: 'New Driver Onboarding Application',
              message: `${data.payload.driverName} (${data.payload.vehicleType}) submitted credentials.`,
              type: 'info'
            });
          } else if (data.type === 'driver_application_updated') {
            setPendingApplications(prev => prev.filter(a => a.id !== data.payload.id));
          } else if (data.type === 'ride_requested') {
            setNotification({
              title: 'New Dispatch Request',
              message: `Ride order #${data.payload.id} requested by ${data.payload.passengerName}`,
              type: 'info'
            });
          } else if (data.type === 'support_ticket_created') {
            setSupportTickets(prev => [data.payload, ...prev]);
            setNotification({
              title: 'New Support Ticket Created',
              message: `${data.payload.userName}: ${data.payload.subject}`,
              type: 'info'
            });
          } else if (data.type === 'emergency_triggered') {
            setEmergencyRequests(prev => [data.payload, ...prev.filter(e => e.id !== data.payload.id)]);
            setNotification({
              title: '🚨 CRITICAL EMERGENCY SOS ALERT',
              message: `${data.payload.userName} triggered ${data.payload.emergencyType} at ${data.payload.location.name}!`,
              type: 'warning'
            });
          } else if (data.type === 'emergency_updated') {
            setEmergencyRequests(prev => prev.map(e => e.id === data.payload.id ? { ...e, ...data.payload } : e));
          }
        } catch (err) {
          // ignore
        }
      };
    } catch (e) {
      // WebSocket fallback
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('swiftride_driver', JSON.stringify(driver));
  }, [driver]);

  useEffect(() => {
    localStorage.setItem('swiftride_history', JSON.stringify(rideHistory));
  }, [rideHistory]);

  useEffect(() => {
    localStorage.setItem('swiftride_active_ride', JSON.stringify(activeRide));
  }, [activeRide]);

  useEffect(() => {
    localStorage.setItem('swiftride_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('swiftride_apps', JSON.stringify(pendingApplications));
  }, [pendingApplications]);

  useEffect(() => {
    localStorage.setItem('swiftride_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('swiftride_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (text: string, type: 'trip' | 'driver' | 'user' | 'system' = 'trip') => {
    const newAct: AdminActivity = {
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      text,
      time: 'Just now',
      type
    };
    setActivities(prev => [newAct, ...(prev || []).slice(0, 19)]);
  };

  const showNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ title, message, type });
    setTimeout(() => {
      setNotification(prev => prev?.title === title ? null : prev);
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  const updatePassenger = (data: Partial<PassengerUser>) => {
    setPassenger(prev => ({ ...prev, ...data }));
  };

  const updateDriver = (data: Partial<DriverUser>) => {
    setDriver(prev => ({ ...prev, ...data }));
  };

  // Passenger requests a ride
  const requestRide = (params: {
    pickup: LocationPoint;
    dropoff: LocationPoint;
    vehicleType: VehicleCategory;
    fare: number;
    originalFare: number;
    discount: number;
    promoCode?: string;
    distanceKm: number;
    durationMins: number;
    paymentMethod: 'Cash' | 'GCash' | 'Visa' | 'Mastercard' | 'Wallet';
  }): string => {
    const tripId = `TRIP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRide: RideRequest = {
      id: tripId,
      passengerId: passenger.id,
      passengerName: passenger.name,
      passengerPhone: passenger.phone,
      passengerRating: passenger.rating,
      passengerAvatar: passenger.avatar,
      pickup: params.pickup,
      dropoff: params.dropoff,
      vehicleType: params.vehicleType,
      fare: params.fare,
      originalFare: params.originalFare,
      discount: params.discount,
      promoCode: params.promoCode,
      distanceKm: params.distanceKm,
      durationMins: params.durationMins,
      status: 'requested',
      paymentMethod: params.paymentMethod,
      createdAt: 'Just now',
      etaMins: 4,
      routeProgress: 0
    };

    setActiveRide(newRide);
    setIncomingDriverRide(newRide);
    setDriverIncomingCountdown(30);

    showNotification('Ride Request Sent', `Searching for nearest ${params.vehicleType} driver...`, 'info');

    // Also initialize chat
    setChatMessages(prev => ({
      ...prev,
      [tripId]: [
        {
          id: `msg_${Date.now()}`,
          rideId: tripId,
          senderId: 'system',
          senderRole: 'passenger',
          senderName: 'SwiftRide System',
          text: `Ride requested for ${params.pickup.name} to ${params.dropoff.name}. Connecting with nearby drivers...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]
    }));

    return tripId;
  };

  // Driver incoming countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (incomingDriverRide && driverIncomingCountdown > 0) {
      timer = setInterval(() => {
        setDriverIncomingCountdown(prev => {
          if (prev <= 1) {
            // Auto decline if timed out
            setIncomingDriverRide(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingDriverRide, driverIncomingCountdown]);

  // Driver Accepts Ride
  const driverAcceptRide = (rideId: string) => {
    if (!activeRide || activeRide.id !== rideId) {
      // Find or build from incoming
      if (incomingDriverRide && incomingDriverRide.id === rideId) {
        const acceptedRide: RideRequest = {
          ...incomingDriverRide,
          status: 'accepted',
          driverId: driver.id,
          driverName: driver.name,
          driverPhone: driver.phone,
          driverRating: driver.rating,
          driverVehicle: driver.vehicle.model,
          driverPlate: driver.vehicle.plateNumber,
          driverAvatar: driver.avatar,
          etaMins: 4,
          routeProgress: 10
        };
        setActiveRide(acceptedRide);
        setIncomingDriverRide(null);
      }
    } else {
      const updated: RideRequest = {
        ...activeRide,
        status: 'accepted',
        driverId: driver.id,
        driverName: driver.name,
        driverPhone: driver.phone,
        driverRating: driver.rating,
        driverVehicle: driver.vehicle.model,
        driverPlate: driver.vehicle.plateNumber,
        driverAvatar: driver.avatar,
        etaMins: 4,
        routeProgress: 10
      };
      setActiveRide(updated);
      setIncomingDriverRide(null);
    }

    // Add greeting message
    const msgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sendChatMessage(rideId, 'driver', `Hello ${passenger.name.split(' ')[0]}! I've accepted your ride. On my way to pickup.`);
    showNotification('Ride Accepted', `${driver.name} is heading to pickup location!`, 'success');
  };

  const driverDeclineRide = (_rideId: string) => {
    setIncomingDriverRide(null);
    showNotification('Ride Request Declined', 'Ready for next incoming booking.', 'warning');
  };

  const driverArriveAtPickup = (rideId: string) => {
    if (activeRide && activeRide.id === rideId) {
      setActiveRide(prev => prev ? { ...prev, status: 'arriving', etaMins: 0, routeProgress: 35 } : null);
      sendChatMessage(rideId, 'driver', "I have arrived at your pickup location! Please look for my vehicle.");
      showNotification('Driver Arrived', `${driver.name} has arrived at pickup point!`, 'info');
    }
  };

  const startRideTrip = (rideId: string) => {
    if (activeRide && activeRide.id === rideId) {
      setActiveRide(prev => prev ? { ...prev, status: 'in_progress', routeProgress: 50 } : null);
      showNotification('Trip Started', 'Heading to destination with passenger.', 'info');
    }
  };

  const completeRideTrip = (rideId: string) => {
    if (activeRide && activeRide.id === rideId) {
      const completedRide: RideRequest = {
        ...activeRide,
        status: 'completed',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routeProgress: 100
      };

      // Update state
      setRideHistory(prev => [completedRide, ...prev]);
      setActiveRide(null);
      setIncomingDriverRide(null);

      // Update Driver stats & wallet
      const driverIncome = completedRide.fare * 0.85; // 85% payout (15% platform fee)
      setDriver(prev => ({
        ...prev,
        todayEarnings: prev.todayEarnings + driverIncome,
        walletBalance: prev.walletBalance + driverIncome,
        totalTrips: prev.totalTrips + 1
      }));

      // Update Passenger stats & wallet if paid with wallet
      setPassenger(prev => ({
        ...prev,
        completedRides: prev.completedRides + 1,
        walletBalance: completedRide.paymentMethod === 'Wallet' 
          ? Math.max(0, prev.walletBalance - completedRide.fare) 
          : prev.walletBalance
      }));

      // Update Admin stats
      setPlatformStats(prev => ({
        ...prev,
        tripsToday: prev.tripsToday + 1,
        revenueToday: prev.revenueToday + completedRide.fare
      }));

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      showNotification('Trip Completed!', `Earned ₱${driverIncome.toFixed(2)}. Safe travels!`, 'success');
    }
  };

  const cancelActiveRide = (rideId: string, reason: string) => {
    if (activeRide && activeRide.id === rideId) {
      const cancelledRide: RideRequest = {
        ...activeRide,
        status: 'cancelled',
        cancellationReason: reason,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setRideHistory(prev => [cancelledRide, ...prev]);
      setActiveRide(null);
      setIncomingDriverRide(null);
      showNotification('Ride Cancelled', reason, 'warning');
    }
  };

  const sendChatMessage = (rideId: string, senderRole: 'passenger' | 'driver', text: string) => {
    if (!text.trim()) return;
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      rideId,
      senderId: senderRole === 'passenger' ? passenger.id : driver.id,
      senderRole,
      senderName: senderRole === 'passenger' ? passenger.name : driver.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [rideId]: [...(prev[rideId] || []), newMessage]
    }));
  };

  const topUpWallet = (amount: number, method: string) => {
    setPassenger(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
    showNotification('Wallet Top-Up Successful', `₱${amount.toFixed(2)} added via ${method}.`, 'success');
  };

  const withdrawEarnings = (amount: number, method: string) => {
    if (driver.walletBalance < amount) {
      showNotification('Insufficient Balance', 'Withdrawal amount exceeds your current wallet balance.', 'warning');
      return;
    }
    setDriver(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount
    }));
    showNotification('Withdrawal Processed', `₱${amount.toFixed(2)} transferred to ${method}.`, 'success');
  };

  const toggleDriverOnline = () => {
    setDriver(prev => {
      const nextStatus = prev.status === 'online' ? 'offline' : 'online';
      showNotification(
        nextStatus === 'online' ? 'You are Online' : 'You are Offline',
        nextStatus === 'online' ? 'Ready to receive ride bookings.' : 'Booking requests paused.',
        nextStatus === 'online' ? 'success' : 'info'
      );
      return { ...prev, status: nextStatus };
    });
  };

  const approveApplication = (appId: string) => {
    apiFetch(`/drivers/applications/${appId}/approve`, { method: 'POST' }).then(response => {
      if (!response.ok) throw new Error('The server rejected this approval');
    }).catch(error => showNotification('Approval failed', error instanceof Error ? error.message : 'Please try again.', 'warning'));
    setPendingApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
    setPlatformStats(prev => ({
      ...prev,
      pendingDrivers: Math.max(0, prev.pendingDrivers - 1),
      activeDrivers: prev.activeDrivers + 1
    }));
    showNotification('Application Approved', `Driver #${appId} is now verified and active.`, 'success');
  };

  const rejectApplication = (appId: string) => {
    apiFetch(`/drivers/applications/${appId}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'Rejected by admin review' }) }).then(response => {
      if (!response.ok) throw new Error('The server rejected this decision');
    }).catch(error => showNotification('Rejection failed', error instanceof Error ? error.message : 'Please try again.', 'warning'));
    setPendingApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
    setPlatformStats(prev => ({
      ...prev,
      pendingDrivers: Math.max(0, prev.pendingDrivers - 1)
    }));
    showNotification('Application Rejected', `Driver #${appId} application marked as rejected.`, 'warning');
  };

  const createSupportTicket = (subject: string, category: any, message: string, role: 'passenger' | 'driver') => {
    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(300 + Math.random() * 600)}`,
      userId: role === 'passenger' ? passenger.id : driver.id,
      userName: role === 'passenger' ? passenger.name : driver.name,
      userRole: role,
      subject,
      category,
      status: 'open',
      priority: 'medium',
      createdAt: 'Just now',
      messages: [
        {
          sender: role === 'passenger' ? passenger.name : driver.name,
          text: message,
          timestamp: 'Just now'
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    setPlatformStats(prev => ({ ...prev, supportTickets: prev.supportTickets + 1 }));
    showNotification('Ticket Submitted', 'Our customer support team will review your inquiry.', 'success');
  };

  const replySupportTicket = (ticketId: string, replyText: string) => {
    if (!replyText.trim()) return;
    setSupportTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'in_progress',
          messages: [
            ...ticket.messages,
            {
              sender: 'SwiftRide Support Admin',
              text: replyText.trim(),
              timestamp: 'Just now'
            }
          ]
        };
      }
      return ticket;
    }));
    showNotification('Reply Sent', `Response posted to ticket #${ticketId}`, 'info');
  };

  const resolveSupportTicket = (ticketId: string) => {
    apiFetch(`/tickets/${ticketId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' }) }).then(response => {
      if (!response.ok) throw new Error('The server rejected this ticket update');
    }).catch(error => showNotification('Ticket update failed', error instanceof Error ? error.message : 'Please try again.', 'warning'));
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' } : t));
    setPlatformStats(prev => ({ ...prev, supportTickets: Math.max(0, prev.supportTickets - 1) }));
    showNotification('Ticket Resolved', `Ticket #${ticketId} closed successfully.`, 'success');
  };

  const updatePassengerStatus = async (id: string, status: string) => {
    const response = await apiFetch(`/passengers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('The server rejected the passenger status update');
  };

  const savePlatformSettings = async (settings: Record<string, unknown>) => {
    const response = await apiFetch('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('The server rejected the platform settings');
  };

  const triggerEmergencyRequest = (params?: {
    userId?: string;
    userName?: string;
    userRole?: 'passenger' | 'driver';
    userPhone?: string;
    userAvatar?: string;
    rideId?: string;
    location?: LocationPoint;
    emergencyType?: 'Safety SOS' | 'Accident' | 'Medical' | 'Harassment' | 'Vehicle Breakdown' | 'Panic Button';
    notes?: string;
  }): string => {
    const sosId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const isDriver = params?.userRole === 'driver';
    
    const newEmergency: EmergencyRequest = {
      id: sosId,
      userId: params?.userId || (isDriver ? driver.id : passenger.id),
      userName: params?.userName || (isDriver ? driver.name : passenger.name),
      userRole: params?.userRole || 'passenger',
      userPhone: params?.userPhone || (isDriver ? driver.phone : passenger.phone),
      userAvatar: params?.userAvatar || (isDriver ? driver.avatar : passenger.avatar),
      rideId: params?.rideId || activeRide?.id || 'TRIP-8850',
      location: params?.location || activeRide?.pickup || {
        name: 'SM North EDSA, Quezon City',
        address: 'EDSA cor. North Ave, Quezon City, Metro Manila',
        lat: 14.6565,
        lng: 121.0289
      },
      emergencyType: params?.emergencyType || 'Safety SOS',
      status: 'active',
      createdAt: 'Just now',
      notes: params?.notes || 'User triggered urgent emergency SOS alert from active session.',
      driverName: activeRide?.driverName || driver.name,
      driverPhone: activeRide?.driverPhone || driver.phone,
      vehicleInfo: isDriver ? `${driver.vehicle.model} • ${driver.vehicle.plateNumber}` : (activeRide?.driverVehicle ? `${activeRide.driverVehicle} • ${activeRide.driverPlate}` : 'Toyota Vios (Sedan) • NDA 1234')
    };

    setEmergencyRequests(prev => [newEmergency, ...prev]);
    addActivity(`EMERGENCY SOS DISPATCH: ${newEmergency.userName} (${newEmergency.emergencyType})`, 'user');
    showNotification('Emergency SOS Activated', `Emergency alert broadcasted to 24/7 Command Center for ${newEmergency.userName}.`, 'warning');

    try {
      apiFetch('/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmergency)
      }).then(response => { if (!response.ok) throw new Error('Emergency was not accepted by the server'); }).catch(error => {
        showNotification('Emergency sync failed', error instanceof Error ? error.message : 'Please retry the SOS action.', 'warning');
      });
    } catch {
      // ignore
    }

    return sosId;
  };

  const resolveEmergencyRequest = (id: string, notes?: string) => {
    setEmergencyRequests(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'resolved',
          notes: notes ? `${e.notes || ''} [Resolved: ${notes}]` : e.notes
        };
      }
      return e;
    }));
    addActivity(`✅ Emergency Alert ${id} resolved by Admin`, 'system');
    showNotification('Emergency Alert Resolved', `SOS #${id} has been marked as resolved.`, 'success');

    try {
      apiFetch(`/emergencies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved', notes })
      }).then(response => { if (!response.ok) throw new Error('Emergency update failed'); }).catch(error => {
        showNotification('Emergency update failed', error instanceof Error ? error.message : 'The server could not be updated.', 'warning');
      });
    } catch {
      // ignore
    }
  };

  const updateEmergencyStatus = (id: string, status: 'active' | 'responding' | 'resolved' | 'dismissed', responder?: string) => {
    setEmergencyRequests(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status,
          assignedResponder: responder || e.assignedResponder
        };
      }
      return e;
    }));

    try {
      apiFetch(`/emergencies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assignedResponder: responder })
      }).then(response => { if (!response.ok) throw new Error('Emergency update failed'); }).catch(error => {
        showNotification('Emergency update failed', error instanceof Error ? error.message : 'The server could not be updated.', 'warning');
      });
    } catch {
      // ignore
    }
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setPassenger(INITIAL_PASSENGER);
    setDriver(INITIAL_DRIVER);
    setRideHistory(INITIAL_PAST_RIDES);
    setActiveRide(null);
    setIncomingDriverRide(null);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setPendingApplications(INITIAL_PENDING_APPLICATIONS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setEmergencyRequests(INITIAL_EMERGENCY_REQUESTS);
    setPlatformStats(INITIAL_PLATFORM_STATS);
    showNotification('Demo Data Reset', 'Initial state restored to presentation baseline.', 'info');
  };

  return (
    <RideContext.Provider
      value={{
        platformView,
        setPlatformView,
        currentView: platformView,
        setCurrentView: setPlatformView,
        passenger,
        driver,
        updatePassenger,
        updatePassengerStatus,
        updateDriver,
        activeRide,
        rideHistory,
        incomingDriverRide,
        driverIncomingCountdown,
        requestRide,
        driverAcceptRide,
        driverDeclineRide,
        driverArriveAtPickup,
        startRideTrip,
        completeRideTrip,
        cancelActiveRide,
        chatMessages,
        sendChatMessage,
        topUpWallet,
        withdrawEarnings,
        toggleDriverOnline,
        pendingApplications,
        approveApplication,
        rejectApplication,
        approveDriverApplication: approveApplication,
        rejectDriverApplication: rejectApplication,
        activities,
        addActivity,
        supportTickets,
        createSupportTicket,
        replySupportTicket,
        resolveSupportTicket,
        emergencyRequests,
        triggerEmergencyRequest,
        resolveEmergencyRequest,
        updateEmergencyStatus,
        platformStats,
        notification,
        clearNotification,
        closeNotification: clearNotification,
        showNotification,
        resetAllDemoData,
        savePlatformSettings
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};
