// Insert 50,000 realistic support tickets

const statuses = ["open", "pending", "resolved", "closed"]
const priorities = ["low", "medium", "high"]
const tagsPool = ["refund", "payment", "login", "delay", "bug", "urgent"]

let bulkData = []

for (let i = 1; i <= 50000; i++) {
  bulkData.push({
    tenantId: "tenant_" + (i % 5),
    ticketNumber: "TCK-" + i,
    subject: "Issue related to payment and refund",
    description: i % 3 === 0
      ? "Customer is asking for a refund due to delayed response"
      : "General support issue regarding account usage",
    status: statuses[i % 4],
    priority: priorities[i % 3],
    tags: [tagsPool[i % tagsPool.length]],
    customerEmail: `user${i}@mail.com`,
    agentId: "agent_" + (i % 10),
    createdAt: new Date(2024, i % 12, i % 28),
    updatedAt: new Date()
  })
}

db.tickets.insertMany(bulkData)
