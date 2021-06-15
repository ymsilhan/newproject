import React, { useEffect, useState } from 'react'
import {
	Container,
	Paper,
	Grid,
	Button,
	Typography,
	makeStyles,
	MenuItem,
	Divider,
	FormControlLabel,
	InputAdornment,
	IconButton,
	Box
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import ApplicationDialog from '../components/ApplicationDialog'
import * as yup from 'yup'
import { Formik, Form, Field, FieldArray } from 'formik'
import Alert from '@material-ui/lab/Alert'
import { TextField, Checkbox } from 'formik-material-ui'
import { KeyboardDatePicker } from 'formik-material-ui-pickers'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
// import { DatePicker } from 'formik-material-ui-pickers'

import { connect } from 'react-redux'
import { setApplication, getApplicationStatus } from '../actions/application'
import ApplicationStatus from '../components/ApplicationStatus'

import {
	titles,
	districts,
	GSDivisions,
	courses,
	faculties,
	DSDivisions
} from '../utils/data'

import Copyright from '../components/Copyright'
import Header from '../components/Header'
import Instruction from '../components/Instruction'

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(4)
	},
	paper: {
		padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
		position: 'relative',
		overflow: 'hidden',
		'&::after': {
			content: "' '",
			position: 'absolute',
			display: 'block',
			backgroundColor: theme.palette.primary.main,
			width: '100%',
			height: '4px',
			top: 0,
			left: 0
		}
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	footer: {
		margin: theme.spacing(2) + 'px 0'
	},
	btn: {
		minWidth: '150px',
		[theme.breakpoints.down('sm')]: {
			minWidth: '100%'
		}
	}
}))

const initialValues = {
	regNo: '',
	indexNo: '',
	nic: '',
	title: titles[0],
	nameWithInitials: '',
	fullName: '',
	street: '',
	city: '',
	district: 'N/A',
	DSDivision: 'N/A',
	alDistrict: '',
	phone: '',
	email: '',
	faculty: 'N/A',
	course: 'N/A',
	zScore: '',
	employed: false,
	employment: {
		establishment: '',
		address: {
			street: '',
			city: '',
			district: 'N/A'
		},
		designation: '',
		salary: 0,
		dateOfEmployment: new Date()
	},
	married: false,
	spouse: {
		name: '',
		//date of marriage
		employment: {
			establishment: '',
			designation: '',
			salary: 0,
			dateOfEmployment: new Date()
		}
	},
	father: {
		name: '',
		living: true,
		age: '',
		employment: {
			occupation: '',
			salary: 0,
			dateOfEmployment: new Date(),
			address: ''
		},
		annualIncome: {
			occupationOrPension: 0,
			houseAndProperty: 0,
			otherSources: 0
		}
	},
	mother: {
		name: '',
		living: true,
		age: '',
		employment: {
			occupation: '',
			salary: 0,
			dateOfEmployment: new Date(),
			address: ''
		},
		annualIncome: {
			occupationOrPension: 0,
			houseAndProperty: 0,
			otherSources: 0
		}
	},
	guardian: {
		name: '',
		age: '',
		address: '',
		post: '',
		annualIncome: {
			salary: 0,
			houseAndPropertyOrTemple: 0
		}
	},
	siblingsUnder19: [
		{
			name: '',
			dob: new Date(),
			age: 19,
			schoolOrInstitute: ''
		}
	],
	siblingsAtUniversity: [
		{
			name: '',
			regNo: '',
			institute: '',
			academicYear: new Date().getFullYear(),
			course: '',
			isBursaryOrMahapolaRecipient: false
		}
	],
	incomeFromHouses: [
		{
			name: '',
			relationship: '',
			assessmentNo: '',
			noOfHouseholders: '',
			address: '',
			annualIncome: 0
		}
	],
	incomeFromEstateFieldsLands: [
		{
			name: '',
			relationship: '',
			location: '',
			natureOfCultivation: '',
			extentOfLandAndDetails: '',
			annualIncome: 0
		}
	]
}

const validationSchema = yup.object().shape({
	regNo: yup
		.string()
		.trim()
		.matches(
			/^20[0-9]{2}\/(FM|E|ET|BST|SB|SP|CSC|BAD|C|A|L|B|V|AD|AG|PHA|MLS|NUR)\/[0-9]{3}$/,
			'Enter valid Registration No.'
		)
		.required('Registration No. is required'),
	indexNo: yup
		.string()
		.trim()
		.matches(/^S\s[0-9]{5}$/, 'Enter a valid Index No.')
		.required(
			'Index No. is required, If not provided contact welfare dept.'
		),
	nic: yup
		.string()
		.trim()
		.matches(
			/^(?:19|20)?\d{2}[0-9]{10}|[0-9]{9}[x|X|v|V]$/,
			'Enter a valid NIC'
		)
		.required('NIC is required'),
	title: yup
		.string()
		.oneOf(titles, 'Invalid title')
		.required('Select a title'),
	nameWithInitials: yup
		.string()
		.min(2, 'Too Short')
		.required('This field is required'),
	fullName: yup
		.string()
		.min(2, 'Too Short')
		.required('This field is required'),
	street: yup.string().required('This field is required'),
	city: yup.string().required('This field is required'),
	district: yup
		.string()
		.oneOf(districts, 'Invalid district')
		.required('This field is required'),
	DSDivision: yup.string().when('district', (value, schema) => {
		return value === 'N/A'
			? yup
					.string()
					.notOneOf(['N/A'], 'Invalid G. S. Division')
					.required('This field is required')
			: yup
					.string()
					.oneOf(
						DSDivisions.find(({ district }) => district === value)
							.division,
						'Invalid D. S. Division'
					)
					.required('This field is required')
	}),
	email: yup.string().email('Invalid email').required('Email is required'),
	course: yup
		.string()
		.oneOf(courses, 'Invalid course')
		.required('Select a course'),
	faculty: yup
		.string()
		.oneOf(faculties, 'Invalid faculties')
		.required('Select a faculty'),
	phone: yup
		.string()
		.matches(/^(?:7|0|(?:\+94))[0-9]{9,10}$/, 'Invalid phone number.')
		.required('Phone is required'),
	employed: yup
		.boolean()
		.default(false)
		.required('State whether employed or not'),
	employment: yup.object().when('employed', (employed, schema) =>
		schema.shape({
			establishment: employed
				? yup.string().required('Establishment is required')
				: yup.string(),
			designation: employed
				? yup.string().required('Designation is required')
				: yup.string(),
			salary: employed
				? yup
						.number()
						.transform(value => (isNaN(value) ? 0 : value))
						.min(0, 'Salary cannot be negative')
						.required('Salary is required')
				: yup.string(),
			dateOfEmployment: employed
				? yup
						.date()
						.max(
							new Date(),
							'Date of Employment cannot be in future'
						)
						.required('Date of Employment is required')
				: yup.date(),
			address: yup.object().shape({
				city: employed
					? yup.string().required('City is required')
					: yup.string(),
				street: employed
					? yup.string().required('Street is required')
					: yup.string(),
				district: employed
					? yup
							.string()
							.oneOf(districts, 'Invalid district')
							.required('Street is required')
					: yup.string()
			})
		})
	),
	married: yup
		.boolean()
		.default(false)
		.required('State whether married or not'),
	spouse: yup.object().when('married', (married, schema) =>
		schema
			.shape({
				name: married
					? yup.string().required('Name is required')
					: yup.string(),
				employment: yup.object().shape({
					establishment: married
						? yup.string().required('Establishment is required')
						: yup.string(),
					designation: married
						? yup.string().required('Designation is required')
						: yup.string(),
					salary: married
						? yup
								.number()
								.transform(value => (isNaN(value) ? 0 : value))
								.min(0, 'Salary cannot be negative')
								.required('Salary is required')
						: yup.string(),
					dateOfEmployment: married
						? yup
								.date()
								.max(
									new Date(),
									'Date of Employment cannot be in future'
								)
								.required('Date of Employment is required')
						: yup.date()
				})
			})
			.optional()
	),
	father: yup.object().shape({
		name: yup.string().required("Father's name is required"),
		living: yup.boolean().required('This field is required'),
		age: yup.number().when('living', {
			is: true,
			then: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.positive('Age cannot be negative')
				.max(
					123,
					'World record for oldest person is 122 years and 164 days :)'
				)
				.required('Age is required, if living'),
			otherwise: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.positive('Age cannot be negative')
				.max(123, 'Invalid age')
		}),
		employment: yup.object().shape({
			occupation: yup.string().required('Occupation is required'),
			salary: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Salary cannot be negative')
				.required('Salary is required'),
			dateOfEmployment: yup
				.date()
				.max(new Date(), 'Date of Employment cannot be in future')
				.required('Date of Employment is required'),
			address: yup.string().required('Address is required')
		}),
		annualIncome: yup.object().shape({
			occupationOrPension: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Income cannot be negative')
				.required('Occupation or pension income is required'),
			houseAndProperty: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Income cannot be negative')
				.required('House & property income is required'),
			otherSources: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Income cannot be negative')
				.required('Income from other sources is required')
		})
	}),
	mother: yup.object().shape({
		name: yup.string().required("Mother's name is required"),
		living: yup.boolean().required('This field is required'),
		age: yup.number().when('living', {
			is: true,
			then: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.positive('Age cannot be negative')
				.max(
					123,
					'World record for oldest person is 122 years and 164 days :)'
				)
				.required('Age is required, if living'),
			otherwise: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.positive('Age cannot be negative')
				.max(123, 'Invalid age')
		}),
		employment: yup.object().shape({
			occupation: yup.string().required('Occupation is required'),
			salary: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Salary cannot be negative')
				.required('Salary is required'),
			dateOfEmployment: yup
				.date()
				.max(new Date(), 'Date of Employment cannot be in future')
				.required('Date of Employment is required'),
			address: yup.string().required('Address is required')
		}),
		annualIncome: yup.object().shape({
			occupationOrPension: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Income cannot be negative')
				.required('Occupation or pension income is required'),
			houseAndProperty: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Income cannot be negative')
				.required('House & property income is required'),
			otherSources: yup
				.number()
				.transform(value => (isNaN(value) ? 0 : value))
				.min(0, 'Income cannot be negative')
				.required('Income from other sources is required')
		})
	}),
	guardian: yup.object().shape({
		name: yup.string().optional(),
		living: yup.boolean().optional(),
		address: yup.string().optional(),
		age: yup
			.number()
			.transform(value => (isNaN(value) ? 0 : value))
			.positive('Age cannot be negative')
			.max(123, 'Invalid age')
			.optional(),
		post: yup.string().min(3, 'Too short').optional(),
		annualIncome: yup
			.object()
			.shape({
				houseAndPropertyOrTemple: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.default(0)
					.min(0, 'Income cannot be negative'),
				salary: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.default(0)
					.min(0, 'Income cannot be negative')
			})
			.optional()
	}),
	siblingsUnder19: yup
		.array()
		.of(
			yup.object().shape({
				name: yup
					.string()
					.min(2, 'Too Short')
					.required('Name is required'),
				dob: yup
					.date()
					.max(new Date(), 'Date of Birth cannot be in future')
					.required('Date of Birth is required'),
				age: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.positive('Age cannot be negative')
					.max(123, 'Invalid age')
					.required('Age is required'),
				schoolOrInstitute: yup
					.string()
					.max(123, 'Invalid age')
					.required('Academic year is required')
			})
		)
		.optional(),
	siblingsAtUniversity: yup
		.array()
		.of(
			yup.object().shape({
				name: yup
					.string()
					.min(2, 'Too Short')
					.required('Name is required'),
				regNo: yup.string().required('Registration No. is required'),
				institute: yup.string().required('Institute is required'),
				academicYear: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.min(new Date().getFullYear() - 7, 'Invalid Academic year')
					.max(
						new Date().getFullYear(),
						'Academic year cannot exceed current year.'
					)
					.required('Academic year is required'),
				course: yup.string().required('Course is required'),
				isBursaryOrMahapolaRecipient: yup.boolean().required()
			})
		)
		.optional(),
	incomeFromHouses: yup
		.array()
		.of(
			yup.object().shape({
				name: yup
					.string()
					.min(2, 'Too Short')
					.required('Name is required'),
				relationship: yup.string().required('Relationship is required'),
				assessmentNo: yup
					.string()
					.required('Assessment No. is required'),
				noOfHouseholders: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.required('No. of Householders is required'),
				address: yup.string().required('Address is required'),
				annualIncome: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.min(0, 'Annual income cannot be negative')
					.required('Annual Income is requied')
			})
		)
		.optional(),
	incomeFromEstateFieldsLands: yup
		.array()
		.of(
			yup.object().shape({
				name: yup.string().required('Name is required'),
				relationship: yup
					.string()
					.required('Relationship No. is required'),
				location: yup.string().required('Location is required'),
				natureOfCultivation: yup
					.string()
					.required('Nature of Cultivation is required'),
				extentOfLandAndDetails: yup
					.string()
					.required('Extent of Land & Details are required'),
				annualIncome: yup
					.number()
					.transform(value => (isNaN(value) ? 0 : value))
					.min(0, 'Annual income cannot be negative')
					.required('Annual Income is requied')
			})
		)
		.optional()
})

function Application({ isSubmitted, getApplicationStatus, setApplication }) {
	const classes = useStyles()

	useEffect(() => {
		getApplicationStatus()
	}, [])

	const [open, setOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Container className={classes.root}>
			<Header
				title="Bursary Application"
				subTitle="University of Jaffna"
			/>
			{isSubmitted ? (
				<ApplicationStatus />
			) : (
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<Grid item>
							<Typography
								variant="subtitle2"
								color="error"
								gutterBottom
							>
								Please read the following instructions before
								filling the form.{' '}
							</Typography>
						</Grid>
						<Grid item>
							<Instruction>
								<Typography variant="body2" color="initial">
									Particulars regarding sources of income of
									should be stated in full. Particulars of
									income supplied by you will be checked with
									relevant officers and the Department of
									Inland revenue.
									<br />
									<br />
									No fields should be left blank. If you have
									nothing to state it should be stated N/A
									,Incomplete applications or applications
									that do not reach this office before closing
									date or applications that are not channeled
									through Grama Sevaka and Divisional
									Secretary will be rejected. <br /> <br />
									This application should be duly perfected
									and handed over to Grama Sevaka, so as to
									reach this office on or before 30th of
									September 2020 the Grama Sevaka will forward
									the Application to the Division Secretary as
									specified in cage 11. As the application has
									to be returned by registered post and
									envelop of 9”x 4” in size with stamps to the
									appropriate value pasted should be handed
									over to the Grama Sevaka along with the
									application.The words “Bursary Application”
									should be indicated on the top left corner
									of the envelop. This application should not
									be handed over to this office personally
									under any circumstances. <br /> <br />
									If the Jaffna University authorities are
									convinced that the information supplied by
									you are incorrect, you should note that you
									could either be punished or your internal
									studentship will be cancelled. <br /> <br />
									If you are a clergy you should indicate the
									particulars of the guardian (chief priest of
									the temple) <br /> <br />
									If you are under the custody of a legal
									Guardian you should furnish copies of
									documents issued by a court of law to that
									effect. <br /> <br />
								</Typography>
							</Instruction>
						</Grid>
					</Grid>

					<Formik
						initialValues={
							JSON.parse(localStorage.getItem('application')) ||
							initialValues
						}
						validationSchema={validationSchema}
						onSubmit={(values, { setSubmitting }) => {
							console.log(validationSchema.cast(values))
							localStorage.setItem(
								'application',
								JSON.stringify(values)
							)
							setApplication(validationSchema.cast(values))
							handleClickOpen()
						}}
					>
						{({ submitForm, isSubmitting, values }) => (
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<Form>
									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Identification
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												If Index No. is not provided,
												please contact relevant
												department before filling the
												application
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													label="Registration No."
													name="regNo"
													placeholder="Eg. 20XX/XXX/XXX"
													helperText="If not provided, contact Welfare Dept."
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													label="Index No."
													name="indexNo"
													placeholder="Eg. S 10119"
													helperText="If not provided, contact relevant Dept."
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													label="NIC"
													name="nic"
													placeholder="Eg. XXXXXXXXXV"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Academic Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												No Fields should be left blank.
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													name="faculty"
													label="Faculty"
													select
													InputLabelProps={{
														shrink: true
													}}
												>
													<MenuItem
														key={'N/A'}
														value={'N/A'}
													>
														N/A
													</MenuItem>
													{faculties.map(option => (
														<MenuItem
															key={option}
															value={option}
														>
															{option}
														</MenuItem>
													))}
												</Field>
											</Grid>
											<Grid item xs={12} sm={5}>
												<Field
													component={TextField}
													type="text"
													name="course"
													label="Course of Study"
													select
													InputLabelProps={{
														shrink: true
													}}
												>
													<MenuItem
														key={'N/A'}
														value={'N/A'}
													>
														N/A
													</MenuItem>
													{courses.map(option => (
														<MenuItem
															key={option}
															value={option}
														>
															{option}
														</MenuItem>
													))}
												</Field>
											</Grid>
											<Grid item xs={12} sm={3}>
												<Field
													component={TextField}
													type="text"
													label="Z score"
													name="zScore"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Personal Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												No Fields should be left blank.
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={3} sm={2}>
												<Field
													component={TextField}
													type="text"
													name="title"
													label="Title"
													select
													InputLabelProps={{
														shrink: true
													}}
												>
													{titles.map(option => (
														<MenuItem
															key={option}
															value={option}
														>
															{option}
														</MenuItem>
													))}
												</Field>
											</Grid>
											<Grid item xs={9} sm={10}>
												<Field
													component={TextField}
													type="text"
													label="Name with Initials"
													name="nameWithInitials"
												/>
											</Grid>
											<Grid item xs={12} sm={12}>
												<Field
													component={TextField}
													type="text"
													label="Full Name"
													name="fullName"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Address
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												No Fields should be left blank.
												State your permanent Address
												here.
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12} sm={12}>
												<Field
													component={TextField}
													type="text"
													label="Street"
													name="street"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													label="City"
													name="city"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													name="district"
													label="District"
													select
													InputLabelProps={{
														shrink: true
													}}
												>
													<MenuItem value="N/A">
														N/A
													</MenuItem>
													{districts.map(option => (
														<MenuItem
															key={option}
															value={option}
														>
															{option}
														</MenuItem>
													))}
												</Field>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													name="DSDivision"
													label="D. S. Division"
													select
													InputLabelProps={{
														shrink: true
													}}
												>
													<MenuItem value="N/A">
														N/A
													</MenuItem>
													{values.district !==
														'N/A' &&
														DSDivisions.find(
															({ district }) =>
																district ===
																values.district
														).division.map(
															option => (
																<MenuItem
																	key={option}
																	value={
																		option
																	}
																>
																	{option}
																</MenuItem>
															)
														)}
												</Field>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Contact
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												No Fields should be left blank.
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12} sm={8}>
												<Field
													component={TextField}
													type="text"
													label="Email"
													name="email"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													label="Phone"
													name="phone"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Employment Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												Provide your Employment details,
												If you are employed by selecting
												the checkbox
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12}>
												<FormControlLabel
													control={
														<Field
															component={Checkbox}
															type="checkbox"
															name="employed"
															color="primary"
															size="small"
														/>
													}
													label="Employed"
												/>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Field
													component={TextField}
													type="text"
													label="Name of Establishment or Department"
													name="employment.establishment"
												/>
											</Grid>
											<Grid item xs={12} sm={5}>
												<Field
													component={TextField}
													type="text"
													label="Designation"
													name="employment.designation"
												/>
											</Grid>
											<Grid item xs={12} sm={5}>
												<Field
													component={TextField}
													type="number"
													label="Salary"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="employment.salary"
												/>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Field
													component={TextField}
													type="text"
													label="Street"
													name="employment.address.street"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													label="City"
													name="employment.address.city"
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="text"
													name="employment.address.district"
													label="District"
													select
													InputLabelProps={{
														shrink: true
													}}
												>
													<MenuItem value="N/A">
														N/A
													</MenuItem>
													{districts.map(option => (
														<MenuItem
															key={option}
															value={option}
														>
															{option}
														</MenuItem>
													))}
												</Field>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={
														KeyboardDatePicker
													}
													name="employment.dateOfEmployment"
													label="Date of Employment"
													format="dd/MM/yyyy"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Siblings Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												No Fields should be left blank.
												To add a sibling click{' '}
												<AddIcon
													style={{
														fontSize: 16,
														verticalAlign: '-3px'
													}}
													color="secondary"
												/>
												and to remove a sibling click{' '}
												<DeleteIcon
													style={{
														fontSize: 16,
														verticalAlign: '-3px'
													}}
													color="secondary"
												/>
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Siblings under the age of 19
												</Typography>
											</Grid>

											<FieldArray
												name="siblingsUnder19"
												render={arrayHelpers => (
													<React.Fragment>
														{values.siblingsUnder19.map(
															(
																sibling,
																index
															) => (
																<React.Fragment
																	key={index}
																>
																	<Grid
																		item
																		container
																		justify="space-between"
																		xs={12}
																	>
																		<Typography>
																			{sibling.name
																				? `${sibling.name}'s details`
																				: ''}
																		</Typography>
																		<IconButton
																			aria-label="remove-sibling"
																			color="secondary"
																			size="small"
																			disabled={
																				index ===
																				0
																					? true
																					: false
																			}
																			onClick={() =>
																				arrayHelpers.remove(
																					index
																				)
																			}
																		>
																			<DeleteIcon fontSize="inherit" />
																		</IconButton>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={12}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Name"
																			name={`siblingsUnder19[${index}].name`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={4}
																	>
																		<Field
																			component={
																				KeyboardDatePicker
																			}
																			type="text"
																			label="Date Of Birth"
																			name={`siblingsUnder19[${index}].dob`}
																			format="dd/MM/yyyy"
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={2}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="number"
																			label="Age"
																			name={`siblingsUnder19[${index}].age`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={6}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Name of School/Institute attended"
																			name={`siblingsUnder19[${index}].schoolOrInstitute`}
																		/>
																	</Grid>
																</React.Fragment>
															)
														)}
														<Grid
															xs={12}
															container
															item
															justify="flex-end"
														>
															<Button
																variant="contained"
																color="secondary"
																size="small"
																slot="right"
																startIcon={
																	<AddIcon fontSize="small" />
																}
																onClick={() =>
																	arrayHelpers.push(
																		{
																			name: '',
																			dob: new Date(),
																			age: 19,
																			schoolOrInstitute:
																				''
																		}
																	)
																}
															>
																Add sibling
															</Button>
														</Grid>
													</React.Fragment>
												)}
											/>

											<Grid item xs={12}>
												<Divider
													style={{ margin: '24px 0' }}
												/>
											</Grid>

											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Siblings At
													University/Institute
												</Typography>
											</Grid>

											<FieldArray
												name="siblingsAtUniversity"
												render={arrayHelpers => (
													<React.Fragment>
														{values.siblingsAtUniversity.map(
															(
																sibling,
																index
															) => (
																<React.Fragment
																	key={index}
																>
																	<Grid
																		item
																		container
																		justify="space-between"
																		xs={12}
																	>
																		<Typography>
																			{sibling.name
																				? `${sibling.name}'s details`
																				: ''}
																		</Typography>
																		<IconButton
																			aria-label="remove-sibling"
																			color="secondary"
																			size="small"
																			disabled={
																				index ===
																				0
																					? true
																					: false
																			}
																			onClick={() =>
																				arrayHelpers.remove(
																					index
																				)
																			}
																		>
																			<DeleteIcon fontSize="inherit" />
																		</IconButton>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={9}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Name"
																			name={`siblingsAtUniversity[${index}].name`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={3}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="number"
																			label="Academic Year"
																			name={`siblingsAtUniversity[${index}].academicYear`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={3}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Resiteration No."
																			name={`siblingsAtUniversity[${index}].regNo`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={5}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="University/Institute"
																			name={`siblingsAtUniversity[${index}].institute`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={4}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Course of Study"
																			name={`siblingsAtUniversity[${index}].course`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																	>
																		<FormControlLabel
																			control={
																				<Field
																					component={
																						Checkbox
																					}
																					type="checkbox"
																					name={`siblingsAtUniversity[${index}].isBursaryOrMahapolaRecipient`}
																					color="primary"
																					size="small"
																				/>
																			}
																			label={
																				sibling.name
																					? `Yes, ${sibling.name} is a Bursary/Mahapola recipient`
																					: `Yes, sibling is a Bursary/Mahapola recipient`
																			}
																		/>
																	</Grid>
																</React.Fragment>
															)
														)}
														<Grid
															xs={12}
															container
															item
															justify="flex-end"
														>
															<Button
																variant="contained"
																color="secondary"
																size="small"
																slot="right"
																startIcon={
																	<AddIcon fontSize="small" />
																}
																onClick={() =>
																	arrayHelpers.push(
																		{
																			name: '',
																			regNo: '',
																			institute:
																				'',
																			academicYear:
																				new Date().getFullYear(),
																			course: '',
																			isBursaryOrMahapolaRecipient: false
																		}
																	)
																}
															>
																Add sibling
															</Button>
														</Grid>
													</React.Fragment>
												)}
											/>
										</Grid>
									</Grid>

									{/* Income Details */}
									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Income Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												No Fields should be left blank.
												To add a field click{' '}
												<AddIcon
													style={{
														fontSize: 16,
														verticalAlign: '-3px'
													}}
													color="secondary"
												/>
												and to remove a field click{' '}
												<DeleteIcon
													style={{
														fontSize: 16,
														verticalAlign: '-3px'
													}}
													color="secondary"
												/>
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Income from Houses
												</Typography>
											</Grid>

											<FieldArray
												name="incomeFromHouses"
												render={arrayHelpers => (
													<React.Fragment>
														{values.incomeFromHouses.map(
															(house, index) => (
																<React.Fragment
																	key={index}
																>
																	<Grid
																		item
																		container
																		justify="space-between"
																		xs={12}
																	>
																		<Typography>
																			{house.name
																				? `${house.name}'s House details`
																				: ''}
																		</Typography>
																		<IconButton
																			aria-label="remove-sibling"
																			color="secondary"
																			size="small"
																			disabled={
																				index ===
																				0
																					? true
																					: false
																			}
																			onClick={() =>
																				arrayHelpers.remove(
																					index
																				)
																			}
																		>
																			<DeleteIcon fontSize="inherit" />
																		</IconButton>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={12}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Owners' Name"
																			name={`incomeFromHouses[${index}].name`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={6}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Address"
																			name={`incomeFromHouses[${index}].address`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={6}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Relationship"
																			name={`incomeFromHouses[${index}].relationship`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={4}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Assessment No."
																			name={`incomeFromHouses[${index}].assessmentNo`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={4}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="number"
																			label="No. of House-holders"
																			name={`incomeFromHouses[${index}].noOfHouseholders`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={4}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="number"
																			label="Annual Income"
																			InputProps={{
																				startAdornment:
																					(
																						<InputAdornment position="start">
																							Rs.{' '}
																						</InputAdornment>
																					)
																			}}
																			name={`incomeFromHouses[${index}].annualIncome`}
																		/>
																	</Grid>
																</React.Fragment>
															)
														)}
														<Grid
															xs={12}
															container
															item
															justify="flex-end"
														>
															<Button
																variant="contained"
																color="secondary"
																size="small"
																slot="right"
																startIcon={
																	<AddIcon fontSize="small" />
																}
																onClick={() =>
																	arrayHelpers.push(
																		{
																			name: '',
																			relationship:
																				'',
																			assessmentNo:
																				'',
																			noOfHouseholders:
																				'',
																			address:
																				'',
																			annualIncome:
																				''
																		}
																	)
																}
															>
																Add House
															</Button>
														</Grid>
													</React.Fragment>
												)}
											/>

											<Grid item xs={12}>
												<Divider
													style={{ margin: '24px 0' }}
												/>
											</Grid>

											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Income from property (
													Estate / Fields / Lands )
												</Typography>
											</Grid>

											<FieldArray
												name="incomeFromEstateFieldsLands"
												render={arrayHelpers => (
													<React.Fragment>
														{values.incomeFromEstateFieldsLands.map(
															(
																property,
																index
															) => (
																<React.Fragment
																	key={index}
																>
																	<Grid
																		item
																		container
																		justify="space-between"
																		xs={12}
																	>
																		<Typography>
																			{property.name
																				? `${property.name}'s property details`
																				: ''}
																		</Typography>
																		<IconButton
																			aria-label="remove-sibling"
																			color="secondary"
																			size="small"
																			disabled={
																				index ===
																				0
																					? true
																					: false
																			}
																			onClick={() =>
																				arrayHelpers.remove(
																					index
																				)
																			}
																		>
																			<DeleteIcon fontSize="inherit" />
																		</IconButton>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={12}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Owners' Name"
																			name={`incomeFromEstateFieldsLands[${index}].name`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={6}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Location"
																			name={`incomeFromEstateFieldsLands[${index}].location`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={6}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Relationship"
																			name={`incomeFromEstateFieldsLands[${index}].relationship`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={8}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			label="Nature of Cultivation"
																			name={`incomeFromEstateFieldsLands[${index}].natureOfCultivation`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		sm={4}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="number"
																			label="Annual Income"
																			InputProps={{
																				startAdornment:
																					(
																						<InputAdornment position="start">
																							Rs.{' '}
																						</InputAdornment>
																					)
																			}}
																			name={`incomeFromEstateFieldsLands[${index}].annualIncome`}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={12}
																	>
																		<Field
																			component={
																				TextField
																			}
																			type="text"
																			multiline
																			rows={
																				2
																			}
																			label="Extent Of Cultivation"
																			name={`incomeFromEstateFieldsLands[${index}].extentOfLandAndDetails`}
																		/>
																	</Grid>
																</React.Fragment>
															)
														)}
														<Grid
															xs={12}
															container
															item
															justify="flex-end"
														>
															<Button
																variant="contained"
																color="secondary"
																size="small"
																slot="right"
																startIcon={
																	<AddIcon fontSize="small" />
																}
																onClick={() =>
																	arrayHelpers.push(
																		{
																			name: '',
																			relationship:
																				'',
																			location:
																				'',
																			natureOfCultivation:
																				'',
																			extentOfLandAndDetails:
																				'',
																			annualIncome:
																				''
																		}
																	)
																}
															>
																Add property
															</Button>
														</Grid>
													</React.Fragment>
												)}
											/>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{ padding: '32px 8px' }}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Marriage Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
											>
												Provide your Marriage details,
												If you are married by selecting
												the checkbox
											</Typography>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											<Grid item xs={12}>
												<FormControlLabel
													control={
														<Field
															component={Checkbox}
															type="checkbox"
															name="married"
															color="primary"
															size="small"
														/>
													}
													label="Married"
												/>
											</Grid>
											<Grid item xs={12}>
												<Field
													component={TextField}
													type="text"
													label="Name of Spouse"
													name="spouse.name"
												/>
											</Grid>
											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
												>
													Spouse Employment Details
												</Typography>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Field
													component={TextField}
													type="text"
													label="Name of Establishment or Department"
													name="spouse.employment.establishment"
												/>
											</Grid>
											<Grid item xs={12} sm={5}>
												<Field
													component={TextField}
													type="text"
													label="Designation"
													name="spouse.employment.designation"
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Field
													component={TextField}
													type="number"
													label="Salary"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="spouse.employment.salary"
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Field
													component={
														KeyboardDatePicker
													}
													name="spouse.employment.dateOfEmployment"
													label="Date of Employment"
													format="dd/MM/yyyy"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Divider variant="middle" />

									<Grid
										container
										spacing={2}
										style={{
											padding: '32px 8px',
											paddingBottom: '0'
										}}
									>
										<Grid item xs={12} md={3}>
											<Typography
												variant="h6"
												color="initial"
												gutterBottom
											>
												Parent/Guardian Details
											</Typography>
											<Typography
												variant="body2"
												color="initial"
												gutterBottom
											>
												No Fields should be left blank.
												State whether particular
												individual is living or not
												using the checkbox.
											</Typography>
											<Alert
												severity="warning"
												variant="outlined"
												size="small"
												style={{ marginTop: '16px' }}
											>
												If the particular individual is
												not living original death
												certificate should be attached
											</Alert>
										</Grid>
										<Grid
											container
											item
											spacing={2}
											xs={12}
											md={9}
										>
											{/* father details */}
											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Father's Details
												</Typography>
											</Grid>
											<Grid item xs={12}>
												<Field
													component={TextField}
													type="text"
													label="Full name"
													name="father.name"
												/>
											</Grid>
											<Grid item xs={12}>
												<FormControlLabel
													control={
														<Field
															component={Checkbox}
															type="checkbox"
															name="father.living"
															color="primary"
															size="small"
														/>
													}
													label="Living"
												></FormControlLabel>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="number"
													label="Age"
													name="father.age"
													helperText="State the age, if living"
												/>
											</Grid>
											<Grid item xs={12} sm={8}>
												<Field
													component={TextField}
													type="text"
													label="Occupation"
													name="father.employment.occupation"
													helperText="If not living  or retired, employment prior to death or retirement"
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Field
													component={TextField}
													type="number"
													label="Salary"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="father.employment.salary"
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<Field
													component={
														KeyboardDatePicker
													}
													name="father.employment.dateOfEmployment"
													label="Date of Employment"
													format="dd/MM/yyyy"
												/>
											</Grid>
											<Grid item xs={12}>
												<Field
													component={TextField}
													type="text"
													label="Address of workplace"
													name="father.employment.address"
													helperText="State the place worked/working"
												/>
											</Grid>
											<Grid item xs={12}>
												<Typography
													variant="body2"
													color="initial"
												>
													Father's Annual Income
												</Typography>
												<Typography
													variant="caption"
													color="textSecondary"
												>
													State annual income of
													particulars from 01
													<sup>st</sup> of January to
													31
													<sup>st</sup> December{' '}
													{new Date().getFullYear()}
												</Typography>
											</Grid>
											<Grid item xs={12} md={4}>
												<Field
													component={TextField}
													type="number"
													label="Income from occupation or pension"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="father.annualIncome.occupationOrPension"
												/>
											</Grid>
											<Grid item xs={12} md={4}>
												<Field
													component={TextField}
													type="number"
													label="Income from house and property"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="father.annualIncome.houseAndProperty"
												/>
											</Grid>
											<Grid item xs={12} md={4}>
												<Field
													component={TextField}
													type="number"
													label="Income from all other sources"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="father.annualIncome.otherSources"
												/>
											</Grid>

											<Grid item xs={12}>
												<Divider
													style={{ margin: '24px 0' }}
												/>
											</Grid>

											{/* mother details */}
											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Mother's Details
												</Typography>
											</Grid>
											<Grid item xs={12} sm={12}>
												<Field
													component={TextField}
													type="text"
													label="Full name"
													name="mother.name"
												/>
											</Grid>
											<Grid item xs={12} sm={12}>
												<FormControlLabel
													control={
														<Field
															component={Checkbox}
															type="checkbox"
															name="mother.living"
															color="primary"
															size="small"
														/>
													}
													label="Living"
												></FormControlLabel>
											</Grid>
											<Grid item xs={12} sm={4}>
												<Field
													component={TextField}
													type="number"
													label="Age"
													name="mother.age"
													helperText="State the age, if living"
												/>
											</Grid>
											<Grid item xs={12} sm={8}>
												<Field
													component={TextField}
													type="text"
													label="Occupation"
													name="mother.employment.occupation"
													helperText="If not living  or retired, employment prior to death or retirement"
												/>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Field
													component={TextField}
													type="number"
													label="Salary"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="mother.employment.salary"
												/>
											</Grid>
											<Grid item xs={12} sm={5}>
												<Field
													component={
														KeyboardDatePicker
													}
													name="mother.employment.dateOfEmployment"
													label="Date of Employment"
													format="dd/MM/yyyy"
												/>
											</Grid>
											<Grid item xs={12} md={12}>
												<Field
													component={TextField}
													type="text"
													label="Address of workplace"
													name="mother.employment.address"
													helperText="State the place worked/working"
												/>
											</Grid>
											<Grid item xs={12}>
												<Typography
													variant="body2"
													color="initial"
												>
													Mother's Annual Income
												</Typography>
												<Typography
													variant="caption"
													color="textSecondary"
												>
													State annual income of
													particulars from 01
													<sup>st</sup> of January to
													31
													<sup>st</sup> December{' '}
													{new Date().getFullYear()}
												</Typography>
											</Grid>
											<Grid item xs={12} md={4}>
												<Field
													component={TextField}
													type="number"
													label="Income from occupation or pension"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="mother.annualIncome.occupationOrPension"
												/>
											</Grid>
											<Grid item xs={12} md={4}>
												<Field
													component={TextField}
													type="number"
													label="Income from house and property"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="mother.annualIncome.houseAndProperty"
												/>
											</Grid>
											<Grid item xs={12} md={4}>
												<Field
													component={TextField}
													type="number"
													label="Income from all other sources"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="mother.annualIncome.otherSources"
												/>
											</Grid>

											<Grid item xs={12}>
												<Divider
													style={{ margin: '24px 0' }}
												/>
											</Grid>

											{/* guardian details */}
											<Grid item xs={12}>
												<Typography
													variant="subtitle1"
													color="initial"
													style={{
														fontWeight: '500'
													}}
												>
													Guardian's Details
												</Typography>
												<Typography
													variant="caption"
													color="textSecondary"
												>
													This section should be
													filled by orphans or clergy
													or any other applicant who
													under the custody of a legal
													guardian
												</Typography>
											</Grid>
											<Grid item xs={12} md={10}>
												<Field
													component={TextField}
													type="text"
													label="Full name"
													name="guardian.name"
												/>
											</Grid>
											<Grid item xs={12} sm={4} md={2}>
												<Field
													component={TextField}
													type="number"
													label="Age"
													name="guardian.age"
												/>
											</Grid>
											<Grid item xs={12} sm={8}>
												<Field
													component={TextField}
													type="text"
													label="Address"
													name="guardian.address"
													helperText="State the permanent address here"
												/>
											</Grid>
											<Grid item xs={12} sm={5} md={4}>
												<Field
													component={TextField}
													type="text"
													label="Post"
													name="guardian.post"
													helperText="State the post, if employed"
												/>
											</Grid>
											<Grid item xs={12}>
												<Typography
													variant="body2"
													color="initial"
												>
													Guardian's Annual Income
												</Typography>
												<Typography
													variant="caption"
													color="textSecondary"
												>
													State annual income of
													particulars from 01
													<sup>st</sup> of January to
													31
													<sup>st</sup> December{' '}
													{new Date().getFullYear()}
												</Typography>
											</Grid>
											<Grid item xs={12} sm={5}>
												<Field
													component={TextField}
													type="number"
													label="Salary"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="guardian.annualIncome.salary"
												/>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Field
													component={TextField}
													type="number"
													label="Income from house & property/temple"
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																Rs.{' '}
															</InputAdornment>
														)
													}}
													name="guardian.annualIncome.houseAndPropertyOrTemple"
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid
										container
										item
										xs={12}
										justify="flex-end"
										style={{
											padding: '0 16px',
											paddingTop: '32px'
										}}
									>
										<Button
											disabled={isSubmitting}
											onClick={submitForm}
											variant="contained"
											color="primary"
											margin="normal"
											slot="right"
											className={classes.btn}
										>
											Apply
										</Button>
										<ApplicationDialog
											open={open}
											onClose={handleClose}
										/>
									</Grid>
								</Form>
							</MuiPickersUtilsProvider>
						)}
					</Formik>
				</Paper>
			)}
			<footer className={classes.footer}>
				<Copyright />
			</footer>
		</Container>
	)
}

const mapStateToProps = state => ({
	user: state.user.data,
	isSubmitted: state.application.isSubmitted,
	isLoading: state.application.isLoading
})

export default connect(mapStateToProps, {
	setApplication,
	getApplicationStatus
})(Application)
