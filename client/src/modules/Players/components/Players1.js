import Records from "./Records";
import useFetchPlayerShares from "../../COMMON/services/hooks/useFetchPlayerShares";
import useFetchLmPlayerShares from "../../COMMON/services/hooks/useFetchLmPlayerShares";

const Players1 = ({ secondaryTable }) => {




    useFetchPlayerShares();

    useFetchLmPlayerShares();

    return <>
        <Records
            secondaryTable={secondaryTable}
        />
    </>
};

export default Players1;