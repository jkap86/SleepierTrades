import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingIcon from './modules/COMMON/components/LoadingIcon';

const Home = lazy(() => import('./modules/Home'));
const Layout = lazy(() => import('./modules/COMMON/components/Layout'));
const Leagues = lazy(() => import('./modules/Leagues'));
const Players = lazy(() => import('./modules/Players'));
const Trades = lazy(() => import('./modules/Trades'));
const Lineups = lazy(() => import('./modules/Lineups'));
const Leaguemates = lazy(() => import('./modules/Leaguemates'));
const PickTracker = lazy(() => import('./modules/Picktracker'));
const Pool = lazy(() => import('./modules/Pool'));

function App() {
  return (
    <div className="App">
      <BrowserRouter basename='/lineups'>
        <Suspense fallback={<LoadingIcon />}>
          <Routes>
            <Route path='/:username' element={<Layout display={<Trades />} />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
