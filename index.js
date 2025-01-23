import { createServer } from 'http';
import { readFile, appendFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = 8050;
const __dirname = dirname(fileURLToPath(import.meta.url)); 


const logRequest = async (url) => {
    const logEntry = `${new Date().toISOString()} - Request URL: ${url}\n`;
    const logFilePath = join(__dirname, "log.txt");
    try {
        await appendFile(logFilePath, logEntry);
    } catch (err) {
        console.error(`Error writing to log file: ${err}`);
    }
};


const serveHtmlFile = async (res, filePath) => {
    try {
        const content = await readFile(filePath, "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.statusCode = 200;
        res.end(content);
    } catch (err) {
        console.error(`Error reading file ${filePath}: ${err}`);
        res.statusCode = 404;
        res.end("<h1>Page not found</h1>");
    }
};

const server = createServer(async (req, res) => {
    const url = req.url;

    await logRequest(url);

    const routes = {
        "/": "index.html",
        "/products": "products.html",
        "/login": "login.html",
        "/signup": "signup.html",
        "/profile": "profile.html",
        "/cart": "cart.html",
        "/checkout": "checkout.html",
        "/orders": "orders.html",
        "/categories": "categories.html",
        "/chat": "chat.html",
        "/contact": "contact.html",
        "/about": "about.html",
    };

    const fileName = routes[url];
    if (fileName) {
        const filePath = join(__dirname, "content", fileName); // Construct path to the file
        await serveHtmlFile(res, filePath);
    } else {
        res.statusCode = 404;
        res.end("<h1>Page not found</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
