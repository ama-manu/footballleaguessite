import React, { useEffect, useState } from 'react'

import LeagueTable from '../LeagueTable/LeagueTable';

function CalculateLeague({ data }) {
    const [matchday, setMatchday] = useState(undefined);
    const [sentData, setSentData] = useState(null);

    const updateMatchday = (md) => {
        setMatchday(md);
    }

    useEffect(() => {
        console.log(matchday);
        const selectMatchdayFromData = async () => {
            try {
                var tempData;
                if (matchday != undefined) {
                    tempData = await data.at(matchday);
                } else {
                    tempData = await data.at(-1);

                }
                setSentData(tempData);
            } catch (error) {
                console.error("Error calculating league data: ", error);
            }
        };

        selectMatchdayFromData();
    }, [data, matchday]);





    return (
        // <p></p>  
        // setMatchday={setMatchday}      
        <>
            {/* <button onClick={() => setMatchday(5)}>HALLLOOO</button> */}
            <LeagueTable data={sentData} setMatchday={updateMatchday} />
        </>
    )

}

export default CalculateLeague