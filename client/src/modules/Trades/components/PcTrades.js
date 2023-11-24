import TableMain from "../../COMMON/components/TableMain";
import { useSelector, useDispatch } from "react-redux";
import Trade from "./Trade";
import { setStateTrades, fetchPriceCheckTrades } from "../redux/actions";
import Search from "../../COMMON/components/Search";
import useFetchPcTrades from "../services/hooks/useFetchPcTrades";


const PcTrades = ({
    trades_headers,
    players_list,
    tradeCount,
    secondaryTable
}) => {
    const dispatch = useDispatch();
    const {
        isLoading,
        pricecheckTrades,
        trade_date
    } = useSelector(state => state.trades);

console.log({pricecheckTrades})
    useFetchPcTrades();

    const tradesDisplay = pricecheckTrades.searches.find(pcTrade => pcTrade.pricecheck_player === pricecheckTrades.pricecheck_player.id && pcTrade.pricecheck_player2 === pricecheckTrades.pricecheck_player2.id)?.trades || []

    const loadMore = async () => {
        console.log('LOADING MORE')
        dispatch(setStateTrades({ pricecheckTrades: { ...pricecheckTrades, page: Math.floor(tradesDisplay.length / 25) + 1 } }, 'TRADES'))
        dispatch(fetchPriceCheckTrades(pricecheckTrades.pricecheck_player.id, pricecheckTrades.pricecheck_player2.id, tradesDisplay.length, 125))
    }

    const trades_body = tradesDisplay
        ?.sort((a, b) => parseInt(b.status_updated) - parseInt(a.status_updated))
        ?.filter(
            trade => (
                new Date(parseInt(trade.status_updated))
                    ?.toISOString().split('T')[0]
                <= new Date(trade_date)
                    ?.toISOString().split('T')[0]
            ) && (
                    new Date(parseInt(trade.status_updated))
                        ?.toISOString().split('T')[0]
                    >= new Date(new Date(trade_date) - 7 * 24 * 60 * 60 * 1000)
                        ?.toISOString().split('T')[0]
                )
        )
        ?.map(trade => {
            const trade_value_date_raw = new Date(parseInt(trade.status_updated)).toISOString().split('T')[0];
            const trade_value_date_formatted = `${trade_value_date_raw.split('-')[1]}-${trade_value_date_raw.split('-')[2]}-${trade_value_date_raw.split('-')[0].slice(2, 4)}`

            const current_value_date_raw = new Date().toISOString().split('T')[0];
            const current_value_date_formatted = `${current_value_date_raw.split('-')[1]}-${current_value_date_raw.split('-')[2]}-${current_value_date_raw.split('-')[0].slice(2, 4)}`
            
            
            return {
                id: trade.transaction_id,
                list: [

                    {
                        text: <Trade trade={trade} trade_value_date={trade_value_date_raw}/>,
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

    return <>
        <div className="trade_search_wrapper">
            <Search
                id={'By Player'}
                placeholder={`Player`}
                list={players_list}
                searched={pricecheckTrades.pricecheck_player}
                setSearched={(searched) => dispatch(setStateTrades({ pricecheckTrades: { ...pricecheckTrades, pricecheck_player: searched } }))}
            />
            {
                pricecheckTrades.pricecheck_player === '' ? null :
                    <>
                        <Search
                            id={'By Player'}
                            placeholder={`Player`}
                            list={players_list}
                            searched={pricecheckTrades.pricecheck_player2}
                            setSearched={(searched) => dispatch(setStateTrades({ pricecheckTrades: { ...pricecheckTrades, pricecheck_player2: searched } }))}
                        />
                    </>
            }
        </div>
        <TableMain
            id={'trades'}
            type={'primary'}
            headers={trades_headers}
            body={trades_body}
            itemActive={pricecheckTrades.itemActive}
            setItemActive={(item) => dispatch(setStateTrades({ pricecheckTrades: { ...pricecheckTrades, itemActive: item } }))}
            page={pricecheckTrades.page}
            setPage={(page) => dispatch(setStateTrades({ pricecheckTrades: { ...pricecheckTrades, page: page } }))}
            partial={tradesDisplay?.length < tradeCount ? true : false}
            loadMore={loadMore}
            isLoading={isLoading}

        /></>
}

export default PcTrades;