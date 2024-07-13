const knex = require('knex')({
     client: 'pg',
     connection: {
          host: 'ec2-54-145-188-92.compute-1.amazonaws.com',
          port: 5432,
          user: 'uwgsceglmhiahr',
          password: '62dfb9d3745e4cb6e26ee3fe5216ef4f7b83f7002015fbdb57f071da0a6446ea',
          database: 'df9dvr8klb5sof'
     },
     pool: { min: 0, max: 7 }
});


const AddQuotationKnex = async () => {
     const quotation_id = "955s5as5-asasas"
     const date = new Date()
     const crn = Date.now()
     const client_object = { 
          name: "Sai Kumar"
     }

     try {
          const data = await knex('quotation_details').insert({
               quotation_id: quotation_id,
               crn: crn,
               date: date,
               client_object: client_object
          })
          return data
     } catch (error) {
         return error.message
     }
}

module.exports = AddQuotationKnex()