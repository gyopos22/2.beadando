'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', table => {
      table.increments()
      table.int('user_id').unsigned().references('id').inTable('users')
      table.string('name', 254).notNullable().unique()
      table.int('hours', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

class JobsTableSchema extends Schema {

  up () {
    this.create('days', table => {
      table.increments()
      table.int('day_id').unsigned().references('id').inTable('users')
      table.int('starthours').notNullable()
      table.int('endhours').notNullable()
      table.int('day_number').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
