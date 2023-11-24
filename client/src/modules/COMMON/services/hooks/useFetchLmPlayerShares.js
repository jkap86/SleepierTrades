import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLmPlayerShares } from "../../redux/actions";

const useFetchLmPlayerShares = () => {
    const dispatch = useDispatch();
    const { user_id, leagues, lmplayershares } = useSelector(state => state.user);

    console.log({lmplayershares})

    useEffect(() => {
        if (user_id && leagues && !lmplayershares) {
            dispatch(fetchLmPlayerShares(user_id))
        }
    }, [user_id, leagues, lmplayershares, dispatch])

}

export default useFetchLmPlayerShares