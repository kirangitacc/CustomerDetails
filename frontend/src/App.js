import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import Register from './components/Register';
import CustomerList from './components/CustomerList';
import CustomerDetails from './components/CustomerDetails';
import CustomerForm from './components/CustomerForm';
import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/customers" element={
        <ProtectedRoute>
          <CustomerList />
        </ProtectedRoute>
      } />

      <Route path="/customers/new" element={
        <ProtectedRoute>
          <CustomerForm />
        </ProtectedRoute>
      } />

      <Route path="/customers/:id" element={
        <ProtectedRoute>
          <CustomerDetails />
        </ProtectedRoute>
      } />

      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
};

export default App;

