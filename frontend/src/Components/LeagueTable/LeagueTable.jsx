import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import styles from './LeagueTable.module.scss'

function FillCells({ p }) {
    var cname = '';
    var content = flexRender(p.column.columnDef.cell, p.getContext());

    // goal diff colours
    if (p.getContext().getValue() > 0 && p.getContext().column.id === "D") {
        cname = styles.colourPos;
    } else if (p.getContext().getValue() < 0 && p.getContext().column.id === "D") {
        cname = styles.colourNeg;
    }

    // position change arrows
    if (p.getContext().getValue() === "up") {
        cname = styles.colourPos;
        content = <RiArrowUpSLine />
    } else if (p.getContext().getValue() === "down") {
        cname = styles.colourNeg;
        content = <RiArrowDownSLine />
    }

    // add icons
    if (typeof p.getContext().getValue() === "string" && p.getContext().getValue().slice(0, 4) === "http") {
        cname = styles.teamIcons;
        content = <img
            src={p.getContext().getValue()}
            alt="logo"
        />
    }



    return (
        <td key={p.id} className={cname}>
            {content}
        </td>
    )
}


function LeagueTable({ data, setMatchday, league/*dropdownMenu, defaultOption*/ }) {
    //invalid data in case no data is sent
    if (!data) {
        // retVal = <div>Loading ...</div>
        data = {
            "posChange": 0,
            "teamIconUrl": 0,
            "teamName": 0,
            "matches": 0,
            "won": 0,
            "draw": 0,
            "lost": 0,
            "goals": 0,
            "opponentGoals": 0,
            "goalsDiff": 0,
            "points": 0
        }
    }

    var isMobile = useMediaQuery({ query: `(max-width: 630px)` });
    var reactiveTeamName = isMobile ? 'shortName' : 'teamName';
    var reactivePointsHeader = isMobile ? 'Pkt' : 'Punkte';
    var reactiveMatchesHeader = isMobile ? 'Sp' : 'Spiele';

    /** @type import('@tanstack/react-table).ColumnDef<any>*/
    const columns = [
        {
            header: '',
            accessorKey: 'posChange'
        },
        {
            id: 'teamIconUrl',
            header: '',
            accessorKey: 'teamIconUrl'
        },
        {
            header: '',
            // accessorKey: 'teamName'
            accessorKey: reactiveTeamName
        },
        {
            header: reactiveMatchesHeader,
            accessorKey: 'matches'
        },
        {
            header: 'S',
            accessorKey: 'won'
        },
        {
            header: 'U',
            accessorKey: 'draw'
        },
        {
            header: 'N',
            accessorKey: 'lost'
        },
        {
            header: 'Tore',
            // accessorKey: 'goals'
            accessorFn: (row => (row.goals + ":" + row.opponentGoals))
        },
        {
            header: 'D',
            // accessorKey: 'goalDiff'
            accessorFn: (row => (row.goalDiff < 1 ? "" : "+") + row.goalDiff)   // add + infront of numbers > 0
        },
        {
            header: reactivePointsHeader,
            accessorKey: 'points'
        }
    ]

    // trigger goal difference display based on screen width
    if (isMobile) {
        columns.splice(-2, 1);
    } else {
        // if (!(columns.find((obj) => { // check if goalDiff not yet included in columns
        //     return obj.header === 'D';
        // }))) {
        //     columns.pop();  // remove last object from array
        //     columns.push(
        //         {
        //             header: 'D',
        //             // accessorKey: 'goalDiff'
        //             accessorFn: (row => (row.goalDiff < 1 ? "" : "+") + row.goalDiff)   // add + infront of numbers > 0
        //         }
        //     );  // add goalDiff
        //     columns.push(
        //         {
        //             header: 'Punkte',
        //             accessorKey: 'points'
        //         }   
        //     );  // re-add last item
        // }
    }

    // table data
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <>
            {/* <button onClick={() => setMatchday(8)}>HALLLOOO</button> */}
            {/* <Dropdown options={dropdownMenu} value={defaultOption} placeholder="Spieltag" /> */}
            {/* <div>{league.name}</div> */}
            <table className={styles.table}>
                
                <thead>
                    {table?.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            <th className={styles.colouredCell}></th>
                            <th></th>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header, header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table?.getRowModel().rows.map((row, rindex) => (
                        <tr key={row.id}>
                            <td className={styles.colouredCell}></td>
                            <td>{rindex + 1}</td>
                            {row.getVisibleCells().map(cell => (
                                <FillCells
                                    p={cell}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default LeagueTable