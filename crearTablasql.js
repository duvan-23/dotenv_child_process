const ClienteSQL1 =require('./sql1.js');
const { options1 }=require('./options/mysqlconn.js')

const sql = new ClienteSQL1(options1)

try{
    await sql.crearTabla();
    console.log("1-Tabla productos creada");
} catch(error){
    console.log(error);
} finally {
    sql.close();
}