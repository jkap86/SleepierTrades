import axios from 'axios';

export const setState = (state_obj) => ({
    type: `SET_STATE_HOME`,
    payload: state_obj
})

export const fetchMostLeagues = () => {
    return async (dispatch) => {
        try {
            const users = await axios.get('user/findmostleagues')

            dispatch({ type: 'SET_STATE_HOME', payload: { dropdownOptions: users.data } })
        } catch (error) {
            console.log(error)
        }
    }
}

