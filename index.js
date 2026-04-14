const http = require("http")
const port = 3000

const products = [
    {id:1, name:"Laptop", price:999.99, category:"electronics"},
    {id:2, name:"Book", price:19.99, category:"books"}
]

const server = http.createServer((req,res) => {
    const {method, url} = req
    res.setHeader('Content-Type', 'application/json');

    switch(method) {
        case 'GET':
            if(url === '/products') {
                res.writeHead(200)
                res.end(JSON.stringify(products))
            } else if (url.startsWith('/products/')) {
                const id = parseInt(url.split('/')[2])
                const product = products.find(p => p.id === id)
                if(!product){
                    res.writeHead(404)
                    return res.end(JSON.stringify({message:"Product not found"}))
                }
                res.writeHead(200)
                res.end(JSON.stringify(product))
            } else {
                res.writeHead(404)
                res.end(JSON.stringify({message:"Not found"}))
            }
            break;

        case 'POST':
            if(url === '/products') {
                let body = ''
                req.on('data', chunk => {
                    body += chunk.toString()
                })
                req.on('end', () => {
                    const newProduct = JSON.parse(body)
                    newProduct.id = products.length ? products[products.length-1].id + 1 : 1
                    products.push(newProduct)
                    res.writeHead(201)
                    res.end(JSON.stringify(newProduct))
                })
            } else {
                res.writeHead(404)
                res.end(JSON.stringify({message:"Not found"}))
            }
            break;

        case 'PUT':
            if(url.startsWith('/products/')) {
                const id = parseInt(url.split('/')[2])
                const index = products.findIndex(p => p.id === id)
                if(index === -1){
                    res.writeHead(404)
                    return res.end(JSON.stringify({message:"Product not found"}))
                }
                let body = ''
                req.on('data', chunk => {
                    body += chunk.toString()
                })
                req.on('end', () => {
                    const updatedProduct = JSON.parse(body)
                    products[index] = {...products[index], ...updatedProduct}
                    res.writeHead(200)
                    res.end(JSON.stringify(products[index]))
                })
            } else {
                res.writeHead(404)
                res.end(JSON.stringify({message:"Not found"}))
            }
            break;

        case 'DELETE':
            if(url.startsWith('/products/')) {
                const id = parseInt(url.split('/')[2])
                const index = products.findIndex(p => p.id === id)
                if(index === -1){
                    res.writeHead(404)
                    return res.end(JSON.stringify({message:"Product not found"}))
                }
                products.splice(index, 1)
                res.writeHead(200)
                res.end(JSON.stringify({message:"Product deleted"}))
            } else {
                res.writeHead(404)
                res.end(JSON.stringify({message:"Not found"}))
            }
            break;

        default:
            res.writeHead(405)
            res.end(JSON.stringify({message:"Method not allowed"}))
    }
})

server.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`)
})
