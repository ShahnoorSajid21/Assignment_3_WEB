const express = require('express')
const Simulation = require('../models/Simulation')

const router = express.Router()

function runSimulation(initial, monthly, rate, years, risk) {
  let currentValue = initial;
  let totalInvested = initial;
  const breakdown = [];

  let adjustedRate = rate;
  if (risk == 'high') adjustedRate = rate * 1.2;
  if (risk == 'low') adjustedRate = rate * 0.8;

  const monthlyRate = adjustedRate / 100 / 12;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      currentValue = currentValue * (1 + monthlyRate) + monthly;
      totalInvested += monthly;
    }
    let volatility = 0;
    if (risk === 'high') volatility = (Math.random() - 0.5) * 0.04;
    if (risk === 'medium') volatility = (Math.random() - 0.5) * 0.02;
    if (risk === 'low') volatility = (Math.random() - 0.5) * 0.01;
    currentValue = currentValue * (1 + volatility);

    breakdown.push({
      year: year,
      value: Math.round(currentValue * 100) / 100,
      invested: Math.round(totalInvested * 100) / 100
    });
  }

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    projectedValue: Math.round(currentValue * 100) / 100,
    gainLoss: Math.round((currentValue - totalInvested) * 100) / 100,
    yearlyBreakdown: breakdown
  };
}

router.post('/', async(req,res)=>{
  const { initialAmount, monthlyContribution, annualRate, years, riskLevel } = req.body
  let temp = 0
  console.log('incoming simulation body', req.body)

  if (
    initialAmount === undefined || monthlyContribution === undefined || annualRate === undefined ||
    years === undefined || !riskLevel
  ) {
    return res.status(400).json({ msg: 'Missing fields' })
  }
  if (Number(initialAmount) < 0 || Number(monthlyContribution) < 0 || Number(annualRate) <= 0 || Number(years) <= 0) {
    return res.status(400).json({ msg: 'Invalid values. Must be positive numbers' })
  }
  if (Number(years) > 50) {
    return res.status(400).json({ msg: 'Years must be less than or equal to 50' })
  }

  try {
      const results = runSimulation(
      Number(initialAmount),
      Number(monthlyContribution),
      Number(annualRate),
      Number(years),
      riskLevel
    )
    const sim = new Simulation({
      userId: req.user.id,
      initialAmount: Number(initialAmount),
      monthlyContribution: Number(monthlyContribution),
      annualRate: Number(annualRate),
      years: Number(years),
      riskLevel: riskLevel,
      results: results
    })
    const saved = await sim.save()
    return res.status(201).json(saved)
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

router.get('/', async (req,res) => {
  try {
    const data = await Simulation.find({ userId: req.user.id }).sort({ createdAt: -1 })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const sim = await Simulation.findOne({ _id: req.params.id, userId: req.user.id })
    if (!sim) {
      return res.status(404).json({ msg: 'Simulation not found' })
    }
    return res.json(sim)
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

router.delete('/:id', async(req,res)=>{
  try {
      const sim = await Simulation.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!sim) return res.status(404).json({ msg: 'Simulation not found' })
    return res.json({ msg: 'Simulation removed' })
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
