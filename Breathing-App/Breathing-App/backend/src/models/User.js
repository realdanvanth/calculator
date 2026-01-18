import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    settings: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        breathingSpeed: {
            type: String,
            enum: ['slow', 'slower', 'slowest'],
            default: 'slow'
        },
        breathingPattern: {
            type: String,
            enum: ['relaxed', 'box', '478', 'energize'],
            default: 'relaxed'
        },
        motionEnabled: {
            type: Boolean,
            default: true
        }
    },
    stats: {
        totalMinutes: { type: Number, default: 0 },
        sessionsCompleted: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        lastSessionDate: { type: Date, default: null }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
