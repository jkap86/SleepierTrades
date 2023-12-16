import { useSelector, useDispatch } from "react-redux";
import { filterLeagues } from "../../COMMON/services/helpers/filterLeagues";
import { setStateLineups } from "../redux/actions";
import { matchTeam } from "../../COMMON/services/helpers/matchTeam";
import { useEffect } from "react";

const RecordsHeader = () => {
    const dispatch = useDispatch();
    const { state, schedule } = useSelector(state => state.common);
    const { leagues, type1, type2 } = useSelector(state => state.user);
    const { includeTaxi, lineupChecks, week, primaryContent, playoffs } = useSelector(state => state.lineups);

    const hash = `${includeTaxi}-${true}`



    const projectedRecord = week >= state.week
        ? filterLeagues((leagues || []), type1, type2)
            ?.filter(l => !playoffs || (
                state.week >= l.settings.playoff_week_start
                && l.settings.playoff_teams >= l.userRoster.rank
            ))
            .reduce((acc, cur) => {
                const lc_league = lineupChecks[week]?.[hash]?.[cur.league_id]

                let proj_score, proj_score_opp;

                if (cur.settings.best_ball === 1) {
                    proj_score = parseFloat(lc_league?.lc_user?.[`proj_score_optimal`]);
                    proj_score_opp = parseFloat(lc_league?.lc_opp?.[`proj_score_optimal`]);
                } else {
                    proj_score = parseFloat(lc_league?.lc_user?.[`proj_score_actual`]);
                    proj_score_opp = parseFloat(lc_league?.lc_opp?.[`proj_score_actual`]);
                }

                const playoffs = cur.settings.playoff_week_start > 0 && week >= cur.settings.playoff_week_start

                let wins = (lc_league?.win || 0) + (!playoffs && lc_league?.median_win || 0)
                let losses = (lc_league?.loss || 0) + (!playoffs && lc_league?.median_loss || 0)
                let ties = lc_league?.tie || 0



                return {
                    wins: acc.wins + wins,
                    losses: acc.losses + losses,
                    ties: acc.ties + ties,
                    fpts: acc.fpts + (proj_score || 0),
                    fpts_against: acc.fpts_against + (proj_score_opp || 0),
                }
            }, {
                wins: 0,
                losses: 0,
                ties: 0,
                fpts: 0,
                fpts_against: 0
            })
        : filterLeagues((leagues || []), type1, type2)
            .reduce((acc, cur) => {
                const score = lineupChecks[week]?.[cur.league_id]?.lc_user?.matchup?.points || 0;
                const score_opp = lineupChecks[week]?.[cur.league_id]?.lc_opp?.matchup?.points || 0;

                let wins = (lineupChecks[week]?.[cur.league_id]?.win || 0) + (lineupChecks[week]?.[cur.league_id]?.median_win || 0);
                let losses = (lineupChecks[week]?.[cur.league_id]?.loss || 0) + (lineupChecks[week]?.[cur.league_id]?.median_loss || 0);
                let ties = lineupChecks[week]?.[cur.league_id]?.tie || 0


                return {
                    wins: acc.wins + wins,
                    losses: acc.losses + losses,
                    ties: acc.ties + ties,
                    fpts: acc.fpts + score,
                    fpts_against: acc.fpts_against + score_opp,
                }
            }, {
                wins: 0,
                losses: 0,
                ties: 0,
                fpts: 0,
                fpts_against: 0
            })

    return <>
        <h1>
            Week <select
                value={week}
                onChange={(e) => dispatch(setStateLineups({ week: e.target.value }))}
                className="active click"
                disabled={primaryContent === 'Live Projections'}
            >
                {
                    Array.from(Array(18).keys()).map(key =>
                        <option key={key + 1}>{key + 1}</option>
                    )
                }
            </select>
        </h1>
        <h2>
            <select
                value={primaryContent}
                onChange={(e) => dispatch(setStateLineups({ primaryContent: e.target.value }))}
                className="active click"

            >
                <option>Lineup Check</option>
                <option>Starters/Bench</option>
                <option
                //  disabled={!gamesInProgress}
                >
                    Live Projections
                </option>
            </select>
        </h2 >
        <h2>
            <table className="summary">
                <tbody>
                    <tr>
                        <th colSpan={2} >
                            <span className="font2 wr">
                                {
                                    week < state.week ? 'RESULT' : 'PROJECTION'
                                }
                            </span>
                        </th>
                    </tr>
                    <tr>
                        <th>Record</th>
                        <td>{projectedRecord?.wins.toLocaleString("en-US")}-{projectedRecord?.losses.toLocaleString("en-US")}{projectedRecord?.ties > 0 && `-${projectedRecord.ties.toLocaleString("en-US")}`}</td>
                    </tr>
                    <tr>
                        <th>Win Pct</th>
                        <td>
                            {
                                projectedRecord?.wins + projectedRecord?.losses + projectedRecord?.ties > 0
                                    ? (
                                        (projectedRecord?.wins || 0)
                                        / (
                                            (projectedRecord?.wins || 0)
                                            + (projectedRecord?.losses || 0)
                                            + (projectedRecord?.ties || 0)
                                        )
                                    ).toFixed(4)
                                    : '-'
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>Points For</th>
                        <td>{projectedRecord?.fpts?.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    </tr>
                    <tr>
                        <th>Points Against</th>
                        <td>{projectedRecord?.fpts_against?.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    </tr>
                </tbody>
            </table>


        </h2>
    </>
}

export default RecordsHeader;