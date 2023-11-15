import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import sleeperLogo from '../../../images/sleeper_icon.png';
import Dropdown from '../../COMMON/components/Dropdown/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { setState, fetchMostLeagues } from '../redux/actions';
import { resetState } from '../../COMMON/redux/actions';
import useHandleModal from '../../COMMON/services/hooks/useHandleModal';
import './Home.css';

const Home = () => {
    const dispatch = useDispatch();
    const { username_searched, leagueId, tab, dropdownVisible, dropdownOptions } = useSelector(state => state.home);
    const modalRef = useRef()


    useEffect(() => {
        dispatch(resetState())
    }, [])

    useEffect(() => {
        dispatch(fetchMostLeagues())
    }, [])


    useHandleModal(modalRef, () => dispatch(setState({ dropdownVisible: false })));

    return <div id='homepage'>
        <div className='picktracker'>
            <p className="home click" onClick={() => dispatch(setState({ tab: tab === 'username' ? 'picktracker' : 'username' }))}>
                picktracker
            </p>
            {
                tab === 'picktracker' ?
                    <>
                        <input
                            onChange={(e) => dispatch(setState({ leagueId: e.target.value }))}
                            className='picktracker'
                            placeholder='League ID'
                        />
                        <Link className='home' to={`/picktracker/${leagueId}`}>

                            Submit
                        </Link>
                    </>
                    : null
            }

        </div>

        <div className='home_wrapper'>
            <img
                alt='sleeper_logo'
                className='home'
                src={sleeperLogo}
            />
            <div className='home_title'>
                <strong className='home'>
                    Sleepier
                </strong>
                <div className='user_input'>

                    <input
                        className='home'
                        type="text"
                        placeholder="Username"
                        onChange={(e) => dispatch(setState({ username_searched: e.target.value }))}
                    />

                    <i className="fa-solid fa-ranking-star" onClick={() => dispatch(setState({ dropdownVisible: true }))}></i>
                </div>
                <Link className='link click' to={(username_searched === '') ? '/' : `/${username_searched}/players`}>
                    Submit
                </Link>
            </div>
            {
                dropdownVisible && dropdownOptions.length > 0 ?
                    <Dropdown
                        dropdownOptions={dropdownOptions}
                        ref={modalRef}
                        visibleState={dropdownVisible}
                        setState={setState}
                    />
                    :
                    null
            }


        </div>
    </div>
}

export default Home;