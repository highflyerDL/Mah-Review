# Mah-Review
### Setting up the project
- Clone the project   
- npm install
- `npm install -g nodemon`
- Create local MongoDB database named "mern"
- npm start
- Go to localhost:3000
- There are 2 ways to import sample data by going to backend/seeders folder:
  +In order categories,users,images,posts,reviews and run:
  mongoimport --jsonArray --stopOnError --db mern --collection COLLECTION_NAME < FILENAME.json
  +Run mongorestore -d mern ./mern .This way you wont be able to modify the sample data in json file for later use because data is stored in bjson format.
- To run unit test:
  +npm install
  +create local MongoDB database named "mern_test"
  +run npm test to see test output to terminal
  +for jenkins run npm run report to output to test-reports.xml in project root directory
