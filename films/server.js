const app = require("./app");
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");
mongoose.connect(DB_URI, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('mongoose connection is successful on: ' + DB_URI);
    }
});

app.listen(3000, () => {
    console.log("running on port 3000");
    console.log("----------------------------");

});