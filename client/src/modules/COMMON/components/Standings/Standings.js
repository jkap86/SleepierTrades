import TableMain from "../TableMain";
import { useDispatch } from "react-redux";
import Roster from "../Roster";
import { useState } from "react";

const Standings = ({ league }) => {
    const dispatch = useDispatch();
    const [itemActive2, setItemActive2] = useState('')


    const active_roster = league.rosters.find(x => x.roster_id === itemActive2);

    const standings = league.rosters
        ?.map(roster => {
            return {
                roster_id: roster.roster_id,
                username: roster.username,
                avatar: roster.avatar,
                wins: roster.settings.wins,
                losses: roster.settings.losses,
                ties: roster.settings.ties,
                fpts: parseFloat(roster.settings.fpts + '.' + roster.settings.fpts_decimal),
                fpts_against: parseFloat(roster.settings.fpts_against + '.' + roster.settings.fpts_against_decimal)
            }
        })
        ?.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts)

    const standings_headers = [
        [
            {
                text: 'Manager',
                colSpan: 5,
            },
            {
                text: 'Record',
                colSpan: 2,
            },
            {
                text: 'FP',
                colSpan: 3
            }
        ]
    ];

    const standings_body = standings
        ?.map((team, index) => {
            const record = standings.find(s => s.roster_id === team.roster_id)
            return {
                id: team.roster_id,
                list: [
                    {
                        text: team.username || 'Orphan',
                        colSpan: 5,
                        className: 'left',
                        image: {
                            src: team.avatar,
                            alt: 'user avatar',
                            type: 'user'
                        }
                    },
                    {
                        text: `${record.wins}-${record.losses}${record.ties > 0 ? `-${record.ties}` : ''}`,
                        colSpan: 2
                    },
                    {
                        text: (record.fpts).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
                        colSpan: 3
                    }
                ]
            }
        });


    const leagueInfo_headers = [[]]

    const leagueInfo_body = []
    return <>
        <TableMain
            type={'secondary half'}
            headers={standings_headers}
            body={standings_body}
            itemActive={itemActive2}
            setItemActive={(value) => setItemActive2(value)}
        />
        {
            active_roster
                ? <Roster
                    type={'secondary half'}
                    league={league}
                    roster={active_roster}
                    module={'Leagues'}
                />
                : <TableMain
                    type={'secondary half'}
                    headers={leagueInfo_headers}
                    body={leagueInfo_body}
                />
        }
    </>
}

export default Standings;