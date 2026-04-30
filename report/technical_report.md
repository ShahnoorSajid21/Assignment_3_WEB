# Technical Report - Investment Simulator

## 1. Problem Definition
Investment Simulator is a simple FinTech web app where users enter investment inputs and get projected results over time.  
It solves the planning problem for users who cannot easily visualize compound growth with monthly savings and risk variations.  
Target users are beginner investors and students learning basic personal finance concepts.

## 2. System Architecture
This system uses MERN stack:
- Frontend: React (CRA) for UI and routing
- Backend: Express.js API for auth, simulation logic, and data access
- Database: MongoDB Atlas with Mongoose models

Flow:
React form -> `fetch()` request -> Express route -> middleware/auth -> Mongoose + simulation calculation -> JSON response -> React state update -> result render.

Diagram (text):
Frontend (React) -> Backend (Express API) -> MongoDB Atlas

## 3. Database Design
Collections:

### users
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed using bcryptjs)
- `createdAt`: Date

### simulations
- `_id`: ObjectId
- `userId`: ObjectId ref User
- `initialAmount`: Number
- `monthlyContribution`: Number
- `annualRate`: Number
- `years`: Number
- `riskLevel`: String (low/medium/high)
- `results.totalInvested`: Number
- `results.projectedValue`: Number
- `results.gainLoss`: Number
- `results.yearlyBreakdown`: Array of year/value/invested
- `createdAt`: Date

Relationship justification:
- `users` and `simulations` use referencing because one user can own many simulations and this keeps user documents smaller.
- `results` is embedded in simulation because result details are always read together with the simulation document.

## 4. Core Logic Explanation
Algorithm used in `runSimulation`:
1. Read initial amount, monthly contribution, annual rate, years, and risk.
2. Adjust annual rate by risk:
   - low: `rate * 0.8`
   - medium: `rate`
   - high: `rate * 1.2`
3. Convert to monthly interest rate (`adjustedRate / 100 / 12`).
4. Loop each month and apply compound growth plus contribution.
5. At each year end apply small volatility:
   - high: about +/-2%
   - medium: about +/-1%
   - low: about +/-0.5%
6. Store yearly snapshots in `yearlyBreakdown`.
7. Return total invested, projected value, and gain/loss.

Example:
- Input: $1000 initial, $100 monthly, 7% annual, 5 years, medium risk
- Invested amount after 5 years: around $7000 total contributions + initial
- Final value becomes higher due to monthly compounding and yearly volatility adjustment.

## 5. Query Explanation
Query 1 (filtered + sorted):
- Route: GET `/api/simulations`
- Mongoose: `Simulation.find({ userId: req.user.id }).sort({ createdAt: -1 })`
- Purpose: return only the logged-in user's simulations with newest first.

Query 2 (computed logic):
- Server computes `projectedValue` and `gainLoss` during simulation before save.
- Optional aggregation example:
`db.simulations.aggregate([{ $group: { _id: '$riskLevel', avgReturn: { $avg: '$results.gainLoss' } } }])`
- Purpose: compare average gain/loss by risk level.

## 6. Security Analysis
Implemented controls:
1. Input validation:
   - Frontend form validation for required fields, password length, and positive numbers.
   - Backend route validation for required fields and numeric limits.
2. Protected routes:
   - Frontend sends token and restricts dashboard route when token missing.
   - Backend `auth` middleware verifies Bearer token with JWT secret.
3. Password hashing:
   - bcryptjs hashes passwords before storing in MongoDB.

These controls were selected because they are simple, course-aligned, and effective for this project scope.

## 7. Scalability Discussion
Possible issues at 10,000+ users:
- Atlas free tier limits and shared resources
- Single backend service instance bottleneck
- No caching layer for repeated reads
- Long simulation list response without pagination

Future improvements:
- Upgrade MongoDB Atlas cluster and tune indexes (`userId`, `createdAt`)
- Add Redis cache for repeated dashboard requests
- Deploy multiple backend instances behind load balancer
- Add pagination and query limits for simulation history
- Add CDN and optimized frontend build delivery
