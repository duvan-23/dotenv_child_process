const ClienteSQL= require ('./sql.js');
const { options }=require('./options/sqlite.js');

const sql = new ClienteSQL(options)

try{
    await sql.crearTabla();
    console.log("1-Tabla mensajes creada");
} catch(error){
    console.log(error);
} finally {
    sql.close();
}