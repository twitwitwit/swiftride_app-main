import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminOverview } from './AdminOverview';
import { AdminPassengers } from './AdminPassengers';
import { AdminDrivers } from './AdminDrivers';
import { AdminBookings } from './AdminBookings';
import { AdminEarnings } from './AdminEarnings';
import { AdminSupport } from './AdminSupport';
import { AdminLiveMap } from './AdminLiveMap';
import { AdminReports } from './AdminReports';
import { AdminNotifications } from './AdminNotifications';
import { AdminSettings } from './AdminSettings';
import { AdminEmergency } from './AdminEmergency';
import { AdminAuth } from './AdminAuth';
import { useRide } from '../../context/RideContext';

export const AdminDashboard: React.FC = () => {
  const { pendingApplications, supportTickets, emergencyRequests } = useRide();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const pendingApplicationsCount = pendingApplications.filter(a => a.status === 'pending').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'open').length;
  const activeEmergencyCount = emergencyRequests.filter(e => e.status === 'active').length;

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  const getHeaderDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: "Welcome back, Admin! Here's what's happening with SwiftRide today." };
      case 'emergency':
        return { title: 'Emergency SOS Operations Desk', subtitle: 'Real-time user safety alerts, dispatch responders, and incident management' };
      case 'passengers':
        return { title: 'Passenger Management', subtitle: 'Audit and manage registered passenger accounts' };
      case 'drivers':
        return { title: 'Driver Partners Fleet', subtitle: 'Review verified fleet and pending onboarding applications' };
      case 'live_trips':
        return { title: 'Live Fleet Radar', subtitle: 'Real-time GPS telemetry and vehicle positioning' };
      case 'bookings':
        return { title: 'Bookings & Dispatch', subtitle: 'Ride orders log, fares, and route details' };
      case 'earnings':
        return { title: 'Revenue & Commission', subtitle: 'Financial settlement, gross volume, and payouts' };
      case 'reports':
        return { title: 'Analytics & Heatmaps', subtitle: 'Peak hours, route density, and growth reports' };
      case 'support':
        return { title: 'Support & Safety Desk', subtitle: 'Resolve user tickets, safety incidents, and driver inquiries' };
      case 'notifications':
        return { title: 'System Notifications', subtitle: 'Platform broadcasts, LTFRB regulatory notices, and server logs' };
      case 'settings':
        return { title: 'Platform Settings', subtitle: 'Base fares, surge multipliers, commissions, and API configurations' };
      default:
        return { title: 'Admin Console', subtitle: 'SwiftRide Central Operations' };
    }
  };

  const headerDetails = getHeaderDetails();

  return (
    <div className="flex h-full w-full bg-black text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingApplicationsCount={pendingApplicationsCount}
        openTicketsCount={openTicketsCount}
        activeEmergencyCount={activeEmergencyCount}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
        <AdminHeader
          title={headerDetails.title}
          subtitle={headerDetails.subtitle}
          onNavigateTab={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar bg-black p-4 sm:p-6">
          {activeTab === 'dashboard' && <AdminOverview onNavigateTab={setActiveTab} />}
          {activeTab === 'emergency' && <AdminEmergency />}
          {activeTab === 'passengers' && <AdminPassengers />}
          {activeTab === 'drivers' && <AdminDrivers />}
          {activeTab === 'live_trips' && <AdminLiveMap />}
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'earnings' && <AdminEarnings />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'support' && <AdminSupport />}
          {activeTab === 'notifications' && <AdminNotifications />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
