const mongoose = require("mongoose");
const newObjId = new mongoose.Types.ObjectId();
console.log('New Obj Id: ', newObjId);
console.log('New Obj Id Timestamp: ', newObjId.getTimestamp());
console.log('New Obj Id Generation Time: ', newObjId.generationTime);
console.log('Is New Object Id valid: ', mongoose.Types.ObjectId.isValid(newObjId));
console.log('is afrfsdf valid: ', mongoose.Types.ObjectId.isValid('afrfsdf'));