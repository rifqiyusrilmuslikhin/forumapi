## Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/rifqiyusrilmuslikhin/forumapi.git
   cd forumapi  
   npm install
2. Configure the application:  
* Rename the `.env.example` file to `.env`.  
* Open the `.env` file and update the configuration settings as required.  
3. Run database migrations:
   ```shell
   npm run migrate up
4. Create configuration for database testing migrations:
   - Create folder config/database
   - Create file test.json in config/database
   - Fill the `test.json` file. Here is an example of the content of the `test.json` file:
     ```json
     {
       "host": "localhost",
       "port": 5432,
       "username": "testuser",
       "password": "testpass",
       "database": "testdb"
     }
5. Run database testing migrations:
   ```shell
   npm run migrate:test up
6. Run testing application:
   ```shell
   npm run test:watch  
7. Start the application:
   ```shell
   npm run start:dev | npm run start
