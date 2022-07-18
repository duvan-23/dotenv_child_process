import knex from 'knex';
class ClienteSQL1 {
    constructor(options) {
        this.knex = knex(options)
    }
    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
        .finally(() => {
            return this.knex.schema.createTable('productos', table => {
                table.increments('id').primary()
                table.string('nombre', 50).notNullable()
                table.double('precio')
                table.string('foto', 100).notNullable()
            })
        })
    }

    insertarProductos(productos) {
        return this.knex('productos').insert(productos);
    }

    listarProductos() {
        return this.knex('productos').select('*');
    }

    close() {
        this.knex.destroy()
    }
}

export default ClienteSQL1;