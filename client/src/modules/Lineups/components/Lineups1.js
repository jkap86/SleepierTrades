import LineupCheck from "./LineupCheck";
import useGetLineupChecks from "../services/useGetLineupChecks";


const Linups1 = () => {

    useGetLineupChecks()

    return <LineupCheck />
}

export default Linups1;