import React, { useEffect, useState } from 'react'

import LeagueTable from '../LeagueTable/LeagueTable';





function CalculateLeague({data}) {


    // (async () => {
    //     if (matchday != undefined) {
    //         // sentData = await data[data.length - 1];
    //         // await console.log(sentData);
    //         // await setData(data[data.length - 1])
    //     } else {
    //         // setData(data[data.])
    //     }
    // })()


    return (
        // <p></p>  
        // setMatchday={setMatchday}      
        <LeagueTable data={data}  />
    )

}

export default CalculateLeague