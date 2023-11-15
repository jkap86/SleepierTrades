import axios from 'axios';
import { getTradeTips } from '../services/helpers/getTradeTips';


export const setStateTrades = (state_obj, tab) => ({
    type: `SET_STATE_TRADES`,
    payload: state_obj
})

export const fetchLmTrades = (user_id, leagues, season, offset, limit, hash, trade_date, more = false) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_TRADES_START' });

        try {
            const trades = await axios.post('/trade/leaguemate', {
                user_id: user_id,
                offset: offset,
                limit: limit,
                type1: hash.split('-')[0],
                type2: hash.split('-')[1],
                trade_date: trade_date
            })




            const trades_tips = getTradeTips(trades.data.rows, leagues, season)

            console.log({ more })

            dispatch({
                type: 'FETCH_LMTRADES_SUCCESS', payload: {
                    count: trades.data.count,
                    trades: trades_tips,
                    hash: hash,
                    more: more,
                    trade_date: trade_date

                }
            });
        } catch (error) {
            dispatch({ type: 'FETCH_TRADES_FAILURE', payload: error.message })
        }
    }
}

export const fetchFilteredLmTrades = (searchedPlayerId, searchedManagerId, league_season, offset, limit, hash, trade_date) => async (dispatch, getState) => {
    dispatch({ type: 'FETCH_TRADES_START' });

    const state = getState();

    const { user } = state;

    try {
        const trades = await axios.post('/trade/leaguemate', {
            user_id: user.user_id,
            player: searchedPlayerId,
            manager: searchedManagerId,
            offset: offset,
            limit: limit,
            type1: hash.split('-')[0],
            type2: hash.split('-')[1],
            trade_date: trade_date
        });

        const trades_tips = getTradeTips(trades.data.rows, user.leagues, league_season)

        dispatch({
            type: 'FETCH_FILTERED_LMTRADES_SUCCESS',
            payload: {
                player: searchedPlayerId,
                manager: searchedManagerId,
                trades: trades_tips,
                count: trades.data.count,
                hash: hash,
                trade_date: trade_date
            },
        });
    } catch (error) {
        dispatch({ type: 'FETCH_TRADES_FAILURE', payload: error.message });
    }


};

export const fetchPriceCheckTrades = (pricecheck_player, pricecheck_player2, offset, limit) => async (dispatch, getState) => {
    dispatch({ type: 'FETCH_TRADES_START' });

    const state = getState();

    const { user, main } = state;

    try {
        const player_trades = await axios.post('/trade/pricecheck', {
            player: pricecheck_player,
            player2: pricecheck_player2,
            offset: offset,
            limit: limit
        })

        const trades_tips = getTradeTips(player_trades.data.rows, user.leagues, main.state.league_season)

        dispatch({
            type: 'FETCH_PRICECHECKTRADES_SUCCESS',
            payload: {
                pricecheck_player: pricecheck_player,
                pricecheck_player2: pricecheck_player2,
                trades: trades_tips,
                count: player_trades.data.count,
            },
        });
    } catch (error) {
        dispatch({ type: 'FETCH_TRADES_FAILURE', payload: error.message });
    }

};