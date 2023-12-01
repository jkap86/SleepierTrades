import { useSelector, useDispatch } from "react-redux";
import Roster from "../../COMMON/components/Roster";
import TableMain from "../../COMMON/components/TableMain";
import { setStateLineups } from "../redux/actions";

const Matchup = ({
    league,
    matchup_user,
    matchup_opp,
    players_projections,
    proj_score_user_optimal,
    proj_score_opp_optimal,
    oppRoster,
    lineup_headers,
    lineup_body,
    subs_body,
    subs_headers
}) => {
    const dispatch = useDispatch();
    const {  state } = useSelector(state => state.common);
    const { secondaryContent1, secondaryContent2, itemActive2, week } = useSelector(state => state.lineups);

    if (week < state.week) {
        console.log({
            matchup_user
        })
    }
    return week < state.week
        ? <>
            <Roster
                league={league}
                roster={{
                    ...league.userRoster,
                    players: matchup_user?.players || [],
                    starters: matchup_user?.starters || [],
                }}
                type={'secondary half'}
                previous={true}
                players_projections={players_projections}
                players_points={matchup_user?.players_points}
                total_points={
                    secondaryContent1 === 'Lineup'
                        ? matchup_user?.points
                        : proj_score_user_optimal
                }
            />
            <Roster
                league={league}
                roster={{
                    ...oppRoster,
                    players: matchup_opp?.players || [],
                    starters: matchup_opp?.starters || []
                }}
                type={'secondary half'}
                previous={true}
                players_projections={players_projections}
                players_points={matchup_opp?.players_points}
                total_points={
                    secondaryContent2 === 'Lineup'
                        ? matchup_opp?.points
                        : proj_score_opp_optimal
                }
            />
        </>
        : <>
            <TableMain
                type={'secondary half'}
                headers={lineup_headers}
                body={lineup_body}
                itemActive={itemActive2}
                setItemActive={(value) => dispatch(setStateLineups({ itemActive2: value }, 'LINEUPS'))}
            />
            <TableMain
                type={'secondary half'}
                headers={subs_headers}
                body={subs_body}
            />
        </>
}

export default Matchup;