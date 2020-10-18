# Flickr Gallery

A website to fetch photo data from flickr with different size configuration.

- [flickr-gallery](#flickr-gallery)
  - [Development](#development)
  - [Production](#production)
  - [Quick Start](#quick-start)
  - [Documentation](#documentation)
    - [Folder Structure](#folder-structure)
  - [Demo](#show-case)

### Development

During the development, we will running 2 servers. 
* The front-end code will be served by [webpack dev server](https://webpack.js.org/configuration/dev-server/) to reload the page when changes made.
* The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Production

In the production mode, since all client side code will be bundled into the static files by using webpack, so we will only need to run 1 server.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/rainclaire/flickr-gallery

# Go inside the directory
cd flickr-gallery

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Documentation

### Folder Structure
All the source code will be inside **src** directory. Inside src, there is client and server directory. 
* The frontend code (react, scss, js and any other assets) will be in client directory. 
* The backend Node.js/Express code will be in the server directory.


## Demo
### Show Cases
![hippo](https://i.gyazo.com/e533680c8331b7e35bc339262a71bd25.gif)

![Image from Gyazo](https://i.gyazo.com/7e86c043bf4f59da09da12fb3bddeb4e.png)
