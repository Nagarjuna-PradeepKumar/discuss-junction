Another MEVN stack for the :heartpulse: with Vue.
# Discuss junction
This is an Chat web app that is made with **Vue, Expressjs, Nodejs, MongoDB, Redis**<br>
This app uses **Socket-io and Redis Pub Sub** for scalability with sticky sessions
***


## What's this about ?
- Create your own chamber (room).
- Join any chamber of your choice.
- Start chatting with anyone.
***



## How to get started ? :v: 
###### Disclaimer * The app is hosted at heroku's free dyno. So time to load is initially high then, once it gets the pace there is lesser lag*
- get to site- [https://discussjunction.herokuapp.com](https://discussjunction.herokuapp.com)
- Signup with your email.
- Go to your mail id, get your account activated.
- Enter your details if you wish.
- Create a chamber or join one and start chatting with other.
- You can delete ur profile permanently, by typing your password twice.
***


## I wish to clone discuss junction.
- In the client folder, the root directory contains the Vue files.
  - change the URl at the location /client/src/plugins/axios.js
  - change the URl at the location client/src/main.js
- You have to set your environment variables in **_.env_** file
###### Disclaimer * You need to setup google api * <br>
###### You can use my link [how to setup googleAPI](https://infantcoder.blogspot.com/2020/05/nodemailer-based-mailer.html) or other good resources from the internet :grimacing:
```
googlemailid= * your google email setup with google api *
googlemailclientid= * Your google client-id *
googlemailclientsecret=* your google client secret *
googlemailrefreshtoken=* your refresh token *

jwt_secret= * Any JSON web token secret *

data_connection_string = * Your mongoDB connection string *

baseurl=http://localhost:5000 * or your backend address *
frontendbaseurl=http://localhost:8080  * your front-end url *

redispass= * Your redis-lab password  (if configured) *
redishost=* Your redis-lab host if(configured) *
redisport= * Your redis-lab port if(configured) *
```
Everything is set, You can use your own copy now.
***


## What is going to come ?
- One to one chat is not yet implemented, will be appearing in future.
- You can join only three chambers (room) as of now (tested), but can increase to as many (not tested yet).
- Images are now stored as base64 to mongoDB which is bad, but can be moved to 'S3' if needed. (those modules are seperate and can be modified easily) 
