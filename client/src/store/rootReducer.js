import { combineReducers } from 'redux';
import homeReducer from '../modules/Home/redux/reducer';
import userReducer from '../modules/COMMON/redux/userReducer';
import commonReducer from '../modules/COMMON/redux/commonReducer';
import leaguesReducer from '../modules/Leagues/redux/leaguesReducer';
import playersReducer from '../modules/Players/redux/playersReducer';
import progressReducer from '../modules/COMMON/redux/progressReducer';
import tradesReducer from '../modules/Trades/redux/tradesReducer';
import lineupsReducer from '../modules/Lineups/redux/lineupsReducer';
import leaguematesReducer from '../modules/Leaguemates/redux/leaguematesReducer';



const rootReducer = combineReducers({
    home: homeReducer,
    progress: progressReducer,
    user: userReducer,
    common: commonReducer,
    leagues: leaguesReducer,
    players: playersReducer,
    trades: tradesReducer,
    lineups: lineupsReducer,
    leaguemates: leaguematesReducer
});

export default rootReducer;