import LineupCheck from "./LineupCheck";
import PlayerStartBench from "./PlayerStartBench";
import { useSelector } from "react-redux";


const Lineups2 = ({secondaryTable, ...props }) => {
    const { primaryContent } = useSelector(state => state.lineups);

    return primaryContent === 'Starters/Bench'
        ? <PlayerStartBench {...props} secondaryTable={secondaryTable} />
        : <LineupCheck {...props} />
}

export default Lineups2;