import mongoose from 'mongoose';

const siteStatsSchema = new mongoose.Schema({
    docId: { type: String, default: 'global', unique: true },
    totalVisits: { type: Number, default: 0 },
    visitHistory: [{
        ip: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('SiteStats', siteStatsSchema);
