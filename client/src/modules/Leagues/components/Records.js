import { useDispatch, useSelector } from "react-redux";
import { filterLeagues } from '../../COMMON/services/helpers/filterLeagues';
import { getProjection } from "../../COMMON/services/helpers/getProjection";
import { getTrendColor } from "../../COMMON/services/helpers/getTrendColor";
import { setState } from "../redux/actions";
import TableMain from '../../COMMON/components/TableMain';
import { getUserRoster } from "../../COMMON/services/helpers/getUserRoster";

const Records = ({
    secondaryTable
}) => {
    const dispatch = useDispatch();
    const { user_id, leagues, type1, type2 } = useSelector(state => state.user);
    const { page, itemActive, itemActive2, searched } = useSelector(state => state.leagues);



    const leagues_headers = [
        [
            {
                text: 'League',
                colSpan: 5
            },
            {
                text: 'Record',
                colSpan: 4
            },
            {
                text: 'FP',
                colSpan: 3
            },
            {
                text: 'FPA',
                colSpan: 3
            },
            {
                text: 'Rank',
                colSpan: 2
            }
        ]
    ];

    const body = filterLeagues(leagues, type1, type2)
        .map(league => {


            const rank = getUserRoster(league.rosters, user_id)?.rank;

            const record = {
                wins: league.userRoster.settings.wins,
                losses: league.userRoster.settings.losses,
                ties: league.userRoster.settings.ties,
                fpts: parseFloat(league.userRoster.settings.fpts + '.' + league.userRoster.settings.fpts_decimal),
                fpts_against: parseFloat(league.userRoster.settings.fpts_against + '.' + league.userRoster.settings.fpts_against_decimal)
            }

            return {
                id: league.league_id,
                search: {
                    text: league.name,
                    image: {
                        src: league.avatar,
                        alt: 'league avatar',
                        type: 'league'
                    }
                },
                list: [
                    {
                        text: league.name,
                        colSpan: 5,
                        className: 'left',
                        image: {
                            src: league.avatar,
                            alt: league.name,
                            type: 'league'
                        }
                    },
                    {
                        text: `${record?.wins?.toString() || ''}-${record?.losses?.toString() || ''}`
                            + (league.userRoster.settings.ties > 0 ? `-${league.userRoster.settings.ties}` : ''),
                        colSpan: 2
                    },
                    {
                        text: (record?.wins + record?.losses > 0 ?
                            (record?.wins / (record?.wins + record?.losses))
                            :
                            '--'
                        ).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 }),
                        colSpan: 2
                    },
                    {
                        text: record.fpts?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                        colSpan: 3
                    },
                    {
                        text: record.fpts_against?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                        colSpan: 3
                    },
                    {
                        text: <p
                            className={(rank / league.rosters.length) < .5 ? 'green stat' :
                                (rank / league.rosters.length) > .5 ? 'red stat' :
                                    'stat'}
                            style={getTrendColor(-((rank / league.rosters.length) - .5), .0025)}
                        >
                            {rank || '-'}
                        </p>,
                        colSpan: 2,
                    }
                ],
                secondary_table: secondaryTable({ league })
            }
        })


    console.log({ body })

    return <>

        <TableMain
            id={'Leagues'}
            type={'primary'}
            headers={leagues_headers}
            body={body}
            page={page}
            setPage={(value) => dispatch(setState({ page: value }))}
            itemActive={itemActive}
            setItemActive={(value) => dispatch(setState({ itemActive: value }))}
            searched={searched}
            setSearched={(value) => dispatch(setState({ searched: value }))}
        />
    </>
}

export default Records;