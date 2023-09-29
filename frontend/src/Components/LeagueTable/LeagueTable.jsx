import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

// async function fetchAsync(url) {
//     try {
//         let response = await fetch(url);
//         let data = await response.json();
//         return data;
//     } catch (error) {
//         console.log(error.message);
//         return null;
//     }
// }


const url = "http://localhost:3000/api";

function FetchData() {
    const [dbdata, setdbData] = useState([]);

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setdbData(data))
            .catch(err => console.log(err))
    }, [])

    return dbdata;
}




function LeagueTable() {
    const tempData = FetchData();
    const data = tempData;

    /** @type import('@tanstack/react-table).ColumnDef<any>*/
    const columns = [
        {
            header: '',
            accessorKey: 'teamName'
        },
        {
            header: 'Spiele',
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
            accessorKey: 'goals'
        },
        {
            header: 'D',
            // accessorKey: 'goalDiff'
            accessorFn: (row => (row.goalDiff < 1 ? "" : "+") + row.goalDiff)   // add + infront of numbers > 0
        },
        {
            header: 'Punkte',
            accessorKey: 'points'
        }
    ]

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    // console.log(table.getHeaderGroups());

    return (
        <table>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default LeagueTable