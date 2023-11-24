import { useDispatch, useSelector } from "react-redux";
import { setStateLeaguemates } from "../redux/actions";
import LeaguemateLeagues from "./LeaguemateLeagues";
import LeaguematePlayers from "./LeaguematePlayers";
import useFetchLmPlayerShares from "../../COMMON/services/hooks/useFetchLmPlayerShares";

const Leaguemates2 = ({ ...props }) => {
    const dispatch = useDispatch();
    const { secondaryContent } = useSelector(state => state.leaguemates);

    useFetchLmPlayerShares()

    return <>
        <div className="secondary nav">

                <button
                    className={secondaryContent === 'Leagues' ? 'active click' : 'click'}
                    onClick={() => dispatch(setStateLeaguemates({ secondaryContent: 'Leagues' }))}
                >
                    Leagues
                </button>
                <button
                    className={secondaryContent === 'Players-common' ? 'active click' : 'click'}
                    onClick={() => dispatch(setStateLeaguemates({ secondaryContent: 'Players-common' }))}
                >
                    Players <em className="small">(common leagues)</em>
                </button>
                <button
                    className={secondaryContent === 'Players-all' ? 'active click' : 'click'}
                    onClick={() => dispatch(setStateLeaguemates({ secondaryContent: 'Players-all' }))}
                    disabled={true}
                >
                    Players <em className="small">(all leagues)</em>
                </button>
   
        </div>
        {
            secondaryContent === 'Leagues'
                ? <LeaguemateLeagues {...props} />
                : <LeaguematePlayers {...props} />
        }
    </>
}
export default Leaguemates2;