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
      </Routes>
    </BrowserRouter>
  );
};

export default App;