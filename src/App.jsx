import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SimulatorSection from './components/SimulatorSection';
import NewtonLawsSection from './components/NewtonLawsSection';
import FormulaSection from './components/FormulaSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <HeroSection />
        <AboutSection />
        <SimulatorSection />
        <NewtonLawsSection />
        <FormulaSection />
      </div>
      <Footer />
    </div>
  );
}

export default App;
