db.getCollection("feedback").updateMany(
  {},
  {
    $unset: {
      isComplaint: "",
      keywords: "",
      moderationStatus: "",
      response: ""
    }
  }
);
