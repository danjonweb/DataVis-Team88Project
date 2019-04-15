# DataVis-Team88Project:UI

## Environment Setup
You should have node.js and node package manager (npm) set up globally on your machine:
- Node.js 10.12.0 EXACTLY is required to run this project
- In order to download the database stored in this repository gitLFS must be installed on your machine
- Ensure that you are not running an add blocker on your web browser as it can reject some of the API calls made by the developement version of this application

#### node.js
https://nodejs.org/en/

#### Gerneral Instructions:
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

#### To confrim your are ready
Typing the following two commands into terminal should return version numbers.  
Note that Node version 10.12.0 EXACTLY is required
```
node -v
v10.12.0
```
```
npm -v
```


# Setup the project and start the UI on your local machine

## From within the DestExplorUI directory:

## Project setup
```
npm install
```

### Start the database server
```
node server.js
```

### Compiles and hot-reloads for development
```
npm run serve
```

## From here on you can ignore until we want to build for 'production':

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
