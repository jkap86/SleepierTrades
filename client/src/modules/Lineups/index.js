import Lineups1 from "./components/Lineups1";
import Lineups2 from "./components/Lineups2";
import RecordsHeader from "./components/RecordsHeader";
import './components/Lineups.css';

const Lineups = () => {

    return <>
        <RecordsHeader />
        <Lineups1
            secondaryTable={
                (props) => {
                    return <Lineups2
                        {...props}
                    />
                }
            }
        />
    </>;
}

export default Lineups;