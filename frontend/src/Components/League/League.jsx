import React, { useEffect, useState } from 'react'

import LeagueTable from '../LeagueTable/LeagueTable';

function League({ data }) {
    const [matchday, setMatchday] = useState(undefined);
    const [sentData, setSentData] = useState(null);
    var dropdownMenu = [];
    var defaultOption = undefined;
    var dataLength = 0;

    const updateMatchday = (md) => {
        setMatchday(md);
    }

    useEffect(() => {
        // console.log(matchday);
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

        // (async () => {
        //     // dropdown menu
        //     // console.log(await data.length);
        //     // dataLength = await data.length;
        //     // for (var i = 1; i <= await dataLength; i++) {
        //     //     await dropdownMenu.push({
        //     //         value: i,
        //     //         label: `${i}`
        //     //     });
        //     // };
        //     // defaultOption = await dropdownMenu.at(-1);
        //     var i = 0;
        //     for (let elem of data) {
        //         try {
        //             i++;
        //             dropdownMenu.push({
        //                 value: i,
        //                 label: `${i}`
        //             });
        //         } catch (error) {
        //             console.log("Error calculating dropdown menu: ", error);
        //         }
        //     }
        // })()

    }, [data, matchday]);





    return (
        <>
            {/* <button onClick={() => setMatchday(5)}>HALLLOOO</button> */}
            <LeagueTable data={sentData} setMatchday={updateMatchday} /*dropdownMenu={dropdownMenu} defaultOption={defaultOption}*/ />
        </>
    )

}

export default League