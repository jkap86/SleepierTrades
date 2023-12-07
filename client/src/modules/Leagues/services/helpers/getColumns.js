import { getTrendColor } from "../../../COMMON/services/helpers/getTrendColor"


export const getColumnValue = (header, league, state) => {

    switch (header) {
        case 'Trade Deadline':
            return {
                text: <p
                    className={"stat check " + (
                        league.settings.disable_trades
                            ? 'red'
                            : state.week > league.settings.trade_deadline
                                ? 'red'
                                : 'green '
                    )}
                //style={getTrendColor(-((league.userRoster.rank / league.rosters.length) - .5), .0025)}
                >
                    {
                        league.settings.disable_trades
                            ? 'X'
                            : league.settings.trade_deadline === 99
                                ? <i className="fa-solid fa-infinity"></i>
                                : league.settings.trade_deadline
                    }
                </p>,
                colSpan: 2,
                className: 'relative'
            }
        case 'Rank':
            return {
                text: <p
                    className="stat check"
                    style={getTrendColor(-((league.userRoster.rank / league.rosters.length) - .5), .0025)}
                >
                    {league.userRoster.rank}
                </p>,
                colSpan: 2,
                className: 'relative'
            }
        case 'Open Taxi':
            return {
                text: (league.settings.taxi_slots > 0 && league.settings.best_ball !== 1)
                    ? league.settings.taxi_slots - (league.userRoster.taxi?.length || 0) > 0
                        ? league.settings.taxi_slots - (league.userRoster.taxi?.length || 0)
                        : '√'
                    : '-',
                colSpan: 2,
                className: (league.settings.taxi_slots > 0 && league.settings.best_ball !== 1)
                    ? league.settings.taxi_slots - (league.userRoster.taxi?.length || 0) > 0
                        ? 'red check'
                        : 'green check'
                    : ''
            }
        case 'Open Roster':
            const user_active_players = league.userRoster.players.filter(p => !league.userRoster.taxi?.includes(p) && !league.userRoster.reserve?.includes(p))
            return {
                text: league.roster_positions.length !== user_active_players?.length
                    ? league.roster_positions.length - user_active_players?.length
                    : '√',
                colSpan: 2,
                className: league.roster_positions.length !== user_active_players?.length
                    ? 'red check'
                    : 'green check',
            }
        default:
            return {
                text: '-',
                colSpan: 2
            }
    }
}
