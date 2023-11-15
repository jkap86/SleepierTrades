import { useSelector, useDispatch } from "react-redux";
import LmTrades from "./LmTrades";
import PcTrades from "./PcTrades";
import { setStateTrades } from "../redux/actions";

const Trades1 = ({ secondaryTable }) => {
    const dispatch = useDispatch();
    const { state, allplayers } = useSelector(state => state.common);
    const { type1, type2, leagues } = useSelector(state => state.user);
    const { tabPrimary, trade_date, lmTrades } = useSelector(state => state.trades);

    const hash = `${type1}-${type2}`;

    let tradeCount;

    switch (tabPrimary) {
        case 'Leaguemate Trades':
            tradeCount = (!lmTrades.searched_player?.id && !lmTrades.searched_manager?.id)
                ? lmTrades.trades?.[hash]?.count
                : lmTrades.searches
                    ?.find(
                        s => s.player === lmTrades.searched_player.id
                            && s.manager === lmTrades.searched_manager.id
                    )
                    ?.count
            break;

        default:
            break;
    }

    const trades_headers = [
        [
            {
                text: 'Date',
                colSpan: 3
            },
            {
                text: 'League',
                colSpan: 7
            }
        ]
    ];

    const picks_list = []

    Array.from(Array(4).keys()).map(season => {
        return Array.from(Array(5).keys()).map(round => {
            if (season !== 0) {
                return picks_list.push({
                    id: `${season + parseInt(state.league_season)} ${round + 1}.${null}`,
                    text: `${season + parseInt(state.league_season)}  Round ${round + 1}`,
                    image: {
                        src: null,
                        alt: 'pick headshot',
                        type: 'player'
                    }
                })
            } else {
                return Array.from(Array(12).keys()).map(order => {
                    return picks_list.push({
                        id: `${season + parseInt(state.league_season)} ${round + 1}.${season === 0 ? (order + 1).toLocaleString("en-US", { minimumIntegerDigits: 2 }) : null}`,
                        text: `${season + parseInt(state.league_season)} ${season === 0 ? `${round + 1}.${(order + 1).toLocaleString("en-US", { minimumIntegerDigits: 2 })}` : ` Round ${round + 1}`}`,
                        image: {
                            src: null,
                            alt: 'pick headshot',
                            type: 'player'
                        }
                    })
                })
            }
        })
    })

    const players_list = leagues && [
        ...Array.from(
            new Set(
                leagues?.map(league => league.rosters?.map(roster => roster.players)).flat(3)
            )
        ).map(player_id => {
            return {
                id: player_id,
                text: allplayers[player_id]?.full_name,
                image: {
                    src: player_id,
                    alt: 'player headshot',
                    type: 'player'
                }
            }
        }),
        ...picks_list
    ]

    const props = {
        trades_headers,
        players_list,
        tradeCount
    }
    return <>
        <h2>
            {tradeCount?.toLocaleString("en-US")}
            {` Total ${state.league_season} Trades`}

        </h2>
        <div className='navbar'>
            <p className='select'>
                {tabPrimary}&nbsp;<i class="fa-solid fa-caret-down"></i>
            </p>

            <select
                className='trades'
                onChange={(e) => dispatch(setStateTrades({ tabPrimary: e.target.value }))}
                value={tabPrimary}

            >
                <option>Price Check</option>
                <option>Leaguemate Trades</option>
            </select>
        </div>
        <div className='date'>
            <input
                type='date'
                value={new Date(trade_date).toISOString().split('T')[0]}
                onChange={(e) => dispatch(setStateTrades({ trade_date: new Date(e.target.value.split('T')[0]) }))}
            />
            to
            <input
                type='date'
                value={new Date(new Date(trade_date) - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                onChange={(e) => dispatch(setStateTrades({ trade_date: new Date(e.target.value.split('T')[0]) }))}
            />
        </div>
        {
            tabPrimary === "Leaguemate Trades"
                ? <LmTrades {...props} secondaryTable={secondaryTable} />
                : <PcTrades />
        }
    </>
}

export default Trades1;