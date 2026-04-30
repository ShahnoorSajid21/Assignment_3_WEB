# Handwritten Answers Draft

## Q1. System Flow Diagram
[Browser] -> User clicks button -> React event handler -> fetch() ->  
[Express Server] -> Route handler -> auth middleware -> Mongoose query ->  
[MongoDB Atlas] -> Returns data -> Mongoose document -> JSON response ->  
[Browser] -> React updates state -> Re-renders component -> User sees result

Layers:
- Presentation Layer: Browser + React UI
- Application Layer: Express routes + middleware + business logic
- Data Layer: MongoDB Atlas + Mongoose models

## Q2. One API Route - POST /api/simulations
1. Frontend sends `fetch` with JSON body and `Authorization: Bearer <token>`.
2. Express matches POST route under `/api/simulations`.
3. `auth` middleware verifies token and sets `req.user`.
4. Route reads all simulation fields from `req.body`.
5. Manual validation checks required fields and numeric limits.
6. `runSimulation()` applies compound growth + yearly volatility.
7. New Simulation document is created using Mongoose.
8. Document is saved to MongoDB with `.save()`.
9. API returns status 201 and saved simulation JSON.

## Q3. Database Relationship
- Two collections: `users` and `simulations`.
- `simulations.userId` references `users._id`.
- Referencing is used because one user can have many simulations and embedding all would grow the user document too much.
- Results are embedded inside each simulation because they are always accessed with that simulation.

## Q4. Core FinTech Logic
Example trace:
- Input: $5000 initial, $200/month, 8% annual, 10 years, high risk
- Step 1: rate adjusted to 9.6% (`8 * 1.2`)
- Step 2: monthly rate = `9.6 / 100 / 12 = 0.008`
- Step 3: monthly update = `value = value * 1.008 + 200`
- Step 4: each year add volatility around +/-2% for high risk
- Step 5: total invested after 10 years = `$5000 + (200 * 120) = $29000`
- Step 6: projected value is generally higher due to compounding (exact output varies with volatility)
- Step 7: gain/loss = projected value - total invested

## Q5. Real Security Flaw
Flaw:
- If `.env` is leaked or pushed publicly, JWT secret can be exposed and tokens can be forged.

Fix:
- Keep `.env` out of Git using `.gitignore`.
- Use strong random secrets (like crypto random bytes).
- Set secrets in deployment platform environment variables, not source code.
- Rotate JWT secret periodically in production.
