import TableMain from "../../COMMON/components/TableMain";
import useFetchLmTrades from "../services/hooks/useFetchLmTrades";
import { useSelector, useDispatch } from "react-redux";
import Trade from "./Trade";
import { setStateTrades, fetchLmTrades, fetchFilteredLmTrades } from "../redux/actions";
import { useEffect, useMemo } from "react";
import useFetchPlayerValues from "../../COMMON/services/hooks/useFetchPlayerValues";


const LmTrades = ({
    trades_headers,
    players_list,
    tradeCount,
    secondaryTable
}) => {
    const dispatch = useDispatch();
    const { state, values } = useSelector(state => state.common);
    const { type1, type2, user_id, leagues } = useSelector(state => state.user);
    const { lmTrades, trade_date, isLoading } = useSelector(state => state.trades);

    useFetchLmTrades()
    console.log({ values })
    const hash = `${type1}-${type2}`

    const tradesDisplay = (!lmTrades.searched_player?.id && !lmTrades.searched_manager?.id)
        ? lmTrades.trades?.[hash]?.trades || []
        : (
            lmTrades.searches
                ?.find(
                    s => s.player === lmTrades.searched_player.id
                        && s.manager === lmTrades.searched_manager.id
                        && s.hash === hash
                        && s.trade_date === trade_date
                )?.trades
            || []
        )

    const player_ids = useMemo(() => {
        return tradesDisplay
            .sort((a, b) => parseInt(b.status_updated) - parseInt(a.status_updated))
            .slice((lmTrades.page - 1) * 25, ((lmTrades.page - 1) * 25) + 25)
            .flatMap(t => Object.keys(t.adds))

    }, [tradesDisplay, lmTrades.page])



    useFetchPlayerValues({ player_ids })






    const trades_body = tradesDisplay
        ?.sort((a, b) => parseInt(b.status_updated) - parseInt(a.status_updated))
        ?.map(trade => {
            return {
                id: trade.transaction_id,
                list: [

                    {
                        text: <Trade trade={trade} />,
                        colSpan: 10,
                        className: `small `
                    }

                ],
                secondary_table: ''
            }
        }) || []

    const loadMore = async () => {
        console.log('LOADING MORE')



        if (lmTrades.searched_player === '' && lmTrades.searched_manager === '') {
            dispatch(fetchLmTrades(user_id, leagues, state.league_season, tradesDisplay.length, 125, hash, trade_date, true))
        } else {
            dispatch(fetchFilteredLmTrades(lmTrades.searched_player.id, lmTrades.searched_manager.id, state.league_season, tradesDisplay.length, 125, hash, trade_date, true))
        }
    }

    console.log({ PAGE: lmTrades.page })

    return <>
        <div className="trade_search_wrapper">

        </div>
        <TableMain
            id={'trades'}
            type={'primary'}
            headers={trades_headers}
            body={trades_body}
            itemActive={lmTrades.itemActive}
            setItemActive={(item) => dispatch()}
            page={lmTrades.page}
            setPage={(page) => dispatch(setStateTrades({ lmTrades: { ...lmTrades, page: page } }))}
            partial={tradesDisplay?.length < tradeCount ? true : false}
            loadMore={loadMore}
            isLoading={isLoading}
        />

    </>
}

export default LmTrades;