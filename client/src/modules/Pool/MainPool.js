import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { fetchCommon } from "../COMMON/redux/actions";
import HeadingPool from './HeadingPool';
import StandingsPool from "./StandingsPool";
import './Pool.css';

const MainPool = ({ pool, title, startSeason }) => {
    const dispatch = useDispatch();
    const [stateState, setStateState] = useState({});
    const [stateStandings, setStateStandings] = useState()
    const [stateSeason, setStateSeason] = useState(new Date().getFullYear())
    const { allplayers: stateAllPlayers } = useSelector(state => state.common);

    useEffect(() => {
        const fetchData = async () => {
            const home_data = await axios.get('/pools/home')


            setStateState(home_data.data.state)

        }

        fetchData()

    }, [])

    useEffect(() => {
        // Fetch allplayers, schedule, projections only on load if they don't exist

        if (!stateAllPlayers) {
            dispatch(fetchCommon('allplayers'));
        };
    }, [])

    useEffect(() => {
        const fetchStandings = async () => {
            const standings = await axios.post(`/pools/${pool}`, {
                season: stateSeason
            })
            setStateStandings(standings.data)
        }
        fetchStandings()
    }, [stateSeason])


    return <>
        <Link to={'/'} className='home' target={'_blank'}>
            Home
        </Link>
        <HeadingPool
            state={stateState}
            stateSeason={stateSeason}
            setStateSeason={setStateSeason}
            title={title}
            startSeason={startSeason}
            pool={pool}
        />
        <StandingsPool
            stateAllPlayers={stateAllPlayers}
            state={stateState}
            stateStandings={stateStandings}
        />
    </>
}

export default MainPool;