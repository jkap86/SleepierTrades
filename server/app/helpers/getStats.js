const axios = require("../api/axiosInstance");
const fs = require('fs');


const getStats = async (season, week) => {


    for (let i = week; i <= week; i++) {
        const projections_json = fs.readFileSync('./projections.json', 'utf-8')

        try {

            const projections_week = JSON.parse(projections_json).filter(p => p.week === i);


            console.log("Updating stats for week " + i)

            for (const position of ['QB', 'RB', 'WR', 'TE']) {
                const stats_week = await axios.get(`https://api.sleeper.com/stats/nfl/${season}/${i}?season_type=regular&position[]=${position}&order_by=ppr`)

                stats_week.data
                    .filter(p => p.stats.pts_ppr)
                    .forEach(stat_object => {
                        const projection_object = projections_week.find(p => p.player_id === stat_object.player_id)

                    
                        if (projection_object) {
                            projection_object.stats = stat_object.stats;

                        } else {
                            projections_week.push({
                                week: i,
                                player_id: stat_object.player_id,
                                injury_status: stat_object.player.injury_status,
                                stats: stat_object.stats,
                                projection: {}
                            })
                        }
                    })

            };


            fs.writeFileSync('./projections.json', JSON.stringify(
                [
                    ...JSON.parse(projections_json).filter(p => p.week !== i),
                    ...projections_week
                ]
            ))
            
            console.log('stats update complete...')
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = {
    getStats: getStats
}