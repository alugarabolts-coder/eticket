import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { ShipDetail } from './pages/ShipDetail';
import { PassengerData } from './pages/PassengerData';
import { Payment } from './pages/Payment';
import { Ticket } from './pages/Ticket';
import { MyBookings } from './pages/MyBookings';
import { Help } from './pages/Help';
import Login from './pages/Login';
import { ExportData } from './pages/ExportData';
import Ports from './pages/master/Ports';
import Operators from './pages/master/Operators';
import Bookings from './pages/master/Bookings';
import Ships from './pages/master/Ships';
import Schedules from './pages/master/Schedules';

function App() {
  return ( 
    <BrowserRouter>
      <BookingProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 to-teal-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/ship-detail" element={<ShipDetail />} />
              <Route path="/passenger-data" element={<PassengerData />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ticket/:bookingCode" element={<Ticket />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/export" element={<ExportData />} />
              <Route path="/master/ports" element={<Ports />} />
              <Route path="/master/operators" element={<Operators />} />
              <Route path="/master/bookings" element={<Bookings />} />
              <Route path="/master/ships" element={<Ships />} />
              <Route path="/master/schedules" element={<Schedules />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;