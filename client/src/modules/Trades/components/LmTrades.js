import TableMain from "../../COMMON/components/TableMain";
import useFetchLmTrades from "../services/hooks/useFetchLmTrades";
import useFetchFilteredLmTrades from "../services/hooks/useFetchFilteredLmTrades";
import { useSelector, useDispatch } from "react-redux";
import Trade from "./Trade";
import { setStateTrades, fetchLmTrades, fetchFilteredLmTrades } from "../redux/actions";
import { useMemo } from "react";
import useFetchPlayerValues from "../../COMMON/services/hooks/useFetchPlayerValues";
import LoadingIcon from '../../COMMON/components/LoadingIcon';
import Search from "../../COMMON/components/Search";

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

    useFetchFilteredLmTrades()

    const hash = `${'All'}-${'All'}`

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
            const trade_value_date_raw = new Date(parseInt(trade.status_updated)).toISOString().split('T')[0];
            const trade_value_date_formatted = `${trade_value_date_raw.split('-')[1]}-${trade_value_date_raw.split('-')[2]}-${trade_value_date_raw.split('-')[0].slice(2, 4)}`

            const current_value_date_raw = new Date().toISOString().split('T')[0];
            const current_value_date_formatted = `${current_value_date_raw.split('-')[1]}-${current_value_date_raw.split('-')[2]}-${current_value_date_raw.split('-')[0].slice(2, 4)}`

            return {
                id: trade.transaction_id,
                list: [

                    {
                        text: <Trade trade={trade} trade_value_date={trade_value_date_raw} />,
                        colSpan: 10,
                        className: `small `
                    }

                ],
                secondary_table: secondaryTable({
                    league: {
                        rosters: trade.rosters,
                        roster_positions: trade['league.roster_positions']
                    },
                    trade: trade,
                    trade_value_date: trade_value_date_formatted,
                    current_value_date: current_value_date_formatted
                })
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

    const managers_list = []

    leagues
        .forEach(league => {
            league.rosters
                .filter(r => parseInt(r.user_id) > 0)
                .forEach(roster => {
                    if (!managers_list.find(m => m.id === roster.user_id)) {
                        managers_list.push({
                            id: roster.user_id,
                            text: roster.username,
                            image: {
                                src: roster.avatar,
                                alt: 'user avatar',
                                type: 'user'
                            }
                        })
                    }
                })
        })

    return isLoading
        ? <LoadingIcon />
        : <>
            <div className="trade_search_wrapper">
                <Search
                    id={'By Player'}
                    placeholder={`Player`}
                    list={players_list}
                    searched={lmTrades.searched_player}
                    setSearched={(searched) => dispatch(setStateTrades({ lmTrades: { ...lmTrades, searched_player: searched } }, 'TRADES'))}
                />
                <Search
                    id={'By Manager'}
                    placeholder={`Manager`}
                    list={managers_list}
                    searched={lmTrades.searched_manager}
                    setSearched={(searched) => dispatch(setStateTrades({ lmTrades: { ...lmTrades, searched_manager: searched } }, 'TRADES'))}
                />
            </div>
            <TableMain
                id={'trades'}
                type={'primary'}
                headers={trades_headers}
                body={trades_body}
                itemActive={lmTrades.itemActive}
                setItemActive={(item) => dispatch(setStateTrades({ lmTrades: { ...lmTrades, itemActive: item } }))}
                page={lmTrades.page}
                setPage={(page) => dispatch(setStateTrades({ lmTrades: { ...lmTrades, page: page } }))}
                partial={tradesDisplay?.length < tradeCount ? true : false}
                loadMore={loadMore}
                isLoading={isLoading}
            />

        </>
}

export default LmTrades;