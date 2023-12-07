import { useSelector, useDispatch } from "react-redux"
import { setState } from "../redux/actions"
import TableMain from "../../COMMON/components/TableMain";
import { filterLeagues } from "../../COMMON/services/helpers/filterLeagues";
import { getColumnValue } from '../services/helpers/getColumns';
import { useEffect } from "react";

const LeaguesCheck = ({ secondaryTable }) => {
    const dispatch = useDispatch();
    const { state } = useSelector(state => state.common);
    const { leagues, type1, type2 } = useSelector(state => state.user);
    const { column1, column2, column3, column4, page, itemActive, searched } = useSelector(state => state.leagues);
  

    const columnOptions = [
        'Open Roster',
        'Open Taxi',
        'Rank',
        'Trade Deadline'
    ];

    const headers = [
        [
            {
                text: 'League',
                colSpan: 6,
                rowSpan: 2
            },
            {
                text: <p className="select">

                    {column1}

                    <select
                        value={column1}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setState({ column1: e.target.value }))}
                    >
                        {
                            columnOptions
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select>
                </p>,
                colSpan: 2,
                className: 'relative'
            },
            {
                text: <p className="select">{column2}
                    <select
                        value={column2}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setState({ column2: e.target.value }))}
                    >
                        {
                            columnOptions
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select>
                </p>,
                colSpan: 2,
                className: 'relative'
            },
            {
                text: <p className="select">{column3}
                    <select
                        value={column3}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setState({ column3: e.target.value }))}
                    >
                        {
                            columnOptions
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select>
                </p>,
                colSpan: 2,
                className: 'relative'
            },
            {
                text: <p className="select">
                    <span>
                        {column4}
                    </span>
                    <select
                        value={column4}
                        className="hidden_behind click"
                        onChange={(e) => dispatch(setState({ column4: e.target.value }))}
                    >
                        {
                            columnOptions
                                .map(column => {
                                    return <option key={column}>{column}</option>
                                })
                        }
                    </select></p>,
                colSpan: 2,
                className: 'end',
                className: 'relative end'
            }
        ]
    ]

    const body = filterLeagues(leagues, type1, type2)
        .map(league => {

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
                        colSpan: 6,
                        className: 'left',
                        image: {
                            src: league.avatar,
                            alt: league.name,
                            type: 'league'
                        }
                    },
                    {
                        ...getColumnValue(column1, league, state)
                    },
                    {
                        ...getColumnValue(column2, league, state)
                    },
                    {
                        ...getColumnValue(column3, league, state)
                    },
                    {
                        ...getColumnValue(column4, league, state)
                    }
                ],
                secondary_table: secondaryTable({ league })
            }
        })

    return <>
        <TableMain
            type={'primary'}
            headers={headers}
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

export default LeaguesCheck;