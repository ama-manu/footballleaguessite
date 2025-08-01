"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { LeagueTable } from "../types/types";
import React, { useState } from "react";
import { access } from "fs";
import { get } from "http";

const fallBackData: LeagueTable = [{
	position: 0,
	team: {
		teamId: 0,
		teamName: "No data",
		teamIconUrl: "",
		matchesPlayed: 0,
		wins: 0,
		draws: 0,
		losses: 0,
		goalsFor: 0,
		goalsAgainst: 0,
		goalDifference: 0,
		points: 0,
		form: [],
	},

}]

const columns = [
	{
		accessorKey: "position",
		header: "Position",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	// {
	// 	accessorKey: "team.teamIconUrl",
	// 	header: "Team Icon",
	// 	cell: (props: any) => <div>{props.getValue() ? <img src={props.getValue()} alt="Team Icon" /> : "No Icon"}</div>,
	// },
	{
		accessorKey: "team.teamName",
		header: "Team Name",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorKey: "team.matchesPlayed",
		header: "Matches Played",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorKey: "team.wins",
		header: "Wins",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorKey: "team.draws",
		header: "Draws",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorKey: "team.losses",
		header: "Losses",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorFn: (row: any) => row.team.goalsFor + ":" + row.team.goalsAgainst,
		header: "Goals",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorFn: (row: any) => (row.team.goalDifference < 1 ? "" : "+") + row.team.goalDifference,
		header: "Difference",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},
	{
		accessorKey: "team.points",
		header: "Points",
		cell: (props: any) => <div>{props.getValue()}</div>,
	},

]


function LeagueTableComponent({ processedData }: { processedData: LeagueTable }) {
	const [data, _setData] = React.useState(() => [...processedData]);
	const table = useReactTable({
		columns,
		data: data || fallBackData,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<table>
				<thead>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map(header => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
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
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
				<tfoot>
					{table.getFooterGroups().map(footerGroup => (
						<tr key={footerGroup.id}>
							{footerGroup.headers.map(header => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.footer,
											header.getContext()
										)}
								</th>
							))}
						</tr>
					))}
				</tfoot>
			</table>
		</div>
	)
}

export default LeagueTableComponent;