import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import UserLayout from './components/Layout/UserLayout';
import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import ScrollToTop from './components/Common/ScrollToTop';
import Playground from './components/Pages/Playground';
import Contests from './components/Pages/contests';
import Problems from './components/Pages/Problems';
import Ranking from './components/Pages/Ranking';
import AdminPage from './components/Pages/AdminPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" theme="dark" />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/playground" element={<Playground />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/problems" element={<Problems />} />
        <Route path='/leaderboard' element={<Ranking />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;