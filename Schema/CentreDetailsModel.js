var mongoose = require("mongoose");
var schema = mongoose.Schema;
let CentreDetailSchema = new schema({
  Name: String,
  Email: {
    type: String,
    unique: true,
  },
  Facilities: {
    oxygen: Boolean,
    ventilator: Boolean,
    hospitalBed: Boolean,
    medicine: Boolean,
    openMedicineDock: Boolean,
    doctor: Boolean,
    location: Boolean,
    Qfacilities: Boolean,
  },
  Amount: {
    No_oxygen: String,
    No_ventilator: String,
    No_hospitalBed: String,
    No_doctor: String,
    location: String,
    No_Qfacilities: String,
  },
  Location: {
      type:{
        type : String,
        enum: ['Point'],
        requied: true,
      },
      coordinates: {
        type: [Number],
        required: true
      }
  }
});
CentreDetailSchema.index({ "Location": "2dsphere" });
module.exports = mongoose.model("CentreDetail", CentreDetailSchema);
