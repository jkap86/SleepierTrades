import { useSelector, useDispatch } from "react-redux";
import { setStateTrades } from "../redux/actions";
import Standings from '../../COMMON/components/Standings';
import TradeTips from "./TradeTips";

const Trades2 = ({ ...props }) => {
    const dispatch = useDispatch();
    const { tabSecondary } = useSelector(state => state.trades);


    return <>
        <div className="secondary nav">
            <button
                className={tabSecondary === 'Leads' ? 'active click' : 'click'}
                onClick={() => dispatch(setStateTrades({ tabSecondary: 'Leads' }))}
            >
                Leads
            </button>
            <button
                className={tabSecondary === 'Rosters' ? 'active click' : 'click'}
                onClick={() => dispatch(setStateTrades({ tabSecondary: 'Rosters' }))}
            >
                Rosters
            </button>
        </div>
        {
            tabSecondary === 'Rosters'
                ? <Standings {...props} />
                : <TradeTips  {...props} />
        }
    </>
}

export default Trades2;