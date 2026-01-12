# Dexkor Internship Assignment  
## MongoDB Performance Optimization & Full-Text Search

---

## Overview
This assignment simulates a real-world, multi-tenant customer support ticketing system used by Dexkor.  
The goal was to identify slow MongoDB queries, analyze performance bottlenecks using `explain()`, and apply proper indexing and search techniques to improve query efficiency at scale.

---

## Part 1: Data Setup
- Inserted **100,000 realistic ticket documents** into a `tickets` collection
- Data includes multiple tenants, agents, statuses, priorities, tags, and timestamps
- Bulk insertion was used to simulate production-scale workloads

This data volume was intentionally chosen to expose real performance issues.

---

## Part 2: Slow Query Analysis

### Query 1: Ticket Listing Dashboard (Tenant-wise)

**Query Pattern:**
- Filter by `tenantId` and `status`
- Filter by `createdAt` (date range)
- Sort by `createdAt` (descending)
- Limit results to 20 tickets

---

### Problem (Before Optimization)
- MongoDB initially used a **single-field index on `createdAt`**
- As a result, MongoDB scanned over **25,000 documents** to return just 20 results
- This caused unnecessary document fetching and higher execution time

**Evidence:**
- `explain("executionStats")` showed:
  - Index used: `createdAt_1`
  - High `totalDocsExamined`
- Screenshot included in `screenshots/02-before-compound-index.png`

---

### Solution
A **compound index** was created to match the query access pattern:

```js
{ tenantId: 1, status: 1, createdAt: -1 }

