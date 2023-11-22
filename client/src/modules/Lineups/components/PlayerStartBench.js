import TableMain from "../../COMMON/components/TableMain";
import { useSelector, useDispatch } from "react-redux";
import { getTrendColor } from "../../COMMON/services/helpers/getTrendColor";
import { setStateLineups } from "../redux/actions";

const PlayerStartBench = ({
    start,
    bench,
    start_opp,
    bench_opp,
    page2_start,
    page2_bench,
    page2_start_opp,
    page2_bench_opp
}) => {
    const dispatch = useDispatch();
    const { state } = useSelector(state => state.common);
    const {
        includeTaxi,
        week,
        lineupChecks,
        secondaryContent3
    } = useSelector(state => state.lineups);

    const hash = `${includeTaxi}-${true}`

    const getGroupHeader = (type) => {
        return [
            [
                {
                    text: 'League',
                    colSpan: 3
                },
                {
                    text: 'PF',
                    colSpan: 1
                },
                {
                    text: 'PA (Median)',
                    colSpan: 2
                }
            ]
        ]
    }


    const getGroupBody = (leagues) => {
        return leagues
            .map(league => {
                let proj_fp, proj_fp_opp;

                if (week >= state.week) {
                    proj_fp = league.settings.best_ball === 1
                        ? lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.proj_score_optimal
                        : lineupChecks[week]?.[hash]?.[league.league_id]?.lc_user?.proj_score_actual

                    proj_fp_opp = league.settings.best_ball === 1
                        ? lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.proj_score_optimal
                        : lineupChecks[week]?.[hash]?.[league.league_id]?.lc_opp?.proj_score_actual

                } else {
                    proj_fp = league.settings.best_ball === 1
                        ? lineupChecks[week]?.[league.league_id]?.lc_user?.proj_score_optimal
                        : lineupChecks[week]?.[league.league_id]?.lc_user?.proj_score_actual

                    proj_fp_opp = league.settings.best_ball === 1
                        ? lineupChecks[week]?.[league.league_id]?.lc_opp?.proj_score_optimal
                        : lineupChecks[week]?.[league.league_id]?.lc_opp?.proj_score_actual

                }

                const proj_median = lineupChecks[week]?.[hash]?.[league.league_id]?.proj_median

                return {
                    id: league.league_id,
                    list: [
                        {
                            text: league.name,
                            colSpan: 3,
                            className: 'left',
                            image: {
                                src: league.avatar,
                                alt: 'league avatar',
                                type: 'league'
                            }
                        },
                        {
                            text: <p
                                className="stat"
                                style={getTrendColor(((proj_fp - proj_fp_opp) / Math.max(proj_fp, proj_fp_opp)), .001)}
                            >
                                {proj_fp?.toFixed(1)}
                            </p>,
                            colSpan: 1
                        },
                        {
                            text: <>
                                <p
                                    className="stat"
                                    style={getTrendColor(((proj_fp - proj_fp_opp) / Math.max(proj_fp, proj_fp_opp)), .001)}
                                >
                                    {proj_fp_opp?.toFixed(1)}
                                </p>
                                {
                                    parseFloat(proj_median)
                                        ? <p
                                            className="stat"
                                            style={getTrendColor(((proj_fp - proj_median) / Math.max(proj_fp, proj_median)), .001)}
                                        >
                                            &nbsp;&nbsp;&nbsp;&nbsp;({proj_median?.toFixed(1)})
                                        </p>
                                        : null
                                }
                            </>,
                            colSpan: 2
                        }
                    ]
                }
            })
    }


    return <>
        <div className="secondary nav">
            <button
                className={secondaryContent3 === 'Starters' ? 'active click' : 'click'}
                onClick={() => dispatch(setStateLineups({ secondaryContent3: 'Starters' }))}
            >
                Starters
            </button>
            <button
                className={secondaryContent3 === 'Bench' ? 'active click' : 'click'}
                onClick={() => dispatch(setStateLineups({ secondaryContent3: 'Bench' }))}
            >
                Bench
            </button>
            <button
                className={secondaryContent3 === 'Opp Starters' ? 'active click' : 'click'}
                onClick={() => dispatch(setStateLineups({ secondaryContent3: 'Opp Starters' }))}
            >
                Opp Starters
            </button>
            <button
                className={secondaryContent3 === 'Opp Bench' ? 'active click' : 'click'}
                onClick={() => dispatch(setStateLineups({ secondaryContent3: 'Opp Bench' }))}
            >
                Opp Bench
            </button>
        </div>
        {
            secondaryContent3 === 'Starters'
                ? <TableMain
                    type={'secondary lineup'}
                    headers={getGroupHeader('Starters')}
                    body={getGroupBody(start)}
                    page={page2_start}
                    setPage={(value) => dispatch(setStateLineups({ page2_start: value }))}
                />
                : secondaryContent3 === 'Bench'
                    ? <TableMain
                        type={'secondary lineup'}
                        headers={getGroupHeader('Bench')}
                        body={getGroupBody(bench)}
                        page={page2_bench}
                        setPage={(value) => dispatch(setStateLineups({ page2_bench: value }))}
                    />
                    : secondaryContent3 === 'Opp Starters'
                        ? <TableMain
                            type={'secondary subs'}
                            headers={getGroupHeader('Opp Starters')}
                            body={getGroupBody(start_opp)}
                            page={page2_start_opp}
                            setPage={(value) => dispatch(setStateLineups({ page2_start_opp: value }))}
                        />
                        : secondaryContent3 === 'Opp Bench'
                            ? <TableMain
                                type={'secondary subs'}
                                headers={getGroupHeader('Opp Bench')}
                                body={getGroupBody(bench_opp)}
                                page={page2_bench_opp}
                                setPage={(value) => dispatch(setStateLineups({ page2_bench_opp: value }))}
                            />
                            : null
        }
    </>
}

export default PlayerStartBench;