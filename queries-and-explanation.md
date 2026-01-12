#Slow Query Analysis
Query 1: Ticket Listing Dashboard (Tenant-wise)

This query represents a dashboard that shows the latest open tickets for a tenant.

Query Used
db.tickets.find({
  tenantId: "tenant_1",
  status: "open",
  createdAt: { $gte: ISODate("2024-01-01") }
})
.sort({ createdAt: -1 })
.limit(20)

--Performance Issue (Before Optimization)

MongoDB used a single-field index on createdAt

MongoDB scanned approximately 25,000 documents to return only 20 results

Filtering by tenantId and status occurred after scanning

Sorting required additional processing

This resulted in slow dashboard performance, which is not suitable for a multi-tenant production system.

Performance Analysis Command
.explain("executionStats")


--Observed problems:

Index used: createdAt_1

High totalDocsExamined

Inefficient execution plan

--Optimization Applied

A compound index was created to match the query’s filter and sort pattern.

Index Definition:
db.tickets.createIndex({
  tenantId: 1,
  status: 1,
  createdAt: -1
})

--Reasoning for Index Order

tenantId first to isolate tenant data in a multi-tenant system

status second as it is a common filter

createdAt last to support sorting and date range queries

--Result After Optimization

MongoDB used the compound index

Documents examined reduced from ~25,000 to 20

Sorting handled directly by the index

Query execution time reduced to near zero

Performance improvement was verified using:

.explain("executionStats")

#Regex Search Performance Issue
Query Used:
db.tickets.find({
  description: { $regex: "refund", $options: "i" }
})

Problem:

Regex search caused a collection scan (COLLSCAN)

MongoDB scanned all 100,000 documents

High CPU usage

Poor scalability

Regex-based search is inefficient for large text fields and production workloads.

#Full-Text Search Optimization
Solution:

MongoDB native full-text search was implemented to replace regex search.

--Text Index Created
db.tickets.createIndex({
  subject: "text",
  description: "text",
  tags: "text"
})

--Text Search Query
db.tickets.find(
  { $text: { $search: "refund delayed response" } },
  { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } })

--Result

MongoDB used an inverted text index

No collection scan

Faster and scalable search

Results ranked using textScore based on relevance

#Index Design Summary

Indexes were designed based on real application access patterns.

--Tenant Dashboard
{ tenantId: 1, status: 1, createdAt: -1 }

--Agent Workload View
{ agentId: 1, status: 1 }

--SLA Escalation Queries
{ createdAt: 1 }

--Tag-Based Filtering
{ tags: 1 }


Each index reduces document scanning and improves query performance.

#Conclusion

This assignment demonstrates a complete MongoDB performance optimization workflow:

Large-scale data insertion

Identification of slow queries using explain()

Optimization using compound indexes

Replacement of regex search with native full-text search

Validation of performance improvements using execution statistics

The approach reflects real-world database optimization practices required for scalable, multi-tenant systems.