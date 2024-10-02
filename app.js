const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("<div>");
    res.write("<p>Hellooooo, Man!</p>");
    res.write(
      "<form action='/create-user' method='POST'><input name='user' /><button type='submit'>Submit</button></form>"
    );
    res.write("</div>");
    return res.end();
  }
  if (req.url === "/users") {
    res.write("<ul>");
    res.write("<li>Deva</li>");
    res.write("<li>Prasanth</li>");
    res.write("</ul>");
    return res.end();
  }
  if (req.url === "/create-user" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const data = Buffer.concat(body).toString();
      const parsedBody = new URLSearchParams(data).get("user");
      fs.writeFileSync("users.txt", parsedBody);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
});

server.listen(3000);
