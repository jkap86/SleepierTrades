import axios from "axios";

export const setStateUser = (state_obj) => ({
    type: `SET_STATE_USER`,
    payload: state_obj
})

export const setStateCommon = (state_obj) => ({
    type: `SET_STATE_COMMON`,
    payload: state_obj
})

export const resetState = () => ({
    type: 'RESET_STATE'
});

export const fetchCommon = (item) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_COMMON_START', payload: { item: item } });

        try {
            const main = await axios.get(`/main/${item}`);

            if (item === 'projections') {
                console.log(main.data[0].filter(d => d.week === 4 && d.player_id === '8135'))
            }
            const data = item !== 'projections' ? main.data[0] : main.data[0].reduce((result, item) => {
                const { week, player_id, injury_status, ...stats } = item;

                if (!result[week]) {
                    result[week] = {};
                }

                result[week][player_id] = {
                    ...stats,
                    injury_status: injury_status
                };
                return result;
            }, {})

            dispatch({
                type: 'FETCH_COMMON_SUCCESS', payload: {
                    item: item,
                    data: data
                }
            });

        } catch (error) {
            dispatch({ type: 'FETCH_COMMON_FAILURE', payload: error.message });

            console.error(error.message)
        }
    }
}

export const fetchUser = (username) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_USER_START' });

        try {
            const user = await axios.get('/user/create', {
                params: { username: username }
            });

            console.log(user.data)

            if (!user.data?.error) {
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: user.data.user });

                dispatch({ type: 'SET_STATE_COMMON', payload: { state: user.data.state } });

                const week_lc = user.data.state.season_type === 'regular'
                    ? user.data.state.leg
                    : user.data.state.season_type.includes('post')
                        ? 19
                        : 1

                dispatch({ type: 'SET_STATE_LINEUPS', payload: { week: week_lc } });
            } else {
                dispatch({ type: 'FETCH_USER_FAILURE', payload: user.data });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_USER_FAILURE', payload: error.message });
        }
    };
};

export const fetchLeagues = (user_id) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_LEAGUES_START' })

        try {
            const response = await fetch(`/league/find?user_id=${encodeURIComponent(user_id)}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (response.ok) {
                const reader = response.body.getReader();

                let leagues = ''

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;


                    leagues += new TextDecoder().decode(value);

                    const matches = leagues.match(/"league_id":/g);

                    let count = 0;

                    if (matches && matches.length > 0) {
                        count = matches.length
                    }

                    dispatch({ type: 'SET_STATE_PROGRESS', payload: { progress: count } })
                }

                let parsed_leagues;
                try {
                    parsed_leagues = JSON.parse(leagues)
                } catch (error) {
                    console.log(error)
                }
                console.log(parsed_leagues)

                dispatch({ type: 'FETCH_LEAGUES_SUCCESS', payload: parsed_leagues.flat() });

            } else {
                dispatch({ type: 'FETCH_LEAGUES_FAILURE', payload: 'Failed to fetch user leagues' });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_LEAGUES_FAILURE', payload: error.message });
        }
    }
}

export const fetchLmPlayerShares = (user_id) => async (dispatch) => {
    dispatch({ type: 'SET_STATE_USER', payload: { isLoadingPS: true } });

    try {
        const lmplayershares = await axios.get('/user/lmplayershares', {
            params: { user_id: user_id }
        });

        console.log({ lmplayershares: lmplayershares.data.sort((a, b) => a.username > b.username ? 1 : -1) })

        dispatch({ type: 'SET_STATE_USER', payload: { lmplayershares: lmplayershares.data, isLoadingPS: false } });
    } catch (err) {
        dispatch({ type: 'SET_STATE_USER', payload: { isLoadingPS: false, errorPS: err.message } });
    }
}

export const fetchPlayerValues = (player_ids) => {
    return async (dispatch) => {
        try {
            const pv = await axios.post('/main/playervalues', {
                player_ids: player_ids
            })

            const values_dict = {};

            pv.data
                .forEach(value_obj => {
                    if (!values_dict[value_obj.date]) {
                        values_dict[value_obj.date] = {};
                    }

                    if (!values_dict[value_obj.date][value_obj.player_id]) {
                        values_dict[value_obj.date][value_obj.player_id] = {}
                    }


                    values_dict[value_obj.date][value_obj.player_id][value_obj.type] = value_obj.value
                })

            dispatch({ type: 'SET_STATE_COMMON', payload: { values: values_dict } })
        } catch (err) {
            console.log(err)
        }

    }
}