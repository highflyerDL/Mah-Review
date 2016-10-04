# Mah-Review
### Setting up the project
- Clone the project   
- npm install
- `npm install -g nodemon`
- Create local MongoDB database named "mern"
- To import sample data go to backend/seeders folder and in order categories,users,images,posts,reviews run:
  mongoimport --jsonArray --stopOnError --db mern --collection COLLECTION_NAME < FILENAME.json
- npm start
- Go to localhost:3000
