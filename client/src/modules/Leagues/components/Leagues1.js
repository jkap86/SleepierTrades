import Records from "./Records";
import useFetchUserInfo from "../../COMMON/services/hooks/useFetchUserInfo";
import { setState } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import LeaguesCheck from "./LeaguesCheck";

const Leagues1 = ({ secondaryTable }) => {
    const dispatch = useDispatch();
    const { primaryContent } = useSelector(state => state.leagues);

    useFetchUserInfo()

    return <>
        <h2>
            <select
                value={primaryContent}
                onChange={(e) => dispatch(setState({ primaryContent: e.target.value }))}
                className="active click"

            >
                <option>Records</option>
                <option>Checks</option>
            </select>
        </h2 >
        {
            primaryContent === 'Records'
                ? <Records
                    secondaryTable={secondaryTable}
                />
                : <LeaguesCheck
                    secondaryTable={secondaryTable}
                />
        }
    </>

}

export default Leagues1;