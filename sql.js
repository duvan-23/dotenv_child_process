import knex from 'knex';
class ClienteSQL {
    constructor(options) {
        this.knex = knex(options)
    }
    crearTabla() {
        return this.knex.schema.dropTableIfExists('mensajes')
        .finally(() => {
            return this.knex.schema.createTable('mensajes', table => {
                table.increments('id').primary()
                table.string('author', 50).notNullable()
                table.string('message', 100).notNullable()
                table.string('fecha', 30).notNullable()
            })
        })
    }

    insertarMensajes(mensajes) {
        return this.knex('mensajes').insert(mensajes);
    }

    listarMensajes() {
        return this.knex('mensajes').select('*');
    }

    close() {
        this.knex.destroy()
    }
}

export default ClienteSQL;