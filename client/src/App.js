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
      <BrowserRouter>
        <Suspense fallback={<LoadingIcon />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:username/leagues" element={<Layout display={<Leagues />} />} />
            <Route path="/:username/players" element={<Layout display={<Players />} />} />
            <Route path="/:username/trades" element={<Layout display={<Trades />} />} />
            <Route path="/:username/lineups" element={<Layout display={<Lineups />} />} />
            <Route path='/:username/leaguemates' element={<Layout display={<Leaguemates />} />} />
            <Route path='/picktracker/:league_id' element={<PickTracker />} />
            <Route path='/pools/rof' element={<Pool pool={'rof'} title={'Ring of Fire'} startSeason={2021} />} />
            <Route path='/pools/osr' element={<Pool pool={'osr'} title={'Save the Sharks'} startSeason={2020} />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
