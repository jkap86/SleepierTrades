import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLmPlayerShares } from "../../redux/actions";

const useFetchLmPlayerShares = () => {
    const dispatch = useDispatch();
    const { user_id, lmplayershares } = useSelector(state => state.user);
    const { tabSecondary } = useSelector(state => state.players);

    useEffect(() => {
        if (user_id && !lmplayershares && tabSecondary === 'Leaguemate Shares') {
            dispatch(fetchLmPlayerShares(user_id))
        }
    }, [user_id, lmplayershares, tabSecondary, dispatch])

}

export default useFetchLmPlayerShares