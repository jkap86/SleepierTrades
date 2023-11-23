import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLmPlayerShares } from "../../redux/actions";

const useFetchLmPlayerShares = () => {
    const dispatch = useDispatch();
    const { user_id, lmplayershares } = useSelector(state => state.user);

    console.log({lmplayershares})

    useEffect(() => {
        if (user_id && !lmplayershares) {
            dispatch(fetchLmPlayerShares(user_id))
        }
    }, [user_id, lmplayershares, dispatch])

}

export default useFetchLmPlayerShares