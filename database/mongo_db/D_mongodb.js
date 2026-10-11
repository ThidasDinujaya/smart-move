// SmartMove MongoDB module for the assigned team member.
// Open the MongoDB Compass embedded mongosh shell and run load("C:/path/to/module.js").
// All three modules use the smartmove database and share Oracle reference ids.

// D owns vehicle documents and images.
var dSmartmove = db.getSiblingDB("smartmove");
function createDCollectionIfMissing(name, validator) {
  if (!dSmartmove.getCollectionNames().includes(name)) {
    dSmartmove.createCollection(name, { validator: { $jsonSchema: validator }, validationLevel: "moderate", validationAction: "error" });
  }
}

// Vehicle image and document details stay flexible while file content lives in object storage.
createDCollectionIfMissing("vehicle_media", {
  bsonType: "object",
  required: ["vehicleOracleId", "registrationNo", "mediaType", "fileName", "storageUrl", "uploadedAt"],
  properties: {
    vehicleOracleId: { bsonType: ["int", "long", "double"], description: "Vehicle primary key from Oracle" },
    registrationNo: { bsonType: "string" },
    mediaType: { enum: ["PHOTO", "REGISTRATION_DOCUMENT", "INSURANCE", "INSPECTION_REPORT", "OTHER"] },
    fileName: { bsonType: "string" },
    contentType: { bsonType: "string" },
    storageUrl: { bsonType: "string" },
    uploadedAt: { bsonType: "date" },
    expiresAt: { bsonType: ["date", "null"] },
    metadata: { bsonType: "object" }
  }
});

// Vehicle media lookup index.
dSmartmove.vehicle_media.createIndex({ vehicleOracleId: 1, mediaType: 1 });

// Retrieve vehicle documents and images by their Oracle vehicle id.
print("Vehicle documents and images for vehicle 1:");
printjson(dSmartmove.vehicle_media.find({ vehicleOracleId: 1 }).sort({ uploadedAt: -1 }).toArray());