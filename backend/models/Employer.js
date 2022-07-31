const { Mongoose } = require("mongoose");

{
    companyName: {
        id: MongooseID,
        phone: BigInt,
        email: String,
        password: Hash,
        website: String,
        posts: [ID]
        employees: {
            name: '',
            post: '',
            permissions: [ID]
        }
    }, 

    post: {
        name: '',
        id: '',
        vacancy: '',
        applicants: '',
        companyID: '',
        date: '',
        skills: '',
        questions: ['', '', ''],
        dueDate: '',
        salary: '',
        location: ''
    },

    applications: {
        seekerId:,
        postId,
        answers: ['', '', ''],
        date: '',
    } 

    Seeker: {
        name: '',
        id: '',
        dob: '',
        sex: '',
        about: '',
        post: '',
        email: '',
        password:'',
        resumeLink: Link, PDF
    }
}