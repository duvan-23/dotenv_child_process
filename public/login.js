
const enviar=document.getElementById("enviar");
if(enviar){
    enviar.addEventListener('click',(e)=>{
        e.preventDefault();
        const nombre=document.getElementById("nombre_login");
        if(nombre.value!=""){
            const data ={
                nombre: nombre.value
            };
            fetch(`/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(data)
            })
            setTimeout(() => {
                window.location.href=`/`;
            }, 1000);
            
            
        }else{
            document.getElementById("alerta").style.visibility = "visible";
            setTimeout(() => {
                document.getElementById("alerta").style.visibility = "hidden";
            }, 2000);
        }
    });
}
