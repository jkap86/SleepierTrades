import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../../redux/actions";
import { fetchUser, fetchLeagues } from "../../redux/actions";
import { fetchCommon } from "../../redux/actions";

const useFetchUserInfo = (to_fetch_array) => {
    const dispatch = useDispatch();
    const params = useParams();
    const { user_id, isLoadingUser, username, leagues, isLoadingLeagues } = useSelector(state => state.user);
    const { allplayers } = useSelector(state => state.common);

    useEffect(() => {
        if (username && username?.toLowerCase() !== params.username?.toLowerCase()) {
            dispatch(resetState());
        }
    }, [dispatch, username, params.username])


    useEffect(() => {
        if (!user_id && !isLoadingUser) {
            dispatch(fetchUser(params.username))
        }
    }, [dispatch, user_id, params.username, isLoadingUser])

    useEffect(() => {
        if (user_id && !leagues && !isLoadingLeagues) {
            dispatch(fetchLeagues(user_id));
        }
    }, [dispatch, user_id, leagues, isLoadingLeagues]);

    useEffect(() => {
        if (leagues) {
            if (!allplayers) {
                dispatch(fetchCommon('allplayers'))
            }

        }
    }, [dispatch, allplayers, leagues])


}

export default useFetchUserInfo;