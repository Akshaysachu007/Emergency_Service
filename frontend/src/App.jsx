import { BrowserRouter , Routes , Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import CustomerRegistration from './pages/auth/CustomerRegister';
import ProviderRegistration from './pages/auth/ProviderRegister';
import ProviderDashboard from './pages/provider/ProviderDashboard';

import CustomerServices from './pages/dashboard/CustomerServices';
import AcceptedRequests from './pages/provider/AcceptedRequests';
import CompletedRequests from './pages/provider/CompletedRequests';
import CustomerCompletedRequests from './pages/CustomerCompletedRequests';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import CustomerRequests from './pages/customer/CustomerRequests';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerProviderList from './pages/customer/CustomerProviderList';
import ProviderRequests from './pages/provider/ProviderRequests';
import ProviderAnalytics from './pages/provider/ProviderAnalytics';
import ProviderProfile from './pages/provider/ProviderProfile';
import Notifications from './pages/Notifications';



function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/customer/register" element={ <CustomerRegistration /> } />
        <Route path="/provider/register" element={ <ProviderRegistration /> } />
        <Route path="/provider/dashboard" element={ <ProviderDashboard /> } />
        <Route path="/provider/profile" element={ <ProviderProfile /> } />
        <Route path="/customer/services" element={ <CustomerServices /> } />
        <Route path="/accepted-requests" element={ <AcceptedRequests /> } />
        <Route path="/completed-requests" element={ <CompletedRequests /> } />
        <Route path="/customer/completed-requests" element={ <CustomerCompletedRequests /> } />
        <Route path="/customer/dashboard" element = { <CustomerDashboard /> } />
        <Route path="/customer/requests" element = { <CustomerRequests /> } />
        <Route path="/customer/profile" element = { <CustomerProfile /> } />
        <Route path="/customer/provider-list" element = { <CustomerProviderList /> } />
        <Route path="/provider/requests" element = { <ProviderRequests /> } />
        <Route path="/provider/analytics" element = { <ProviderAnalytics /> } />
        <Route path="/provider/profile" element = { <ProviderProfile /> } />
        <Route path="/notifications" element = { <Notifications /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;