export const getColumnValue = (header, matchup, lineup_check, league, opt_proj, act_proj, opp_opt_proj, opp_act_proj, proj_median, projections, week) => {
    if (league.settings.status === 'in_season') {
        switch (header) {
            case 'Proj FP':
                return {
                    text: league.settings.best_ball === 1
                        ? opt_proj?.toFixed(2)
                        : act_proj?.toFixed(2),
                    colSpan: 2
                }
            case 'Proj FPA':
                return {
                    text: league.settings.best_ball === 1
                        ? opp_opt_proj?.toFixed(2)
                        : opp_act_proj?.toFixed(2),
                    colSpan: 2
                }
            case 'Proj FP (Opt)':
                return {
                    text: opt_proj?.toFixed(2),
                    colSpan: 2
                }
            case 'Proj FPA (Opt)':
                return {
                    text: opp_opt_proj?.toFixed(2),
                    colSpan: 2
                }
            case 'Proj Median':
                return {
                    text: parseInt(proj_median) && proj_median?.toFixed(2) || '-',
                    colSpan: 2
                }
            case 'Suboptimal':
                return {
                    text: !matchup?.matchup_id || !lineup_check ? '-' : lineup_check.filter(x => x.notInOptimal).length > 0 ?
                        lineup_check.filter(x => x.notInOptimal).length :
                        '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check ? '' : lineup_check.filter(x => x.notInOptimal).length > 0 ?
                        'red' : 'green'
                }
            case 'Early/Late Flex':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => x.earlyInFlex).length + lineup_check.filter(x => x.lateNotInFlex).length > 0
                            ? lineup_check.filter(x => x.earlyInFlex).length + lineup_check.filter(x => x.lateNotInFlex).length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => x.earlyInFlex).length + lineup_check.filter(x => x.lateNotInFlex).length > 0
                            ? 'red'
                            : 'green'
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
                            ? 'red'
                            : 'green'
                        : ''
                }
            case 'Non QB in SF':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => x.nonQBinSF).length > 0
                            ? lineup_check.filter(x => x.nonQBinSF).length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => x.nonQBinSF).length > 0
                            ? 'red'
                            : 'green'
                }
            case 'Open Roster':
                const user_active_players = league.userRoster.players.filter(p => !league.userRoster.taxi?.includes(p) && !league.userRoster.reserve?.includes(p))
                return {
                    text: league.roster_positions.length !== user_active_players?.length
                        ? league.roster_positions.length - user_active_players?.length
                        : '√',
                    colSpan: 2,
                    className: league.roster_positions.length !== user_active_players?.length
                        ? 'red'
                        : 'green',
                }
            case 'Open IR':
                if (projections[week]) {
                    const total_ir = league.settings.reserve_slots
                    const used_ir = league.userRoster?.reserve?.length || 0
                    const open_ir = total_ir - used_ir;
                    const eligible_ir = league.userRoster.players?.filter(player_id => !league.userRoster.reserve?.includes(player_id)
                        && !league.userRoster.taxi?.includes(player_id)
                        && (
                            (league.settings.reserve_allow_sus === 1 && projections[week][player_id]?.injury_status === 'Sus')
                            || (league.settings.reserve_allow_doubtful === 1 && projections[week][player_id]?.injury_status === 'Doubtful')
                            || (league.settings.reserve_allow_out === 1 && projections[week][player_id]?.injury_status === 'Out')
                            || projections[week][player_id]?.injury_status === 'IR'
                        )
                    ).length
                    return {
                        text: (open_ir > 0 && eligible_ir > 0)
                            ? Math.min(eligible_ir, open_ir)
                            : '√',
                        colSpan: 2,
                        className: (open_ir > 0 && eligible_ir > 0)
                            ? 'red'
                            : 'green',
                    }
                } else {
                    return {
                        text: '-',
                        colSpan: 2
                    }
                }
            case 'Out':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Out').length > 0
                            ? lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Out').length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Out').length > 0
                            ? 'red'
                            : 'green'
                }
            case 'Doubtful':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Doubtful').length > 0
                            ? lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Doubtful').length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Doubtful').length > 0
                            ? 'red'
                            : 'green'
                }
            case 'Ques':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Questionable').length > 0
                            ? lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Questionable').length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Questionable').length > 0
                            ? 'red'
                            : 'green'
                }
            case 'IR':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'IR').length > 0
                            ? lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'IR').length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'IR').length > 0
                            ? 'red'
                            : 'green'
                }
            case 'Sus':
                return {
                    text: !matchup?.matchup_id || !lineup_check
                        ? '-'
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Sus').length > 0
                            ? lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Sus').length
                            : '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check
                        ? ''
                        : lineup_check.filter(x => projections[week][x.current_player]?.injury_status === 'Sus').length > 0
                            ? 'red'
                            : 'green'
                }
            case 'Opt-Act':
                return {
                    text: opt_proj === act_proj
                        ? '√'
                        : (act_proj - opt_proj).toFixed(2),
                    colSpan: 2,
                    className: opt_proj === act_proj
                        ? 'green'
                        : 'red'
                }
            default:
                return {
                    text: '-',
                    colSpan: 2
                }
        }
    } else {
        return {
            text: '-',
            colSpan: 2
        }
    }
}

export const getColumnValuePrev = (column, league_id, matchup_user, matchup_opp, act_median, lineupChecks, week) => {
    const proj_score_user_actual = lineupChecks[week]?.[league_id]?.lc_user?.proj_score_actual;
    const proj_score_opp_actual = lineupChecks[week]?.[league_id]?.lc_opp?.proj_score_actual;


    const bench_points = matchup_user?.players
        ?.filter(player_id => !matchup_user.starters.includes(player_id))
        ?.reduce((acc, cur) => acc + matchup_user.players_points[cur], 0)

    const total_points = matchup_user?.players
        ?.reduce((acc, cur) => acc + matchup_user.players_points[cur], 0)

    switch (column) {
        case 'For':
            return {
                text: matchup_user?.points?.toFixed(1),
                colSpan: 2
            };
        case 'Against':
            return {
                text: matchup_opp?.points?.toFixed(1),
                colSpan: 2
            };
        case 'Median':
            return {
                text: parseInt(act_median) && act_median.toFixed(2) || '-',
                colSpan: 2
            }
        case 'Optimal For':
            return {
                text: proj_score_user_actual?.toFixed(1),
                colSpan: 2
            };
        case 'Optimal Against':
            return {
                text: proj_score_opp_actual?.toFixed(1),
                colSpan: 2
            };
        case 'Bench Points':
            return {
                text: bench_points?.toFixed(1) || '-',
                colSpan: 2
            }
        case 'Total Points':
            return {
                text: total_points?.toFixed(1) || '-',
                colSpan: 2
            }
        default:
            return {
                text: '-',
                colSpan: 2
            }
    }
}