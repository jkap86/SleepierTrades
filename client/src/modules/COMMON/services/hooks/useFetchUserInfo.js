import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetState } from "../../redux/actions";
import { fetchUser, fetchLeagues } from "../../redux/actions";
import { fetchCommon } from "../../redux/actions";

const useFetchUserInfo = (to_fetch_array) => {
    const dispatch = useDispatch();
    const params = useParams();
    const { user_id, username, leagues } = useSelector(state => state.user);
    const { allplayers } = useSelector(state => state.common);

    useEffect(() => {
        if (username && username?.toLowerCase() !== params.username?.toLowerCase()) {
            dispatch(resetState());
        }
    }, [dispatch, username, params.username])


    useEffect(() => {
        if (!user_id) {
            dispatch(fetchUser(params.username))
        }
    }, [dispatch, user_id, params.username])

    useEffect(() => {
        if (user_id && !leagues) {
            dispatch(fetchLeagues(user_id));
        }
    }, [dispatch, user_id, leagues]);

    useEffect(() => {
        if (leagues) {
            if (!allplayers) {
                dispatch(fetchCommon('allplayers'))
            }

        }
    }, [dispatch, allplayers, leagues])


}

export default useFetchUserInfo;