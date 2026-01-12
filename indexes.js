// Dashboard optimization
db.tickets.createIndex({
  tenantId: 1,
  status: 1,
  createdAt: -1
})

// Agent workload
db.tickets.createIndex({
  agentId: 1,
  status: 1
})

// SLA escalation
db.tickets.createIndex({
  createdAt: 1
})

// Tag filtering
db.tickets.createIndex({
  tags: 1
})
