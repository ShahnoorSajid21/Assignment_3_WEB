# Assignment Questions and Answers (Copy-Paste)

Use this file to copy each **Answer** onto your handwritten sheet. Replace bracketed notes with your own live URLs if your teacher wants them on paper.

---

## Question 1 — System flow diagram

**Question:** Draw or describe the system flow from the browser to the database and back. Label the presentation layer, application layer, and data layer.

**Answer:**

The user interacts with the **presentation layer** in the browser (React). When they click a button or submit a form, a React **event handler** runs and calls **`fetch()`** over HTTPS to the Express server.

The request hits the **application layer** (Express). The router sends the request through **middleware** (for example logging and **JWT authentication** on protected routes). The route handler runs **validation** and **business logic** (for simulations, the compound growth / volatility logic). It uses **Mongoose** to talk to MongoDB.

The **data layer** is **MongoDB Atlas**. Mongoose reads or writes documents (users, simulations) and returns results to the route handler.

The handler sends a **JSON response** back to the browser. React stores data in **state** and **re-renders**, so the user sees updated lists and results.

**Layer labels:**

- **Presentation layer:** Browser + React UI  
- **Application layer:** Express API + middleware + simulation logic  
- **Data layer:** MongoDB Atlas + Mongoose models  

**One-line flow:**

`[Browser / React] → fetch → [Express] → middleware → Mongoose → [MongoDB Atlas] → JSON → React state → UI`

---

## Question 2 — Explain one API route step by step

**Question:** Pick one API route and explain it step by step from client to database.

**Answer (route: `POST /api/simulations`):**

1. The frontend builds a **JSON body** with `initialAmount`, `monthlyContribution`, `annualRate`, `years`, and `riskLevel`.  
2. The frontend sends **`fetch`** with method **POST** to `/api/simulations` and adds header **`Authorization: Bearer <token>`**.  
3. Express matches the **POST** route registered under `/api/simulations`.  
4. The **`auth` middleware** reads the Bearer token, verifies it with **`jwt.verify`**, and attaches **`req.user`** (the logged-in user id). If the token is missing or bad, the server responds **401** and stops.  
5. The route handler reads fields from **`req.body`** and performs **manual validation** (all fields present, positive numbers where required, years within the allowed maximum).  
6. The handler calls **`runSimulation(...)`**, which applies **monthly compounding + contributions** and **year-end volatility** based on risk.  
7. The handler creates a **`Simulation`** Mongoose instance including the embedded **`results`** object.  
8. It calls **`.save()`** so the document is written to **MongoDB**.  
9. The server responds with **201 Created** and the **saved simulation JSON** (including computed results).

---

## Question 3 — Database relationship

**Question:** Describe the relationship between collections. Why reference users and simulations but embed results inside a simulation?

**Answer:**

There are **two** main collections: **`users`** and **`simulations`**.

Each simulation document has a **`userId`** field that **references** the **`_id`** of a user. This is a **one-to-many** relationship in the data model: one user, many simulations.

**Why reference instead of embedding all simulations inside the user?**

One user can create **many** simulations over time. If every simulation were stored inside the user document, that document would grow very large. MongoDB has a **maximum document size (16 MB)**. Large embedded arrays also make single-document updates slower and more awkward. Referencing keeps the user document small and lets us query simulations independently (for example “all simulations for this user, sorted by date”).

**Why embed `results` inside each simulation?**

The **`results`** object (totals and yearly breakdown) is **always needed together** with that simulation when viewing details. It is **structured and bounded**. Embedding avoids an extra collection and extra queries while keeping read patterns simple.

---

## Question 4 — Core FinTech logic (trace with numbers)

**Question:** Explain the core simulation logic with a concrete example.

**Answer:**

**Example inputs:** **$5,000** initial, **$200** per month, **8%** annual rate, **10** years, **high** risk.

**Step 1 — Adjust rate for risk:**  
High risk multiplies the annual rate by **1.2**, so **8% × 1.2 = 9.6%**.

**Step 2 — Monthly rate:**  
Convert to a monthly rate: **9.6% / 12 / 100 = 0.008** per month (0.8% per month as a decimal rate factor).

**Step 3 — Monthly update rule:**  
Each month, update balance as:  
**newValue = oldValue × (1 + monthlyRate) + 200**

**Step 4 — Track contributions:**  
Start with **$5,000** invested. Each month add **$200** to the running **total invested** total.

**Step 5 — Year-end volatility:**  
After each full year, apply a small random volatility shock (for high risk, roughly up to about **±2%** in this project’s model). That makes each run slightly different, which matches the idea of a **simulation** rather than a fixed formula.

**Step 6 — Contributions after 10 years:**  
10 years is **120** months of **$200**, so contributions are **120 × 200 = 24,000**. With the initial **5,000**, **total invested = 29,000** dollars.

**Step 7 — Output meaning:**  
**Projected value** is the simulated ending balance after compounding and volatility. **Gain/loss** is **projected value minus total invested**. The user can compare that gain to a personal goal; it is **not** a guarantee of real investment performance.

---

## Question 5 — Name a real security flaw and how to fix it

**Question:** Identify a realistic security weakness in a student MERN deployment and explain a practical fix.

**Answer:**

**Flaw:** The **JWT signing secret** (`JWT_SECRET`) must stay private. If it is **leaked** (for example by committing **`.env`** to GitHub, sharing screenshots, or pasting it in chat), an attacker can **forge valid JWTs** and impersonate users without knowing passwords.

**Fix:**

1. **Never commit** `.env` to version control. Ensure **`.gitignore`** excludes `.env`.  
2. Generate a **strong random secret** (for example 32+ bytes from a cryptographic random source) instead of a short guessable string.  
3. Set secrets only in **hosting environment variables** (Render / Railway dashboard), not inside source files.  
4. If a leak happens, **rotate** the secret immediately and force users to log in again (shorter token lifetimes help limit damage).  
5. For production systems beyond this course, add **monitoring**, **HTTPS everywhere**, and more defenses (rate limiting, etc.), but the **secret handling** issue above is the clearest “real” failure mode for this project level.

---

## Optional — Live deployment lines (fill in for your sheet)

**Backend API base URL:** `https://assignment-3-web-alp4.onrender.com`  

**Frontend URL:** _Paste your Vercel (or Netlify) URL here._  

**Environment note:** The frontend uses **`REACT_APP_API_URL`** pointing at the backend so API calls work in production.
