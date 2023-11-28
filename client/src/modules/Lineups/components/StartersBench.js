import TableMain from "../../COMMON/components/TableMain";
import { useSelector, useDispatch } from "react-redux";
import { setStateLineups } from "../redux/actions";
import { filterLeagues } from "../../COMMON/services/helpers/filterLeagues";
import FilterIcons from "../../COMMON/components/FilterIcons";

const StartersBench = ({ secondaryTable }) => {
    const dispatch = useDispatch();
    const { allplayers, state } = useSelector(state => state.common);
    const { username, type1, type2 } = useSelector(state => state.user); 
    const { page, itemActive, searched, filters, playerLineupDict, sortBy } = useSelector(state => state.lineups);

    const players_headers = [
        [
            {
                text: 'Player',
                colSpan: 3,
                rowSpan: 2,
                className: 'half'
            },
            {
                text: username,
                colSpan: 2,
                className: 'half'
            },
            {
                text: 'Opp',
                colSpan: 2,
                className: 'half'
            }
        ],
        [
            {
                text: 'Start',
                colSpan: 1,
                onClick: () => dispatch(setStateLineups({ sortBy: 'start' })),
                className: 'half'
            },
            {
                text: 'Bench',
                colSpan: 1,
                onClick: () => dispatch(setStateLineups({ sortBy: 'bench' })),
                className: 'half'
            },
            {
                text: 'Start',
                colSpan: 1,
                onClick: () => dispatch(setStateLineups({ sortBy: 'start_opp' })),
                className: 'half'
            },
            {
                text: 'Bench',
                colSpan: 1,
                onClick: () => dispatch(setStateLineups({ sortBy: 'bench_opp' })),
                className: 'half'
            }
        ]
    ]

    console.log({playerLineupDict})

    const players_body = Object.keys(playerLineupDict)
        ?.filter(player_id => (
            (!searched.id || searched.id === player_id)
            && (
                filters.position === allplayers[player_id]?.position
                || filters.position.split('/').includes(allplayers[player_id]?.position?.slice(0, 1))
            ) && (
                filters.team === 'All' || allplayers[player_id]?.team === filters.team
            ) && (
                filters.draftClass === 'All' || parseInt(filters.draftClass) === (state.league_season - allplayers[parseInt(player_id)]?.years_exp)
            )
        ))
        ?.sort((a, b) => filterLeagues(playerLineupDict[b][sortBy], type1, type2).length - filterLeagues(playerLineupDict[a][sortBy], type1, type2).length)
        ?.map(player_id => {
            const start = filterLeagues(playerLineupDict[player_id]?.start || [], type1, type2)
            const bench = filterLeagues(playerLineupDict[player_id]?.bench || [], type1, type2)
            const start_opp = filterLeagues(playerLineupDict[player_id]?.start_opp || [], type1, type2)
            const bench_opp = filterLeagues(playerLineupDict[player_id]?.bench_opp || [], type1, type2)

            return {
                id: player_id,
                search: {
                    text: allplayers[player_id]?.full_name,
                    image: {
                        src: player_id,
                        alt: 'player',
                        type: 'player'
                    }
                },
                list: [
                    {
                        text: allplayers[player_id]?.full_name,
                        image: {
                            src: player_id,
                            alt: 'player',
                            type: 'player'
                        },
                        className: 'left',
                        colSpan: 3
                    },
                    {
                        text: start.length.toString(),
                        colSpan: 1,
                        className: 'check'
                    },
                    {
                        text: bench.length.toString(),
                        colSpan: 1,
                        className: 'check'
                    },
                    {
                        text: start_opp.length.toString(),
                        colSpan: 1,
                        className: 'check'
                    },
                    {
                        text: bench_opp.length.toString(),
                        colSpan: 1,
                        className: 'check'
                    }
                ],
                secondary_table: secondaryTable({
                    start,
                    bench,
                    start_opp,
                    bench_opp
                })
            }
        })

    return <TableMain
        type={'primary'}
        headers={players_headers}
        body={players_body}
        page={page}
        setPage={(value) => dispatch(setStateLineups({ page: value }))}
        itemActive={itemActive}
        setItemActive={(value) => dispatch(setStateLineups({ itemActive: value }))}
        search={true}
        searched={searched}
        setSearched={(value) => dispatch(setStateLineups({ searched: value }))}
        options1={[
            <FilterIcons
                type={'team'}
                filterTeam={filters.team}
                setFilterTeam={(value) => dispatch(setStateLineups({ filters: {...filters, team: value} }))}
            />
        ]}
        options2={[
            <FilterIcons
                type={'position'}
                filterPosition={filters.position}
                setFilterPosition={(value) => dispatch(setStateLineups({ filters: { ...filters, position: value } }))}
                picks={false}
            />
        ]}
    />
}

export default StartersBench;