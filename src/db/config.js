module.exports = {
    database_connection_string: `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASS}@web-umbrella-project.gxale.mongodb.net/${process.env.COLLECTION_NAME}?retryWrites=true&w=majority`
}