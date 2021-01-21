import React from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Title from './Title'

// Generate Order Data
function createData(id, regNo, name, district, grossIncome) {
	return { id, regNo, name, district, grossIncome }
}

const rows = [
	createData(0, '2017/CSC/045', 'Z. M Ardil', 'Kandy', 125000.0),
	createData(1, '2017/CSC/021', 'Isuru Lakmal', 'Anudradhapura', 220000.0),
	createData(2, '2017/CSC/017', 'Ramesh Perera', 'Galle', 130000.0),
]

function preventDefault(event) {
	event.preventDefault()
}

const useStyles = makeStyles(theme => ({
	seeMore: {
		marginTop: theme.spacing(3),
	},
}))

export default function PendingApplications() {
	const classes = useStyles()
	return (
		<React.Fragment>
			<Title>Application Pending Approval</Title>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell>Reg. No.</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>District</TableCell>
						<TableCell align='right'>Gross Income</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow key={row.id}>
							<TableCell>{row.regNo}</TableCell>
							<TableCell>{row.name}</TableCell>
							<TableCell>{row.district}</TableCell>
							<TableCell align='right'>{row.grossIncome}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className={classes.seeMore}>
				<Link color='primary' href='#' onClick={preventDefault}>
					See more pending Applications
				</Link>
			</div>
		</React.Fragment>
	)
}
