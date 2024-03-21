import 'dotenv/config'
let config: any = {}

config.server= {
    port: process.env.PORT || 8080,
}

config.db = {
    cs: process.env.mongodb,
    name: process.env.dbname
}

config.nodemailer= {
    key: process.env.NODEMAILER_KEY,
}


export default config;