import { fetchLmTrades } from "../../redux/actions";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const useFetchLmTrades = () => {
    const dispatch = useDispatch();
    const { state } = useSelector(state => state.common);
    const { user_id, leagues, type1, type2 } = useSelector(state => state.user);
    const { trade_date, lmTrades, isLoading } = useSelector(state => state.trades);

    const hash = `${type1}-${type2}`;

    useEffect(() => {
        if (
            leagues
            && !isLoading
            && !lmTrades.searched_player.id
            && !lmTrades.searched_manager.id
            && !(lmTrades.trades[hash]?.trade_date === trade_date)
        ) {
            dispatch(fetchLmTrades(user_id, leagues, state.league_season, 0, 125, hash, trade_date))
        }
    }, [
        user_id,
        leagues,
        state.league_season,
        hash,
        trade_date,
        lmTrades.searched_player.id,
        lmTrades.searched_manager.id,
        lmTrades.trades.trade_date,
        dispatch
    ])

}

export default useFetchLmTrades;