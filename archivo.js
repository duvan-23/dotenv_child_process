import fs from 'fs';

class Contenedor{
   
    constructor(nombre){
        this.nombre = nombre;
    }
    
    async save(data){
        let ruta =`./${this.nombre}`;
        return await leerTodo(ruta,data);
    }
    async getAll(){
        let ruta =`./${this.nombre}`;
        return await leerAll(ruta);
    }
    async getById(){
        return await leerId();
    }
}

async function leerAll(ruta){
    let resultado,r2;
    try{
        const contenido =await fs.promises.readFile(ruta, 'utf8');
        resultado =JSON.parse(contenido);
    }
    catch(err){
        resultado= err;
    }
    return resultado;
}

async function leerId(){
    let resultado,r2;
    try{
        const contenido =await fs.promises.readFile('./productos.txt', 'utf8');
        resultado =JSON.parse(contenido);
        r2=Math.floor(Math.random() * resultado.length) + 1;
        resultado.forEach(object =>{
            if(object.id === r2){
                resultado=object;
            }
        });
        if(resultado.length>0){
            resultado="Id especificado no exite en el archivo"
        }
    }
    catch(err){
        resultado= err;
    }
    return resultado;
}

async function leerTodo(ruta,data){
    let resultado,r2;
    try{
        const contenido =await fs.promises.readFile(ruta, 'utf8');
        resultado =JSON.parse(contenido);
        r2=resultado;
        resultado=resultado[resultado.length-1].id+1;
    }
    catch(err){
        r2= [];
        resultado= 1;
    }
    return guardar([resultado,r2],data,ruta);
}

async function guardar(resultados,data,ruta){
    let id;
    let datos =data;
    datos.id= resultados[0];
    resultados[1].push(datos);
    try{
        await fs.promises.writeFile(ruta, JSON.stringify(resultados[1],null, 2))
    }
    catch(err){
        console.log(err);
    }
}  

// exports.Contenedor = Contenedor;
export default Contenedor;