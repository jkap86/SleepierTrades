import LineupChecks from "./LineupChecks";
import useGetLineupChecks from "../services/useGetLineupChecks";


const Linups1 = ({secondaryTable}) => {

    useGetLineupChecks()

    return <LineupChecks secondaryTable={secondaryTable} />
}

export default Linups1;