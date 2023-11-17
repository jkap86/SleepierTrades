import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingIcon from './modules/COMMON/components/LoadingIcon';

const Home = lazy(() => import('./modules/Home'));
const Layout = lazy(() => import('./modules/COMMON/components/Layout'));
const Leagues = lazy(() => import('./modules/Leagues'));
const Players = lazy(() => import('./modules/Players'));
const Trades = lazy(() => import('./modules/Trades'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<LoadingIcon />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:username/leagues" element={<Layout display={<Leagues />} />} />
            <Route path="/:username/players" element={<Layout display={<Players />} />} />
            <Route path="/:username/trades" element={<Layout display={<Trades />} />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
