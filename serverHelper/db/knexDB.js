import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection:  'postgres://uwgsceglmhiahr:62dfb9d3745e4cb6e26ee3fe5216ef4f7b83f7002015fbdb57f071da0a6446ea@ec2-54-145-188-92.compute-1.amazonaws.com:5432/df9dvr8klb5sof',
  ssl: { rejectUnauthorized: false }
});

export default connection;