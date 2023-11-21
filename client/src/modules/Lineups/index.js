import Lineups1 from "./components/Lineups1";
import Lineups2 from "./components/Lineups2";

const Lineups = () => {

    return <Lineups1 
        secondaryTable={
            (props) => {
                return <Lineups2
                    {...props}
                />
            }
        }
    />;
}

export default Lineups;