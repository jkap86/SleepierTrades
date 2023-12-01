import LineupChecks from "./LineupChecks";
import StartersBench from "./StartersBench";
import useGetLineupChecks from "../services/useGetLineupChecks";
import { useSelector } from "react-redux";

const Linups1 = ({ secondaryTable }) => {
    const { primaryContent } = useSelector(state => state.lineups);


    useGetLineupChecks()

    return primaryContent === 'Starters/Bench'
        ? <StartersBench secondaryTable={secondaryTable} />
        : <LineupChecks secondaryTable={secondaryTable} />
}

export default Linups1;