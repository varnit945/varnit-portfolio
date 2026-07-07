import React from 'react';
import { PresenterProvider } from './PresenterContext';
import PortfolioLayout from './PortfolioLayout';

function App() {
  return (
    <PresenterProvider>
      <PortfolioLayout />
    </PresenterProvider>
  );
}

export default App;
