const mongoose = require('mongoose');

const YearSchema = new mongoose.Schema({
 year: Number,
    value: Number,
  invested: Number
}, { _id: false })

const SimulationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  initialAmount: { type: Number, required: true },
    monthlyContribution: { type: Number, required: true },
  annualRate: { type: Number, required: true },
  years: { type: Number, required: true },
   riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    results: {
        totalInvested: Number,
      projectedValue: Number,
     gainLoss: Number,
        yearlyBreakdown: [YearSchema]
    },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Simulation", SimulationSchema)
