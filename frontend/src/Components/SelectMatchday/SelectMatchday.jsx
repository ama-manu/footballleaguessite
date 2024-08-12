import React, { useEffect, useState } from 'react'

import LeagueTable from '../LeagueTable/LeagueTable';

function SelectMatchday({ data, league }) {
    const [matchday, setMatchday] = useState(undefined);
    const [sentData, setSentData] = useState(null);
    var dropdownMenu = [];
    const [dropdownMenuT, setDropdownMenu] = useState({});
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

    }, [data, matchday]);

    useEffect(() => {
        
        const dropdownContent = async () => {
            const nOMatches = await data[data.length - 1][0].matches;            
            const newDropdownMenu = {};
            for (let i = 1; i <= nOMatches; i++) {
                newDropdownMenu[i] = i.toString();
            }        
            setDropdownMenu(newDropdownMenu);
        }

        dropdownContent();

    }, [data])

    dropdownMenu = Object.values(dropdownMenuT);

    return (
        <>
            {/* <button onClick={() => setMatchday(5)}>HALLLOOO</button> */}
            <LeagueTable data={sentData} setMatchday={updateMatchday} league={league} dropdownMenu={dropdownMenu} defaultOption={defaultOption} />
        </>
    )

}

export default SelectMatchday