# Shippable

READ ME
========================


--------------

The project is for fetching the open issues for any open source github repository.
Its a npm and bower based project.

Installation
--------------
1. Run npm install
2. app.js has the default port set prosscess.env.PORT or 3022.
3. run 'npm start' or 'node app' to start the project.
4. The portal should be served on localhost:3022(port might vary with PORT env variable) by default.


Usage
--------------
1. In the webpage you can enter the url of any open source github project like 'https://github.com/facebook/react' and press submit
2. It will show you the following details in the table below.
a. Total number of open issues.
b. Number of open issues that were opened in the last 24 hours.
c. Number of open issues that were opened more than 24 hours ago but less than 7 days ago.
d. Number of open issues that were opened more than 7 days ago.

The project is currently hosted on
https://fathomless-hollows-93478.herokuapp.com/

Libraries used
---------------

Frontend

1. Bootstrap
2. JQuery

Backend

1. bower
2. express
3. ejs
4. path

Improvements that can be achieved in time

1. As it is a simple project jquery did the trick but we could have used any good framework like react to make the app fast if the app grows.
2. Using gulp/grunt/webpack to minify the js and css on the server side.
3. The ajax operation can be well handled in the backend as well.
4. The loading of the response after the query can be shown in a better way.
5. Better error handling and routing can be done for handling corner cases and history transitions.
6. Promises can also used to handle the call back hell issue.
