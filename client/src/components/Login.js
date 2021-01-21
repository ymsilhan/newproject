import React from 'react'
import {
	Button,
	Grid,
	makeStyles,
	TextField,
	Typography,
	Fade,
} from '@material-ui/core'
import { useFormik } from 'formik'
import * as yup from 'yup'

const useStyles = makeStyles(theme => ({
	field: {
		marginBottom: theme.spacing(2),
	},
	title: {
		fontWeight: 700,
	},
}))

const initialValues = {
	email: '',
	regNo: '',
	password: '',
	confirmPassword: '',
}

const validationSchema = yup.object({
	email: yup
		.string('Enter your email')
		.email('Enter a valid email')
		.required('Email is required'),
	regNo: yup
		.string('Enter your Registration No.')
		.trim()
		.matches(
			/^20[0-9]{2}\/(FM|E|ET|BST|SB|SP|CSC|BAD|C|A|L|B|V|AD|AG|PHA|MLS|NUR)\/[0-9]{3}$/,
			'Enter valid Registration No.'
		)
		.required('Registration No. is required'),
	password: yup.string().required('Password is required'),
})

const onSubmit = () => {}

function Login({ authView, onAuthViewChange, ...props }) {
	const classes = useStyles()
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit,
	})

	return (
		<Fade
			in={authView === 'login'}
			mountOnEnter
			unmountOnExit
			timeout={{ enter: 500 }}
		>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12}>
						<Typography
							variant='h5'
							color='initial'
							gutterBottom
							fontWeight={700}
							className={classes.title}
						>
							Login
						</Typography>
						<Typography variant='body2' color='initial' gutterBottom>
							Login to access preliminary application/extended application
							(honours degree) or to view your application status
						</Typography>
					</Grid>
					<Grid item xs={12} sm={12}>
						<TextField
							required
							size='small'
							variant='outlined'
							name='regNo'
							label='Registration No.'
							value={formik.values.regNo}
							onChange={formik.handleChange}
							error={formik.touched.regNo && Boolean(formik.errors.regNo)}
							helperText={formik.touched.regNo && formik.errors.regNo}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							size='small'
							variant='outlined'
							name='email'
							label='Email'
							value={formik.values.email}
							onChange={formik.handleChange}
							error={formik.touched.email && Boolean(formik.errors.email)}
							helperText={formik.touched.email && formik.errors.email}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							required
							fullWidth
							size='small'
							variant='outlined'
							name='password'
							label='Password'
							type='password'
							value={formik.values.password}
							onChange={formik.handleChange}
							error={formik.touched.password && Boolean(formik.errors.password)}
							helperText={formik.touched.password && formik.errors.password}
						/>
					</Grid>
					<Grid item container xs={12} justify='flex-end'>
						<Button
							size='small'
							style={{ marginRight: '10px' }}
							onClick={e => onAuthViewChange()}
						>
							Register
						</Button>
						<Button
							type='submit'
							size='small'
							variant='contained'
							color='secondary'
						>
							Login
						</Button>
					</Grid>
				</Grid>
			</form>
		</Fade>
	)
}

export default Login
