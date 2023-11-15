import TableMain from "../../COMMON/components/TableMain";
import { useSelector, useDispatch } from 'react-redux';
import { getTrendColor } from "../../COMMON/services/helpers/getTrendColor";
import headshot from '../../../images/headshot.png';
import { filterLeagues } from '../../COMMON/services/helpers/filterLeagues';
import { setStatePlayers } from "../redux/actions";

const Records = ({ secondaryTable }) => {
    const dispatch = useDispatch();
    const { userPlayerShares, type1, type2 } = useSelector(state => state.user);
    const { state, allplayers } = useSelector(state => state.common);
    const { page, itemActive, searched, filters, sortBy } = useSelector(state => state.players);


    const playerShares_headers = [
        [
            {
                text: 'Player',
                colSpan: 10,

            },
            {
                text: 'Owned',
                colSpan: 5,
            },
            {
                text: 'Record',
                colSpan: 4
            },
            {
                text: 'Win %',
                colSpan: 4
            }
        ]
    ]

    const playerShares_body = (userPlayerShares || [])

        ?.filter(x => x
            &&
            (
                x.id.includes(' ') || allplayers?.[x.id]
            ) && (
                !searched?.id || searched?.id === x.id
            ) && (
                filters.position === allplayers?.[x.id]?.position
                || filters.position.split('/').includes(allplayers?.[x.id]?.position?.slice(0, 1))
                || (
                    filters.position === 'Picks' && x.id?.includes(' ')
                )
            ) && (
                filters.team === 'All' || allplayers?.[x.id]?.team === filters.team
            ) && (
                filters.draftClass === 'All' || parseInt(filters.draftClass) === (state.league_season - allplayers?.[parseInt(x.id)]?.years_exp)
            )
        )

        .map(player => {
            let pick_name;
            let ktc_name;

            if (player.id?.includes('_')) {
                const pick_split = player.id.split('_')
                pick_name = `${pick_split[0]} ${pick_split[1]}.${pick_split[2].toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                ktc_name = `${pick_split[0]} ${parseInt(pick_split[2]) <= 4 ? 'Early' : parseInt(pick_split[2]) >= 9 ? 'Late' : 'Mid'} ${pick_split[1]}`
            }

            const leagues_owned = filterLeagues(player.leagues_owned, type1, type2);
            const leagues_taken = filterLeagues(player.leagues_taken, type1, type2);
            const leagues_available = filterLeagues(player.leagues_available, type1, type2);

            const record_dict = leagues_owned.reduce((acc, cur) => {
                return {
                    wins: acc.wins + (cur.userRoster.settings.wins || 0),
                    losses: acc.losses + (cur.userRoster.settings.losses || 0),
                    ties: acc.ties + (cur.userRoster.settings.ties || 0),
                    fp: acc.fp + parseFloat((cur.userRoster.settings.fpts || 0) + '.' + (cur.userRoster.settings.fpts_decimal || 0)),
                    fpa: acc.fp + parseFloat((cur.userRoster.settings.fpts_against || 0) + '.' + (cur.userRoster.settings.fpts_against_decimal || 0)),
                }
            }, {
                wins: 0,
                losses: 0,
                ties: 0,
                fp: 0,
                fpa: 0
            });

            const record = `${record_dict.wins}-${record_dict.losses}` + (record_dict.ties > 0 ? `-${record_dict.ties}` : '')
            const winpct = record_dict.wins + record_dict.losses + record_dict.ties > 0
                ? (record_dict.wins / (record_dict.wins + record_dict.losses + record_dict.ties)).toFixed(4)
                : '-'

            const record_dict_lm = leagues_taken.reduce((acc, cur) => {
                return {
                    wins: acc.wins + (cur.lmRoster.settings.wins || 0),
                    losses: acc.losses + (cur.lmRoster.settings.losses || 0),
                    ties: acc.ties + (cur.lmRoster.settings.ties || 0),
                    fp: acc.fp + parseFloat((cur.lmRoster.settings.fpts || 0) + '.' + (cur.userRoster.settings.fpts_decimal || 0)),
                    fpa: acc.fp + parseFloat((cur.lmRoster.settings.fpts_against || 0) + '.' + (cur.userRoster.settings.fpts_against_decimal || 0)),
                }
            }, {
                wins: 0,
                losses: 0,
                ties: 0,
                fp: 0,
                fpa: 0
            });

            const record_lm = `${record_dict_lm.wins}-${record_dict_lm.losses}` + (record_dict_lm.ties > 0 ? `-${record_dict_lm.ties}` : '')
            const winpct_lm = record_dict_lm.wins + record_dict_lm.losses + record_dict_lm.ties > 0
                ? (record_dict_lm.wins / (record_dict_lm.wins + record_dict_lm.losses + record_dict_lm.ties)).toFixed(4)
                : '-'

            const player_id = player.id
            return {
                id: player.id,
                owned: leagues_owned?.length || 0,
                winpct_user: parseFloat(winpct) || 0,
                winpct_lm: parseFloat(winpct_lm) || 0,
                search: {
                    text: (allplayers?.[player.id] && `${allplayers?.[player.id]?.full_name} ${allplayers?.[player.id]?.position} ${allplayers?.[player.id]?.team || 'FA'}`) || pick_name,
                    image: {
                        src: player.id,
                        alt: 'player photo',
                        type: 'player'
                    }
                },
                list: [
                    {
                        text: player.id?.includes('_') ? pick_name : `${allplayers?.[player.id]?.position} ${allplayers?.[player.id]?.full_name} ${player.id?.includes('_') ? '' : allplayers?.[player.id]?.team || 'FA'}` || `INACTIVE PLAYER`,
                        colSpan: 10,
                        className: 'left',
                        image: {
                            src: allplayers?.[player.id] ? player.id : headshot,
                            alt: allplayers?.[player.id]?.full_name || player.id,
                            type: 'player'
                        }
                    },
                    {
                        text: leagues_owned?.length.toString(),
                        colSpan: 2
                    },
                    {
                        text: < em >
                            {((leagues_owned?.length / (leagues_owned.length + leagues_available.length + leagues_available.length)) * 100).toFixed(1) + '%'}
                        </em >,
                        colSpan: 3
                    },
                    {
                        text: <p
                            className="stat"
                            style={getTrendColor(winpct - .5, .0005)}
                        >
                            {record}
                        </p>,
                        colSpan: 4,
                        className: "stat"
                    },
                    {
                        text: <p
                            className="stat"
                            style={getTrendColor(winpct - .5, .0005)}
                        >
                            {winpct}
                        </p>,
                        colSpan: 4,
                        className: "stat"

                    },
                    {
                        text: <p
                            className="stat"
                            style={getTrendColor(winpct_lm - .5, .0005)}
                        >
                            {record_lm}
                        </p>,
                        colSpan: 4,
                        className: "stat"
                    },
                    {
                        text: <p
                            className="stat"
                            style={getTrendColor(winpct_lm - .5, .0005)}
                        >
                            {winpct_lm}
                        </p>,
                        colSpan: 4,
                        className: "stat"

                    }
                ],
                secondary_table: (
                    secondaryTable({ leagues_owned, leagues_taken, leagues_available, player_id })
                )
            }
        })

        .sort((a, b) => (
            sortBy === 'Owned' && b.owned - a.owned
        ) || (sortBy === 'winpct_user' && b.winpct_user - a.winpct_user)
            || (sortBy === 'winpct_lm' && b.winpct_lm - a.winpct_lm)
        )


    return <>
        <TableMain
            id={'Players'}
            type={'primary'}
            headers={playerShares_headers}
            body={playerShares_body}
            page={page}
            setPage={(value) => dispatch(setStatePlayers({ page: value }))}
            itemActive={itemActive}
            setItemActive={(value) => dispatch(setStatePlayers({ itemActive: value }))}
            searched={searched}
            setSearched={(value) => dispatch(setStatePlayers({ searched: value }))}
        />
    </>
}

export default Records;