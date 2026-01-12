// Text index
db.tickets.createIndex({
  subject: "text",
  description: "text",
  tags: "text"
})

// Text search query
db.tickets.find(
  { $text: { $search: "refund delayed response" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
