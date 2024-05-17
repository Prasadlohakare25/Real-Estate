import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './Components/HomePage';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import About from './Components/About';
import Profile from './Components/Profile';
import Header from './Other-components/Header';
import PrivateRoute from './Other-components/PrivateRoute';
import CreateListing from './Components/CreateListing';
import UpdateListing from './Components/UpdateListing';
import Listing from './Components/Listing';
import SearchPage from './Components/SearchPage';
import Footer from './Other-components/Footer';
import '@fortawesome/fontawesome-free/css/all.css';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<SearchPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App