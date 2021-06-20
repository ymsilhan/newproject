import mongoose from 'mongoose'
import { titles } from '../utils/data.js'
//import studentValidationSchema from '../studentValidation.js'

const studentSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
		unique: true
	},
	regNo: {
		type: String,
		required: true
	},
	nic: {
		type: String,
		required: true,
		trim: true
	},
	title: {
		type: String,
		required: true,
		enum: titles
	},
	nameWithInitials: {
		type: String,
		required: true
	},
	fullName: {
		type: String,
		required: true
	},
	street: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	district: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	zScore: {
		type: Number,
		required: true
	},
	faculty: {
		type: String,
		required: true
	},
	course: {
		type: String,
		required: true
	},
	GSDivision: {
		type: String
		// required: true
	},
	DSDivision: {
		type: String
	},
	indexNo: {
		type: String
	},
	siblingsUnder19: [
		{
			name: {
				type: String
				//	required: true
			},

			dob: {
				type: Date
				//required: true
			},
			schoolOrInstitute: {
				type: String
				//required: true
			}
		}
	],
	siblingsAtUniversity: [
		{
			name: {
				type: String
				//required: true
			},
			regNo: {
				type: String
				//required: true
			},
			institute: {
				type: String
				//required: true
			},
			course: {
				type: String
				//required: true
			},
			academicYear: {
				type: String
				//required: true
			},
			isBursaryOrMahapolaRecipient: {
				type: Boolean
				//required: true
			}
		}
	],
	incomeFromEstateFieldsLands: [
		{
			name: {
				type: String
				//required: true
			},
			relationship: {
				type: String
				//required: true
			},
			location: {
				type: String
				//required: true
			},
			natureOfCultivation: {
				type: String
				//required: true
			},
			extentOfLandAndDetails: {
				type: String
				//required: true
			},
			annualIncome: {
				type: Number
				//required: true
			}
		}
	],
	incomeFromHouses: [
		{
			name: {
				type: String
				//required: true
			},
			relationship: {
				type: String
				//required: true
			},
			assessmentNo: {
				type: String
				//required: true
			},
			noOfHouseholders: {
				type: String
				//required: true
			},
			address: {
				type: String
				//required: true
			},
			annualIncome: {
				type: Number
				//required: true
			},
			rent_lease: {
				type: String
			}
		}
	],
	DSDivision: {
		type: String
	},
	employed: {
		type: Boolean,
		required: true
	},
	employment: {
		establishment: {
			type: String
		},
		address: {
			street: {
				type: String
			},
			city: {
				type: String
			},
			district: {
				type: String
			}
		},
		designation: { type: String },
		salary: { type: Number },
		dateOfEmployment: { type: Date },
		salaryScale: {
			type: Number
		}
	},

	married: {
		type: Boolean,
		required: true
	},
	spouse: {
		name: { type: String },
		dateOfMarriage: {
			type: Date
		},
		employment: {
			establishment: { type: String },
			designation: { type: String },
			salary: { type: Number }
		}
	},

	father: {
		name: { type: String, required: true },
		living: { type: Boolean, required: true },
		age: { type: Number, required: true },
		employment: {
			occupation: { type: String, required: true },
			dateOfEmployment: { type: Date, required: true },
			salary: { type: Number, required: true },
			address: { type: String, required: true }
		},
		annualIncome: {
			occupationOrPension: { type: Number, required: true },
			houseAndProperty: { type: Number, required: true },
			otherSources: { type: Number, required: true }
		}
	},

	mother: {
		name: { type: String, required: true },
		living: { type: Boolean, required: true },
		age: { type: Number, required: true },
		employment: {
			occupation: String,
			dateOfEmployment: Date,
			salary: Number,
			address: String
		},
		annualIncome: {
			occupationOrPension: Number,
			houseAndProperty: Number,
			otherSources: Number
		}
	},

	guardian: {
		name: String,
		age: Number,
		address: String,
		post: String,
		annualIncome: {
			salary: String,
			houseAndPropertyOrTemple: Number
		}
	},
	netIncome: {
		type: Number,
		required: true
	},
	isValidCandidate: {
		type: Boolean,
		required: true,
		default: false
	},
	installments: [
		{
			installmentId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'installment',
				required: true
			},
			noOfInstallments: {
				type: Number,
				required: true
			}
		}
	],
	isApproved: {
		type: Boolean,
		default: false
	},

	deadline: {
		type: Date,
		default: false
	}
})

const Student = mongoose.model('student', studentSchema)

export default Student

// NOTE by ardil: delete the comments before pushing (if not needed)

/*
	regNo: '',ok
	indexNo: '',ok
	nic: '',ok
	title: titles[0],ok
	nameWithInitials: '',ok
	fullName: '',ok
	street: '',// for address - ok 
	city: '',// for address - ok
	district: 'N/A',// for address and require one - ok
	gsDivision: 'N/A',ok

  dsDivision //didn't add - ok
  gsNo //didn't add - ok

	alDistrict: '',ok
	phone: '',ok
	email: '',ok
	course: 'N/A',ok
	zScore: '',ok

  siblingsUnder19 //didn't add -ok
  Distance //didn't add -ok
  siblingsUniversity //didn't add -ok
  incomeFromEstateFieldsLands //didn't add -ok
  incomeFromHouses //didn't add -ok
  GSDNo //didn't add -ok
  DSDivision //didn't add -ok
  LocalAthority //didn't add -ok
 
	employed: false,ok
	employment: {
		establishment: '',ok
		address: {
			street: '',ok
			city: '',ok
			district: 'N/A',ok
		},
		designation: '',ok
		salary: '',ok
		dateOfEmployment: new Date(),ok
    salaryScale //didn't add -ok
	},
	married: false, ok
	spouse: {
		name: '', ok
		//date of marriage ok
		employment: {
			establishment: '',ok
			designation: '',ok
			salary: '',ok
			dateOfEmployment: new Date(), //no need
		},
	},
	father: {
		name: '', ok
		living: true, ok
		age: '', ok
		employment: {
			occupation: '', ok
			salary: '', //no need - ok
			dateOfEmployment: new Date(),//no need - ok
			address: '', ok
		},
		annualIncome: {
			occupationOrPension: '', ok
			houseAndProperty: '', ok
			otherSources: '', ok
		},
    fatherTotalAnnualIncome //didn't add -ok
	},
	mother: {
		name: '',ok
		living: true,ok
		age: '',ok
		employment: {
			occupation: '',ok
			salary: '',//no need - ok
			dateOfEmployment: new Date(),//no need - ok
			address: '',ok
		},
		annualIncome: {
			occupationOrPension: '',ok
			houseAndProperty: '',ok
			otherSources: '',ok
		},
    motherTotalAnnualIncome //didn't add -ok
	},
	guardian: {
		name: '',ok
		age: '',ok
		address: '',ok
		post: '',ok
		annualIncome: {
			salary: '',ok
			houseAndPropertyOrTemple: '',ok
		},
	},
*/
