// SmartMove MongoDB module for the assigned team member.
// Open the MongoDB Compass embedded mongosh shell and run load("C:/path/to/module.js").
// All three modules use the smartmove database and share Oracle reference ids.

// J owns passenger reviews, moderation, and review analytics.
var jSmartmove = db.getSiblingDB("smartmove");
function createJCollectionIfMissing(name, validator) {
  if (!jSmartmove.getCollectionNames().includes(name)) {
    jSmartmove.createCollection(name, { validator: { $jsonSchema: validator }, validationLevel: "moderate", validationAction: "error" });
  }
}

// Reviews repeat useful route, vehicle, and driver references for fast feedback searches.
createJCollectionIfMissing("feedback", {
  bsonType: "object",
  required: ["passengerOracleId", "tripOracleId", "routeOracleId", "vehicleOracleId", "driverOracleId", "ratings", "comment", "submittedAt", "isComplaint", "keywords"],
  properties: {
    passengerOracleId: { bsonType: ["int", "long", "double"] },
    tripOracleId: { bsonType: ["int", "long", "double"] },
    routeOracleId: { bsonType: ["int", "long", "double"] },
    routeName: { bsonType: "string" },
    vehicleOracleId: { bsonType: ["int", "long", "double"] },
    registrationNo: { bsonType: "string" },
    driverOracleId: { bsonType: ["int", "long", "double"] },
    driverName: { bsonType: "string" },
    ratings: {
      bsonType: "object",
      required: ["overall"],
      properties: {
        overall: { bsonType: ["int", "double"], minimum: 1, maximum: 5 },
        vehicle: { bsonType: ["int", "double"], minimum: 1, maximum: 5 },
        driver: { bsonType: ["int", "double"], minimum: 1, maximum: 5 }
      }
    },
    comment: { bsonType: "string" },
    isComplaint: { bsonType: "bool" },
    keywords: { bsonType: "array", items: { bsonType: "string" } },
    submittedAt: { bsonType: "date" },
    moderationStatus: { enum: ["NEW", "REVIEWED", "HIDDEN"] },
    response: { bsonType: ["object", "null"] }
  }
});

// Indexes support route, vehicle, driver, and keyword review searches.
jSmartmove.feedback.createIndex({ routeOracleId: 1, submittedAt: -1 });
jSmartmove.feedback.createIndex({ vehicleOracleId: 1, "ratings.vehicle": -1 });
jSmartmove.feedback.createIndex({ driverOracleId: 1, "ratings.driver": -1 });
jSmartmove.feedback.createIndex({ comment: "text", keywords: "text" });

// Retrieve every review for a route.
print("Reviews for route 1:");
printjson(jSmartmove.feedback.find({ routeOracleId: 1, moderationStatus: { $ne: "HIDDEN" } }).sort({ submittedAt: -1 }).toArray());

// Find vehicles with the highest average customer rating.
print("Highest-rated vehicles:");
printjson(jSmartmove.feedback.aggregate([
  { $match: { moderationStatus: { $ne: "HIDDEN" } } },
  { $group: { _id: "$vehicleOracleId", registrationNo: { $first: "$registrationNo" }, averageRating: { $avg: "$ratings.vehicle" }, reviewCount: { $sum: 1 } } },
  { $sort: { averageRating: -1, reviewCount: -1 } },
  { $limit: 5 }
]).toArray());

// Find drivers with the highest average customer rating.
print("Highest-rated drivers:");
printjson(jSmartmove.feedback.aggregate([
  { $match: { moderationStatus: { $ne: "HIDDEN" } } },
  { $group: { _id: "$driverOracleId", driverName: { $first: "$driverName" }, averageRating: { $avg: "$ratings.driver" }, reviewCount: { $sum: 1 } } },
  { $sort: { averageRating: -1, reviewCount: -1 } },
  { $limit: 5 }
]).toArray());

// Search complaint comments and keywords using MongoDB text search.
print("Complaints mentioning delay:");
printjson(jSmartmove.feedback.find(
  { isComplaint: true, moderationStatus: { $ne: "HIDDEN" }, $text: { $search: "delay" } },
  { score: { $meta: "textScore" }, routeName: 1, registrationNo: 1, driverName: 1, comment: 1, submittedAt: 1 }
).sort({ score: { $meta: "textScore" } }).toArray());