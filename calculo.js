const calculo = (num) => {
    let numeros={};
    let limite=num;
    for (let index = 0; index < limite; index++) {
        let num = random_num(1000);
        if (!numeros[num]){
            numeros[num]=1;
        }else{
            numeros[num]++;
        }
        
    }
    return numeros;
    
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