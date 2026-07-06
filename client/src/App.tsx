import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Results from './pages/Histories';
import ProtectedRoute from './components/ProtectedRoute';
import Analyze from './pages/Analyze';
import Profile from './pages/Profile';

export default function App() {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/histories" replace/>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                    <Route path='/sign-in' element={<SignIn/>}/>
                    <Route path='/sign-up' element={<SignUp/>}/>
                    <Route path='/analyze' element={<ProtectedRoute><Analyze/></ProtectedRoute>}/>
                    <Route path='/histories' element={<ProtectedRoute><Results/></ProtectedRoute>}/>
                    <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}