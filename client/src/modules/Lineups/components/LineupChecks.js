import TableMain from "../../COMMON/components/TableMain";
import { useSelector, useDispatch } from "react-redux";
import { setStateLineups } from "../redux/actions";
import { getColumnValue, getColumnValuePrev } from '../services/helpers/getColumns';
import { filterLeagues } from '../../COMMON/services/helpers/filterLeagues';
import FilterIcons from "../../COMMON/components/FilterIcons";
import LoadingIcon from '../../COMMON/components/LoadingIcon';
import { getTrendColor } from "../../COMMON/services/helpers/getTrendColor";
import { useEffect } from "react";

const LineupChecks = ({ secondaryTable }) => {
    const dispatch = useDispatch();
    const { state, projections } = useSelector(state => state.common);
    const { leagues, type1, type2 } = useSelector(state => state.user);
    const {
        includeTaxi,
        week,
        lineupChecks,
        column1,
        column2,
        column3,
        column4,
        column1_prev,
        column2_prev,
        column3_prev,
        column4_prev,
        itemActive,
        page,
        searched,
        playerLineupDict,
        primaryContent,
        sortBy,
        filters,
        playoffs
    } = useSelector(state => state.lineups);

    const hash = `${includeTaxi}-${true}`

    useEffect(() => {
        if (primaryContent === 'Live Projections') {
            dispatch(setStateLineups({ week: state.week }))
        }
    }, [primaryContent])

    const columnOptions = week < state.week
        ? [
            'For',
            'Against',
            'Optimal For',
            'Optimal Against',
            'Bench Points',
            'Total Points',
            'Median'
        ]
        : [
            'Proj FP',
            'Proj FPA',
            'Proj FP (Opt)',
            'Proj FPA (Opt)',
            'Proj Median',
            'Suboptimal',
            'Early/Late Flex',
            'Non QB in SF',
            'Open Roster',
            'Open IR',
            'Open Taxi',
            'Out',
            'Doubtful',
            'Ques',
            'IR',
            'Sus',
            'Opt-Act',
            'Rank',
            'Opp Rank',
            'Trade Deadline'
        ];

    const live_projections_headers = [
        [
            {
                text: 'League',
                colSpan: 6
            },
            {
                text: 'Rank',
                colSpan: 2
            },
            {
                text: 'W/L',
                colSpan: 1
            },
            {
                text: 'PF',
                colSpan: 3
            },
            {
                text: <>PA <em>Median</em></>,
                colSpan: 6
            }
        ]
    ]

    const lineups_headers = [
        [
            {
                text: 'League',
                colSpan: 6,
                rowSpan: 2,
                className: 'half'
            },
            {
                text: 'W/L',
                className: 'half',
                colSpan: 1,
                rowSpan: 2
            },
            {
                text: week < state.week ? 'Results' : '#Slots',
                colSpan: 8,
                className: 'half'
            }

        ],
        [
            {
                text: <p className="select">{week < state.week ? column1_prev : column1}
                    <select
                        value={week < state.week ? column1_prev : column1}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setStateLineups({ [week < state.week ? 'column1_prev' : 'column1']: e.target.value }, 'LINEUPS'))}
                    >
                        {
                            columnOptions
                                .filter(column => (
                                    week < state.week
                                        ? ![column2_prev, column3_prev, column4_prev].includes(column)
                                        : ![column2, column3, column4].includes(column)))
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select>
                </p>,
                colSpan: 2,
                className: 'small half left'
            },
            {
                text: <p className="select">{week < state.week ? column2_prev : column2}
                    <select
                        value={week < state.week ? column2_prev : column2}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setStateLineups({ [week < state.week ? 'column2_prev' : 'column2']: e.target.value }, 'LINEUPS'))}
                    >
                        {
                            columnOptions
                                .filter(column => (
                                    week < state.week
                                        ? ![column1_prev, column3_prev, column4_prev].includes(column)
                                        : ![column1, column3, column4].includes(column)))
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select>
                </p>,
                colSpan: 2,
                className: 'small half'
            },
            {
                text: <p className="select">{week < state.week ? column3_prev : column3}
                    <select
                        value={week < state.week ? column3_prev : column3}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setStateLineups({ [week < state.week ? 'column3_prev' : 'column3']: e.target.value }, 'LINEUPS'))}
                    >
                        {
                            columnOptions
                                .filter(column => (
                                    week < state.week
                                        ? ![column1_prev, column2_prev, column4_prev].includes(column)
                                        : ![column1, column2, column4].includes(column)))
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select>
                </p>,
                colSpan: 2,
                className: 'small half'
            },
            {
                text: <p className="select">{week < state.week ? column4_prev : column4}
                    <select
                        value={week < state.week ? column4_prev : column4}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setStateLineups({ [week < state.week ? 'column4_prev' : 'column4']: e.target.value }, 'LINEUPS'))}
                    >
                        {
                            columnOptions
                                .filter(column => (
                                    week < state.week
                                        ? ![column1_prev, column2_prev, column3_prev].includes(column)
                                        : ![column1, column2, column3].includes(column)))
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select></p>,
                colSpan: 2,
                className: 'small half end'
            }
        ]
    ]

    const lineups_body = filterLeagues(leagues, type1, type2)
        ?.filter(l => !playoffs || (
            state.week >= l.settings.playoff_week_start
            && l.settings.playoff_teams >= l.userRoster.rank
        ))
        ?.filter(l => !searched.id || searched.id === l.league_id)
        ?.map(league => {
            if (week >= state.week) {

                const proj_fp = league.settings.best_ball === 1
                    ? lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.proj_score_optimal
                    : lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.proj_score_actual

                const proj_fp_opp = league.settings.best_ball === 1
                    ? lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.proj_score_optimal
                    : lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.proj_score_actual

                const lineup_check_user = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.lineup_check;

                const matchup_user = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.matchup;
                const optimal_lineup = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.optimal_lineup

                const proj_score_user_optimal = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.proj_score_optimal;
                const proj_score_user_actual = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.proj_score_actual;

                const lineup_check_opp = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.lineup_check;

                const matchup_opp = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.matchup;
                const optimal_lineup_opp = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.optimal_lineup

                const oppRoster = league.rosters?.find(r => r.roster_id === matchup_opp?.roster_id)
                const proj_score_opp_optimal = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.proj_score_optimal;
                const proj_score_opp_actual = lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.proj_score_actual;

                const opp_roster = league.rosters.find(r => r.roster_id === matchup_opp?.roster_id)


                const players_projections = {
                    ...lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.players_projections,
                    ...lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.players_projections
                }

                const proj_median = lineupChecks[week]?.[hash]?.[league.league_id]?.proj_median

                return primaryContent === 'Live Projections'
                    ? {
                        id: league.league_id,
                        search: {
                            text: league.name,
                            image: {
                                src: league.avatar,
                                alt: league.name,
                                type: 'league'
                            }
                        },
                        list: [
                            {
                                text: league.name,
                                colSpan: 6,
                                className: 'left',
                                image: {
                                    src: league.avatar,
                                    alt: 'league avatar',
                                    type: 'league'
                                }
                            },
                            {
                                text: <p
                                    className="stat check"
                                    style={getTrendColor(-((league.userRoster.rank / league.rosters.length) - .5), .0025)}
                                >
                                    {league.userRoster.rank}
                                    <span className="small">
                                        {
                                            league.userRoster.rank === 1
                                                ? 'st'
                                                : league.userRoster.rank === 2
                                                    ? 'nd'
                                                    : league.userRoster.rank === 3
                                                        ? 'rd'
                                                        : 'th'
                                        }
                                    </span>
                                </p>,
                                colSpan: 2,
                                className: 'relative'
                            },
                            {
                                text: !matchup_user?.matchup_id ? '-' : <>
                                    {
                                        (lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user && lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp)
                                            ? league.settings.best_ball === 1
                                                ? proj_score_user_optimal > proj_score_opp_optimal
                                                    ? 'W'
                                                    : proj_score_user_optimal < proj_score_opp_optimal
                                                        ? 'L'
                                                        : '-'
                                                : proj_score_user_actual > proj_score_opp_actual
                                                    ? 'W'
                                                    : proj_score_user_actual < proj_score_opp_actual
                                                        ? 'L'
                                                        : '-'
                                            : '-'

                                    }
                                    {matchup_user.matchup_id && (league.settings.playoff_week_start === 0 || week < league.settings.playoff_week_start) && (
                                        lineupChecks[week]?.[hash]?.[league.league_id]?.median_win > 0
                                            ? <i className="fa-solid fa-trophy"></i>
                                            : lineupChecks[week]?.[hash]?.[league.league_id]?.median_loss > 0
                                                ? <i className="fa-solid fa-poop"></i>
                                                : '')
                                    }
                                </>,
                                colSpan: 1,
                                className: (
                                    matchup_user?.matchup_id
                                    && lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user
                                    && lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp
                                )
                                    ? league.settings.best_ball !== 1
                                        ? proj_score_user_actual > proj_score_opp_actual
                                            ? 'greenb'
                                            : proj_score_user_actual < proj_score_opp_actual
                                                ? 'redb'
                                                : '-'
                                        : proj_score_user_optimal > proj_score_opp_optimal
                                            ? 'greenb'
                                            : proj_score_user_optimal < proj_score_opp_optimal
                                                ? 'redb'
                                                : '-'
                                    : '-',
                            },
                            {
                                text: <p
                                    className="stat check"
                                    style={getTrendColor(((proj_fp - proj_fp_opp) / Math.max(proj_fp, proj_fp_opp)), .001)}
                                >
                                    {proj_fp?.toFixed(1)}
                                </p>,
                                colSpan: 3,
                                className: 'relative'
                            },
                            {
                                text: <div className="flex">
                                    <p
                                        className="stat check"
                                        style={getTrendColor(((proj_fp - proj_fp_opp) / Math.max(proj_fp, proj_fp_opp)), .001)}
                                    >
                                        {proj_fp_opp?.toFixed(1)}
                                    </p>
                                    {
                                        parseFloat(proj_median)
                                            ? <em><p
                                                className="stat check"
                                                style={getTrendColor(((proj_fp - proj_median) / Math.max(proj_fp, proj_median)), .001)}
                                            >
                                                {proj_median?.toFixed(1)}
                                            </p></em>
                                            : null
                                    }
                                </div>,
                                colSpan: 6,
                                className: 'relative'
                            }
                        ],
                        secondary_table: secondaryTable({
                            league,
                            matchup_user,
                            matchup_opp,
                            lineup_check: lineup_check_user,
                            lineup_check_opp,
                            optimal_lineup,
                            optimal_lineup_opp,
                            players_projections,
                            proj_score_user_actual,
                            proj_score_user_optimal,
                            proj_score_opp_actual,
                            proj_score_opp_optimal,
                            opp_username: opp_roster?.username || 'Orphan',
                            opp_avatar: opp_roster?.avatar,
                            proj_median
                        })
                    }
                    : {
                        id: league.league_id,
                        search: {
                            text: league.name,
                            image: {
                                src: league.avatar,
                                alt: league.name,
                                type: 'league'
                            }
                        },
                        list: [
                            {
                                text: league.name,
                                colSpan: 6,
                                className: 'left',
                                image: {
                                    src: league.avatar,
                                    alt: league.name,
                                    type: 'league'
                                }
                            },
                            {
                                text: !matchup_user?.matchup_id ? '-' : <>
                                    {
                                        (lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user && lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp)
                                            ? league.settings.best_ball === 1
                                                ? proj_score_user_optimal > proj_score_opp_optimal
                                                    ? 'W'
                                                    : proj_score_user_optimal < proj_score_opp_optimal
                                                        ? 'L'
                                                        : '-'
                                                : proj_score_user_actual > proj_score_opp_actual
                                                    ? 'W'
                                                    : proj_score_user_actual < proj_score_opp_actual
                                                        ? 'L'
                                                        : '-'
                                            : '-'

                                    }
                                    {matchup_user.matchup_id && (league.settings.playoff_week_start === 0 || week < league.settings.playoff_week_start) && (
                                        lineupChecks[week]?.[hash]?.[league.league_id]?.median_win > 0
                                            ? <i className="fa-solid fa-trophy"></i>
                                            : lineupChecks[week]?.[hash]?.[league.league_id]?.median_loss > 0
                                                ? <i className="fa-solid fa-poop"></i>
                                                : '')
                                    }
                                </>,
                                colSpan: 1,
                                className: (
                                    matchup_user?.matchup_id
                                    && lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user
                                    && lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp
                                )
                                    ? league.settings.best_ball !== 1
                                        ? proj_score_user_actual > proj_score_opp_actual
                                            ? 'greenb'
                                            : proj_score_user_actual < proj_score_opp_actual
                                                ? 'redb'
                                                : '-'
                                        : proj_score_user_optimal > proj_score_opp_optimal
                                            ? 'greenb'
                                            : proj_score_user_optimal < proj_score_opp_optimal
                                                ? 'redb'
                                                : '-'
                                    : '-',
                            },
                            {
                                ...getColumnValue(column1, matchup_user, lineup_check_user, league, proj_score_user_optimal, proj_score_user_actual, proj_score_opp_optimal, proj_score_opp_actual, proj_median, projections, week, opp_roster, state)
                            },
                            {
                                ...getColumnValue(column2, matchup_user, lineup_check_user, league, proj_score_user_optimal, proj_score_user_actual, proj_score_opp_optimal, proj_score_opp_actual, proj_median, projections, week, opp_roster, state)
                            },
                            {
                                ...getColumnValue(column3, matchup_user, lineup_check_user, league, proj_score_user_optimal, proj_score_user_actual, proj_score_opp_optimal, proj_score_opp_actual, proj_median, projections, week, opp_roster, state)
                            },
                            {
                                ...getColumnValue(column4, matchup_user, lineup_check_user, league, proj_score_user_optimal, proj_score_user_actual, proj_score_opp_optimal, proj_score_opp_actual, proj_median, projections, week, opp_roster, state)
                            }
                        ],
                        secondary_table: matchup_user?.matchup_id
                            ? secondaryTable({
                                league,
                                matchup_user,
                                matchup_opp,
                                lineup_check: lineup_check_user,
                                lineup_check_opp,
                                optimal_lineup,
                                optimal_lineup_opp,
                                players_projections,
                                proj_score_user_actual,
                                proj_score_user_optimal,
                                proj_score_opp_actual,
                                proj_score_opp_optimal,
                                opp_username: opp_roster?.username || 'Orphan',
                                opp_avatar: opp_roster?.avatar,
                                proj_median
                            })
                            : <h3>
                                No Matchup
                            </h3>
                    }
            } else {
                console.log('BEFORE')
                const lc_league = lineupChecks[week]?.[league.league_id]
                const matchup_user = lc_league?.lc_user?.matchup;
                const matchup_opp = lc_league?.lc_opp?.matchup;

                const players_projections = {
                    ...lineupChecks[week]?.[league.league_id]?.lc_user?.players_projections,
                    ...lineupChecks[week]?.[league.league_id]?.lc_opp?.players_projections
                }

                const act_median = lc_league?.act_median

                const proj_score_user_optimal = lc_league?.lc_user?.proj_score_optimal;

                const proj_score_opp_optimal = lc_league?.lc_opp?.proj_score_optimal;
                return {
                    id: league.league_id,
                    search: {
                        text: league.name,
                        image: {
                            src: league.avatar,
                            alt: league.name,
                            type: 'league'
                        }
                    },
                    list: [
                        {
                            text: league.name,
                            colSpan: 6,
                            className: 'left',
                            image: {
                                src: league.avatar,
                                alt: league.name,
                                type: 'league'
                            }
                        },
                        {
                            text: <>

                                {

                                    lc_league?.win
                                        ? 'W'
                                        : lc_league?.loss
                                            ? 'L'
                                            : lc_league?.tie
                                                ? 'T'
                                                : '-'

                                }
                                {
                                    lc_league?.median_win === 1
                                        ? <i className="fa-solid fa-trophy"></i>
                                        : lc_league?.median_loss === 1
                                            ? <i className="fa-solid fa-poop"></i>
                                            : null
                                }
                            </>,
                            colSpan: 1,
                            className: lc_league?.win
                                ? 'greenb'
                                : lc_league?.loss
                                    ? 'redb'
                                    : lc_league?.tie
                                        ? '-'
                                        : '-'
                        },
                        {
                            ...getColumnValuePrev(column1_prev, league.league_id, matchup_user, matchup_opp, act_median, lineupChecks, week)
                        },
                        {
                            ...getColumnValuePrev(column2_prev, league.league_id, matchup_user, matchup_opp, act_median, lineupChecks, week)
                        },
                        {
                            ...getColumnValuePrev(column3_prev, league.league_id, matchup_user, matchup_opp, act_median, lineupChecks, week)
                        },
                        {
                            ...getColumnValuePrev(column4_prev, league.league_id, matchup_user, matchup_opp, act_median, lineupChecks, week)
                        }
                    ],
                    secondary_table: secondaryTable({
                        league,
                        matchup_user,
                        matchup_opp,
                        players_projections,
                        proj_score_user_optimal,
                        proj_score_opp_optimal
                    })
                }
            }
        })

    return (week < state.week && !lineupChecks?.[week])
        || (week >= state.week && !lineupChecks?.[week]?.[hash])
        ? <LoadingIcon />
        : <TableMain
            type={'primary'}
            headers={primaryContent === 'Live Projections' ? live_projections_headers : lineups_headers}
            body={lineups_body}
            page={page}
            setPage={(value) => dispatch(setStateLineups({ page: value }))}
            itemActive={itemActive}
            setItemActive={(value) => dispatch(setStateLineups({ itemActive: value }))}
            search={true}
            searched={searched}
            setSearched={(value) => dispatch(setStateLineups({ searched: value }))}
            options1={[
                <FilterIcons
                    type={'taxi'}
                    includeTaxi={includeTaxi}
                    setIncludeTaxi={(value) => dispatch(setStateLineups({ includeTaxi: value }))}
                />
            ]}
            options2={[
                <label className="playoffs">
                    <input type="radio" checked={playoffs} onClick={(e) => dispatch(setStateLineups({ playoffs: !playoffs }))} />
                    Playoff Leagues
                </label>
            ]}
        />
}

export default LineupChecks;