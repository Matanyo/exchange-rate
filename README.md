# Exchange Rate History Viewer

A React application that displays historical exchange rates between USD and ILS over a two-week period, with caching capabilities.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- An API key from [Open Exchange Rates](https://openexchangerates.org/)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd exchange-rate-viewer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your API key:

```env
VITE_EXCHANGE_API_KEY=your_openexchangerates_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

| Variable              | Description                      | Required |
| --------------------- | -------------------------------- | -------- |
| VITE_EXCHANGE_API_KEY | Your Open Exchange Rates API key | Yes      |

Note: You'll need to sign up at [Open Exchange Rates](https://openexchangerates.org/) to get an API key.
