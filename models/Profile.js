const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        require: true,
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    status: {
        type: String,
        require: true
    },
    skills: {
        type: [String],
        require: true
    },
    bio: {
        type: String
    },
    gitHubUserName: {
        type: String
    },
    experience: [
        {
            title: {
                type: String,
                require: true
            },
            company: {
                type: String,
                require: true
            },
            location: {
                type: String,
            },
            from: {
                type: Date,
                require: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
            },
        },
        
    ],
    education: [
        {
            school: {
                type: String,
                require: true
            },
            degree: {
                type: String,
                require: true
            },
            fieldOfStudy: {
                type: String,
                require: true
            },
            from: {
                type: Date,
                require: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
            },
        },    
    ],
    social: {
        youtube: {
            tyep: String
        },
        twitter: {
            tyep: String
        },
        facebook: {
            tyep: String
        },
        linkedin: {
            tyep: String
        },
        instagram: {
            tyep: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)