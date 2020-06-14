1. npm install -g express-generator
3. CD in folder and npm install.
4. May Set debug mode using cross-env. npm install --save-dev cross-env --e.g. "cross-env DEBUG=blogserverexpress:* & node ./bin/www"
5. Or for windows change start script to: "set DEBUG=blogserverexpress:* & node ./bin/www"
6. Backend database = mongodb
7. DB - using db - blogapp. Initial format for posts-         {
       "author": "Jane Doe",
        "title": "Blog Post 2",
        "content": "Second post content"
        }