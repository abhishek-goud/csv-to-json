# CSV TO JSON

## Implementation Details


### API Endpoints
- `GET /api/process-csv`: Processes CSV files
- `GET /check-status`: Health check endpoint

### Core Components
- `config/app.config.js`: Application configuration
- `controllers/user.controller.js`: CSV processing logic
- `index.js`: Server setup and route definitions

### Technical Assumptions
- CSV file path is configured externally
- CSV data is parsed in JavaScript Object and then saved to the database.
