import Trades1 from "./components/Trades1";
import Trades2 from "./components/Trades2";
import Trades3 from "./components/Trades3";

const Trades = () => {
    return <Trades1
        secondaryTable={
            (props) => {
                return <Trades2
                    {...props}
                    secondaryTable={
                        (props2) => {
                            return <Trades3
                                {...props2}
                            />
                        }
                    }
                />
            }
        }
    />
}

export default Trades;