import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['breathing', 'meditation', 'focus'],
        required: true
    },
    duration: {
        type: Number, // in seconds
        required: true,
        min: 0
    },
    pattern: {
        type: String,
        default: null
    },
    moodBefore: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    moodAfter: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    notes: {
        type: String,
        maxlength: 500,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
sessionSchema.index({ userId: 1, createdAt: -1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
