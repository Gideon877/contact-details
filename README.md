# Contact & Client Manager
========================

A modern, responsive web application designed to manage business relationships by tracking **Clients**, **Contacts**, and the **Connection Density** between them. This tool helps users visualize how well-connected their contacts are to various client organizations.

🚀 Features
-----------

*   **Client Management**: Add, view, and track organisations (Clients).
    
*   **Contact Directory**: Manage individual contact details (First Name, Last Name, Email).
    
*   **Connection Density**: A specialised view (powered by useMemo for performance) that calculates and displays the strength of relationships between specific contacts and clients.
    
*   **GraphQL Integration**: Uses Apollo Client for efficient data fetching and real-time updates.
    
*   **Modern UI**: Built with React and optimized for a clean, professional user experience.
    

🛠️ Prerequisites
-----------------

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
    
*   [Yarn](https://yarnpkg.com/) (Classic or Berry)
    

💻 Local Setup & Installation
-----------------------------

Follow these steps to get the project running on your local machine:

### 1\. Clone the Repository

```Bash
git clone https://github.com/Gideon877/contact-details.git
cd contact-details
```

### 2\. Install Dependencies

Using Yarn to fetch all necessary packages:

```Bash   
yarn install  
 ```

### 3\. Environment Configuration

Create a `.env` file in the root directory if you need to point to a specific GraphQL API:

```Bash
REACT_APP_GRAPHQL_API_URL=http://localhost:4000/graphql
```

### 4\. Run the Application

Start the development server:

```Bash
yarn start
```

The app should now be running at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

🧪 Available Scripts
--------------------

*   yarn start: Runs the app in development mode.
    
*   yarn build: Bundles the app into static files for production.
    
*   yarn test: Launches the test runner.
    
*   yarn lint: Runs the linter to check for code quality (configured via jsconfig.json).
    

📁 Project Structure
--------------------

*   /src/components: Reusable UI components (e.g., ConnectionDensity).
    
*   /src/queries: GraphQL query definitions (e.g., GET\_DASHBOARD\_STATS).
    
*   /src/hooks: Custom React hooks for data processing and memoization.