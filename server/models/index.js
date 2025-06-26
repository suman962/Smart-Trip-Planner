const { userSchema, userTokenSchema } = require('./User.js');
const { TripSchema } = require('./Trips.js');


module.exports = function getModels(db) {
  return {
    User: db.model("User", userSchema, "users"),
    UserToken: db.model("UserToken", userTokenSchema, "user_tokens"),
    Trip: db.model("Trip", TripSchema, "trips")
  };
};