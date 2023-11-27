import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLmPlayerShares } from "../../redux/actions";

const useFetchLmPlayerShares = () => {
    const dispatch = useDispatch();
    const { user_id, leagues, lmplayershares } = useSelector(state => state.user);
    const { tabSecondary } = useSelector(state => state.players);

    console.log({ lmplayershares })

    useEffect(() => {
        if (user_id && leagues && tabSecondary === 'Leaguemate Shares' && !lmplayershares) {
            dispatch(fetchLmPlayerShares(user_id))
        }
    }, [user_id, leagues, lmplayershares, tabSecondary, dispatch])

}

export default useFetchLmPlayerShares