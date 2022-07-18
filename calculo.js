const calculo = (num) => {
    let numeros=[];
    let limite=num;
    for (let index = 0; index < limite; index++) {
        numeros.push(random_num(1000));
        
    }
    let unicosEl= [];
    let almacenrepetidos=[];
    let contador = 1;
    numeros= numeros.sort();
    
    for (let i = 0; i < numeros.length; i++) {
        if(numeros[i+1]==numeros[i]){
            contador=contador+1;
        }else{
            unicosEl.push(numeros[i]);
            almacenrepetidos.push(contador);
            contador = 1;
        }
        
    }
    let final=[];
    let obj={};
    for (let j = 0; j < unicosEl.length; j++) {
        obj[unicosEl[j]]=almacenrepetidos[j];
        final.push(obj);
        obj={};
    }

    return final;
    
}
function random_num(max){
    return Math.floor(Math.random() * (max))+1;
}
process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', msg => {
    console.log(`worker #${process.pid} iniciando su tarea`)
    const sum = calculo(msg);
    process.send(sum)
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')