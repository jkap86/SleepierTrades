import LineupCheck from "./LineupCheck";
import PlayerStartBench from "./PlayerStartBench";
import { useSelector } from "react-redux";


const Lineups2 = ({secondaryTable, ...props }) => {
    const { primaryContent } = useSelector(state => state.lineups);

    return primaryContent === 'Lineup Check'
        ? <LineupCheck {...props} />
        : <PlayerStartBench {...props} secondaryTable={secondaryTable} />
}

export default Lineups2;