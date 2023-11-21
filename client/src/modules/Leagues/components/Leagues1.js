import Records from "./Records";
import useFetchUserInfo from "../../COMMON/services/hooks/useFetchUserInfo";

const Leagues1 = ({ secondaryTable }) => {

    useFetchUserInfo()

    return <Records
        secondaryTable={secondaryTable}
    />


}

export default Leagues1;