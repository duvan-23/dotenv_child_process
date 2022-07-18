import ClienteSQL from './sql.js';
import { options } from './options/sqlite.js'
import ClienteSQL1 from './sql1.js';
import { options1 } from './options/mysqlconn.js'
import { faker } from '@faker-js/faker';
import ContenedorMongoDb from './ContenedorMongoDb.js';
import bcrypt from 'bcrypt';
import ContenedorMongoDb_users from './ContenedorMongoDb_users.js';
// const { normalize, denormalize, schema } = require('normalizr');
import { normalize, denormalize, schema } from 'normalizr';
import util from 'util';
import dotenv from 'dotenv/config'
faker.locale = 'es';
const sql1 = new ClienteSQL1(options1);
const url = process.env.URL;
const contenedorMongo = new ContenedorMongoDb(url);
// const contenedorMongo_users = new ContenedorMongoDb_users("usuarios");
const sql = new ClienteSQL(options);

import express from 'express';

import { createServer } from "http";

import { Server } from "socket.io";
//passport
import passport from "passport";
import * as PassportLocal from "passport-local";
//session
import session from 'express-session'
// --------------------------------------//
import MongoStore from 'connect-mongo'
//------
import parseArgs from 'minimist';
const options_puerto ={
    alias:{
        p:'puerto'
    },
    default:{
        puerto:8080
    }
}
//-------
import { fork } from 'child_process'
import path from 'path'
//-------
const { puerto }= parseArgs(process.argv.slice(2),options_puerto);
//--------
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true }
//--------------------
function createRandomProject(id) {
    return {
        id: id,
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(1000, 1000000, 0, '$'),
        foto: faker.image.business(150,150, true)
    }
}
const usuarios = [];
//---------------------------------------------------//

// PASSPORT REGISTER
passport.use('register', new PassportLocal.Strategy({
    passReqToCallback: true
  }, async (req, username, password, done) => {
  
    const { direccion } = req.body

    // const usuario = usuarios.find(usuario => usuario.username == username);
    const usuario = await contenedorMongo.getByNombre(username);
    if (usuario!="Nombre especificado no existe en el archivo") {
      return done('user already registered')
    }
    const rounds = 10;
    bcrypt.hash(password, rounds, async(err, hash) => {
        if (err) {
          console.error(err)
          return
        }
        const contador=0;
        password=hash;
        const user = {
        username,
        password,
        direccion,
        contador
        }
        await contenedorMongo.insertarUsuarios(user);

        return done(null, user)
    })   
  }))

  //---------------------------------------------------//
// PASSPORT LOGIN
passport.use('login', new PassportLocal.Strategy(async(username, password, done) => {
    // const user = usuarios.find(usuario => usuario.username == username)
    const user =await  contenedorMongo.getByNombre(username);
    if (user=="Nombre especificado no existe en el archivo") {
      return done(null, false)
    }
    let respuesta;
    bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          console.error(err)
          return
        }
        respuesta=res; //true or false
        if (!respuesta) {
            return done(null, false)
        }
        user.contador = 0
        return done(null, user)
    })
    
}))
//---------------------------------------------------//
// SERIALIZAR Y DESERIALIZAR

passport.serializeUser(function(user, done) {
    done(null, user.username)
  })
  
  passport.deserializeUser(async function(username, done) {
    // const usuario = usuarios.find(usuario => usuario.username == username);
    const usuario =await  contenedorMongo.getByNombre(username);
    done(null, usuario)
  })


const app = express()
app.use(
  session({
      secret: 'shhhhhhhhhhhhhh',
      resave: false,
      saveUninitialized: false,
      cookie: {
          maxAge: 600000,
      },
      rolling: true,
  })
)
//---------------------------------------------------//
// MIDDLEWARES DE PASSPORT
app.use(passport.initialize())
app.use(passport.session())
//--------------------------------
const httpServer = new createServer(app)
const io = new Server(httpServer)

//mongo y session
// app.use(
//     session({
  
//       store: MongoStore.create({
//           mongoUrl: 'mongodb+srv://duvan:123@cluster0.sdggjza.mongodb.net/sessions?retryWrites=true&w=majority',
//           mongoOptions: advancedOptions,
//           ttl: 600,
//       }),
  
  
//       secret: 'obiwankenobi',
//       resave: false,
//       saveUninitialized: false,
//     })
// )

//----------------
app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('views', './public')

app.set('view engine', 'pug')

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }

await contenedorMongo.conectar();
app.get('/register', (req, res) => {
    res.render('./views/register');
})
app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/'}))

app.get('/failregister', (req, res) => {
    res.render('./views/register-error')
})

app.get('/', isAuth, async(req, res) => {
     if (!req.user.contador) {
        req.user.contador = 0
    }
    let contador =req.user.contador+1;
    await contenedorMongo.putUsuarios(req.user.username,contador);
    console.log(`${req.user.username}, visitaste la pagina ${contador} veces`);
    res.render('./views/mensajes',{nombre:req.user.username})
})

app.post('/', (req, res) => {
    let datos = req.body.nombre;
    if (req.user.contador) {
        req.user.contador++
        console.log(`${req.user.username}, visitaste la pagina ${req.user.contador} veces`);
        res.redirect('/');
    } else if(req.body.nombre){
        req.user.contador = 1;
        req.user.username = datos;
        console.log(`Hello there. ${req.user.username}`);
        res.redirect('/');
    }else{
        res.redirect('/login');
    }
    
})
app.get('/api/productos-test', (req, res) => {
    const cant = 5;
    const productos = Array.from(new Array(cant), (v, i) => createRandomProject(i + 1))
    res.render('./views/productosFake',{productos:productos})
})

app.get('/login', (req, res) => {
    // res.sendFile('index.pug', {root: __dirname})
    if (req.isAuthenticated()) {
        res.redirect('/');
    }else{
        res.render('./views/login')
    }
})
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/'}))

app.get('/faillogin', (req, res) => {
  res.render('./views/login-error')
})

// app.post('/login', (req, res) => {
//     // res.sendFile('index.pug', {root: __dirname})
//      nombre=req.body.nombre;
// })

app.get('/logout', (req, res) => {
    req.logout(err => {
        res.redirect('/login')
        // res.render('./views/adios',{nombre:nombre})
      })
})
const args = process.argv;
const argumentos = args.slice(2);
const ejecutable = process.execPath.split('/').pop();
const pid = process.pid;
const carpeta = process.cwd();
const rss = process.memoryUsage.rss();
const plataforma = process.platform;
const node_v = process.version;
app.get('/info', isAuth, async(req, res) => {
   res.render('./views/info',{datos:[argumentos , ejecutable, pid, carpeta, rss, plataforma, node_v]})
})
//node --max-old-space-size=8192 server -p 8085 d 33
app.get('/api/randoms', isAuth, async(req, res) => {
    const numero =req.query.cant;
    let numero1 = parseInt (numero);
    if(!(numero1>0)){
        numero1=100000000;
    }
    const computo = fork(path.resolve(process.cwd(), 'calculo.js'))
    computo.send(numero1);
    computo.on('message', resultado => {
        if (resultado === 'listo') {
            computo.send('start')
        } else {
            res.json({ resultado })
        }
    })
})
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado!')
    let mensajes;
    // socket.emit('messages', messages)
    // socket.emit('messages', await contenedorMensajes.getAll())

    //normalizr 
    const user = new schema.Entity('users');

    const comment = new schema.Entity('comments', {
        commenter: user
    })

    const post = new schema.Entity('posts', {
        author: user,
        comments: [comment]
    })

    const blog = new schema.Entity('blog', {
        posts: [post]
    })


        

    function print(objeto) {
        console.log(util.inspect(objeto,false,12,true))
    }
    const consulta =await contenedorMongo.listarMensajes();
    const datos ={
        id: "10000",
        posts:consulta
    }
    console.log('Objeto normalizado')
    const normalizedHolding = normalize(datos, blog)
    print(normalizedHolding)
    // Porcentaje de reduccion
    // console.log('Porcentaje de reduccion')
    // console.log(100 - ((JSON.stringify(normalizedHolding).length * 100) / JSON.stringify(datos).length))


    // console.log('Objeto denormalizado')
    // const denormalizedHolding = denormalize(normalizedHolding.result, blog, normalizedHolding.entities)
    // print(denormalizedHolding)

    socket.emit('messages', normalizedHolding)

    socket.on('new-message', async data => {
        let mensajes;
        await contenedorMongo.insertarMensajes(data);
        // await contenedorMongo.insertarMensajes(data);
        const consulta =await contenedorMongo.listarMensajes();
        const user = new schema.Entity('users');

    const comment1 = new schema.Entity('comments', {
        commenter: user
    })

    const post1 = new schema.Entity('posts', {
        author: user,
        comments: [comment1]
    })

    const blog1 = new schema.Entity('blog', {
        posts: [post1]
    })
        const datos1 ={
            id: "10000",
            posts:consulta
        }
        console.log('Objeto origen')
        // print(datos1)
        
        console.log('Objeto normalizado')
        const normalizedHolding1 = normalize(datos1, blog1)
        print(normalizedHolding1)

        io.sockets.emit('messages', normalizedHolding1)
    })
    // socket.emit('products', productos)
    socket.emit('products', await sql1.listarProductos())

    socket.on('new-product', async data => {
        // productos.push(data)
        await sql1.insertarProductos(data);
        io.sockets.emit('products',  await sql1.listarProductos())
    })
})

const PORT = process.env.PORT || puerto

httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))