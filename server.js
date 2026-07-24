import app from './src/app.js'
import connectDB from './src/db/connectDB.js'

connectDB().then(()=> {
    app.listen(4000 , ()=> {
        console.log(`>> app is running on http://localhost:4000/ `)
    })
}).catch(error => console.log(error))