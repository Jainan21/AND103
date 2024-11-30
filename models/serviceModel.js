var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const service = new Schema({
    id: {type: ObjectId},
    name: {type: String},
    linkImage: {type: String}
});

module.exports = mongoose.models.service || mongoose.model("service", service);