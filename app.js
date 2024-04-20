const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`El servidor está inicializado en el puerto ${PORT}`)
})

app.use(express.static("assets"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/agregar", (req, res) => {
    const { nombre, precio } = req.query
    const usuario = {
        nombre,
        precio,    
    };

    const data = JSON.parse(fs.readFileSync("usuario.json", "utf8"));
    data.usuarios.push(usuario);

    fs.writeFile("usuario.json", JSON.stringify(data), (err)=>{
        res.send("Deporte almacenado con éxito");
    });
});

app.get('/deportes', (req, res) => {
    fs.readFile("usuario.json", "utf8", (err, data) =>{        
        const usuarioLeido = JSON.parse(data);
            res.json({ usuarioLeido });
    });
});

app.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;
    fs.readFile("usuario.json", "utf8", (err, data) => {
        let usuarios = JSON.parse(data).usuarios;
        usuarios = usuarios.map(u => {
            if (u.nombre === nombre) {
                u.precio = precio;
                return u;
            }
            return u;
        });

        fs.writeFile("usuario.json", JSON.stringify({ usuarios }), err => {            
            return res.send("Precio actualizado correctamente");
        });
    });
});

app.get('/eliminar', (req, res) => {
    const { nombre } = req.query;

    fs.readFile("usuario.json", "utf8", (err, data) => {
        let usuarios = JSON.parse(data).usuarios;
        usuarios = usuarios.filter(u => u.nombre !== nombre);

        fs.writeFile("usuario.json", JSON.stringify({ usuarios }), err => {
            return res.send("Deporte eliminado correctamente");
        });
    });
});
