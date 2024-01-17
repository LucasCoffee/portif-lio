const app = require('./index');
const port = 8080
app.listen(port, (err) => {
    if (!err) {
        console.log("Server ON")
    } else {
        console.log("Server OFF")
    }
})