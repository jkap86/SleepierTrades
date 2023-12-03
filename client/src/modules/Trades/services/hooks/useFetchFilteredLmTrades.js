import { useEffect } from "react";
import { fetchFilteredLmTrades } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";

const useFetchFilteredLmTrades = () => {
    const dispatch = useDispatch();
    const { state } = useSelector(state => state.common);
    const { lmTrades, trade_date, isLoading } = useSelector(state => state.trades);

    const hash = `${'All'}-${'All'}`

    useEffect(() => {
        if (
            (
                lmTrades.searched_player.id
                || lmTrades.searched_manager.id
            ) && !lmTrades.searches
                .find(
                    s => s.player === lmTrades.searched_player.id
                        && s.manager === lmTrades.searched_manager.id
                        && s.hash === hash
                        && s.trade_date === trade_date
                ) && !isLoading
        ) {
            console.log('fetching filtered lm trades')
            dispatch(fetchFilteredLmTrades(lmTrades.searched_player.id, lmTrades.searched_manager.id, state.league_season, 0, 125, hash, trade_date))
        }
    }, [lmTrades.searched_player, lmTrades.searched_manager, lmTrades.searches, hash, trade_date, dispatch])
}

export default useFetchFilteredLmTrades;