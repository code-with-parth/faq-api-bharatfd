### Installation Steps

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/code-with-parth/faq-api-bharatfd.git
   cd faq-api-bharatfd
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a .env file in the root of your project and add the following environment variables:
   ```properties
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/faqdb
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the Application**:
   ```sh
   npm start
   ```

5. **Run with Docker**:
   Ensure Docker is installed and running on your machine. Then, build and run the Docker containers:
   ```sh
   docker-compose up --build
   ```

### API Usage Examples

#### 1. Get All FAQs
- **Endpoint**: `GET /api/faqs`
- **Description**: Fetch all FAQs.
- **Example**:
  ```sh
  curl -X GET http://localhost:3000/api/faqs
  ```

#### 2. Get Translated FAQs
- **Endpoint**: `GET /api/faqs?lang=es`
- **Description**: Fetch all FAQs translated to Spanish.
- **Example**:
  ```sh
  curl -X GET http://localhost:3000/api/faqs?lang=es
  ```

#### 3. Get Single FAQ
- **Endpoint**: `GET /api/faqs/:id`
- **Description**: Fetch a single FAQ by ID.
- **Example**:
  ```sh
  curl -X GET http://localhost:3000/api/faqs/faq_id
  ```

#### 4. Create FAQ
- **Endpoint**: `POST /api/faqs`
- **Description**: Create a new FAQ.
- **Headers**:
  - `x-auth-token`: Your JWT token.
- **Body** (JSON):
  ```json
  {
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine."
  }
  ```
- **Example**:
  ```sh
  curl -X POST http://localhost:3000/api/faqs \
    -H "x-auth-token: your_jwt_token" \
    -H "Content-Type: application/json" \
    -d '{"question": "What is Node.js?", "answer": "Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine."}'
  ```

#### 5. Update FAQ
- **Endpoint**: `PUT /api/faqs/:id`
- **Description**: Update an existing FAQ.
- **Headers**:
  - `x-auth-token`: Your JWT token.
- **Body** (JSON):
  ```json
  {
    "question": "What is Express.js?",
    "answer": "Express.js is a web application framework for Node.js."
  }
  ```
- **Example**:
  ```sh
  curl -X PUT http://localhost:3000/api/faqs/faq_id \
    -H "x-auth-token: your_jwt_token" \
    -H "Content-Type: application/json" \
    -d '{"question": "What is Express.js?", "answer": "Express.js is a web application framework for Node.js."}'
  ```

#### 6. Delete FAQ
- **Endpoint**: `DELETE /api/faqs/:id`
- **Description**: Delete an existing FAQ.
- **Headers**:
  - `x-auth-token`: Your JWT token.
- **Example**:
  ```sh
  curl -X DELETE http://localhost:3000/api/faqs/faq_id \
    -H "x-auth-token: your_jwt_token"
  ```

### Contribution Guidelines

1. **Fork the Repository**:
   - Click the "Fork" button at the top right of the repository page.

2. **Clone Your Fork**:
   ```sh
   git clone https://github.com/yourusername/faq-management-system.git
   cd faq-management-system
   ```

3. **Create a Branch**:
   ```sh
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**:
   - Implement your feature or fix the bug.

5. **Commit Your Changes**:
   ```sh
   git add .
   git commit -m "Add your commit message here"
   ```

6. **Push to Your Fork**:
   ```sh
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**:
   - Go to the original repository on GitHub.
   - Click the "New Pull Request" button.
   - Select your branch and submit the pull request.

8. **Review Process**:
   - Your pull request will be reviewed by the maintainers.
   - Make any requested changes.
   - Once approved, your changes will be merged into the main branch.

Thank you for contributing!
