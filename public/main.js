const socket = io.connect();

const olvidar=document.getElementById("olvidar");
if(olvidar){
    olvidar.addEventListener('click',(e)=>{
        e.preventDefault();
        window.location.href=`/logout`;
       
    });
}

function addProducto() {

    const producto = {
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        foto: document.getElementById("foto").value,
    }
    socket.emit("new-product", producto);
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("foto").value = "";

    return false
}
function addMessage() {
    let date = new Date();
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let hour = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
    const message = {
        author: {
            id:document.getElementById("email").value,
            nombre:document.getElementById("nombre1").value,
            apellido:document.getElementById("apellido").value,
            edad:document.getElementById("edad").value,
            alias:document.getElementById("alias").value,
            avatar:document.getElementById("avatar").value
        },
        text: {
            message:document.getElementById("text").value,
            fecha:`${day}/${month}/${year} ${hour}:${min}:${sec}`
        }
    }
    socket.emit("new-message", message);

    document.getElementById("text").value = ""
    document.getElementById("text").focus()

    return false
}
function renderProductos(data) {
    let html_titulo=`<h2 style="color:blue;">Productos</h2><br>`;
    let html1="";
    let html2="";
    let html='<h3 class="alert alert-warning">No hay productos</h3>';
    if(data.length > 0) {
        html1=`
    <div class="table-responsive">
    <table class="table table-dark">
        <tr style="color: yellow;"> <th>Nombre</th> <th>Precio</th> <th style="text-align:center">Foto</th> </tr>`;
    html = data.map((elem, index) => {
        return(`<tr>
        <td>${elem.nombre}</td>
        <td>${elem.precio}</td>
        <td style="text-align:center"><img src="${elem.foto}" alt="" width="30%" height="30%" ></td>
    </tr>`)
    }).join(" ")
    html2=`</table>
    </div>`;
    }
    
    document.getElementById("products").innerHTML = html_titulo+html1+html+html2;
}
function renderMensajes(data) {
    // function print(objeto) {
    //     console.log(util.inspect(objeto,false,12,true))
    // }
    const user = new normalizr.schema.Entity('users');

    const comment = new normalizr.schema.Entity('comments', {
        commenter: user
    })

    const post = new normalizr.schema.Entity('posts', {
        author: user,
        comments: [comment]
    })

    const blog = new normalizr.schema.Entity('blog', {
        posts: [post]
    })
    console.log('Objeto desnormalizado')
    let denormalizedHolding = normalizr.denormalize(data.result, blog, data.entities)
    // print(denormalizedHolding)
    // Porcentaje de reduccion
    console.log('Porcentaje de reduccion')
    console.log(100 - ((JSON.stringify(data).length * 100) / JSON.stringify(denormalizedHolding).length))
    let html1;
    let html=`<h3 class="alert alert-warning">No hay Mensajes</h3>`;
    if(denormalizedHolding.posts.length > 0) {
        
        html = denormalizedHolding.posts.map((elem, index) => {
            
            return(`<div>
            <strong class="text-primary">${elem.author.id}</strong>  <span style="color:#6F4E37">[${elem.title.fecha}] :</span>
            <em class="text-success font-italic">${elem.title.message}</em><img src="${elem.author.avatar}" style="width:50px !important; height:50px !important"></img>
            </div>`)
        }).join(" ")
        let operacion=(100 - ((JSON.stringify(data).length * 100) / JSON.stringify(denormalizedHolding).length)).toFixed(2);
        html1=`(Compresión: ${operacion}%)`;
    }
    document.getElementById("messages").innerHTML = html;
    document.getElementById("porcentaje").innerHTML = html1;
}
socket.on("products", function(data) {renderProductos(data)})
socket.on("messages", function(data) {renderMensajes(data)})
