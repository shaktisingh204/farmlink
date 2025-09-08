
# FarmLink: AI-Powered Agricultural Marketplace

FarmLink is a comprehensive, AI-driven web platform designed to modernize the agricultural supply chain. It directly connects farmers with retailers and local markets, creating a more efficient, transparent, and fair ecosystem for all stakeholders. The platform leverages cutting-edge generative AI to provide intelligent insights, from fair price estimation to supply chain optimization.

## Tech Stack

FarmLink is built with a modern, robust, and scalable technology stack:

-   **Frontend:** [Next.js](https://nextjs.org/) (with App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **UI:** [ShadCN/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Generative AI:** [Google's Gemini models](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Realtime Database for data, Authentication for user management)
-   **Deployment:** Firebase App Hosting

## Key Features

The platform's features are tailored to the specific needs of each user role, leveraging AI to provide actionable insights and streamline operations.

### For Farmers:

#### 1. AI Price Advisor
-   **How it Works:** Farmers upload a photo of their produce, specify the commodity, and provide their location. The AI analyzes the image to assess quality (freshness, ripeness, defects) and fetches real-time prices from market data APIs for that commodity. It then recommends a fair market price per kg based on both the quality assessment and the market data.
-   **Tech Used:** Genkit, Gemini Vision model, Firebase Realtime Database, Next.js Server Actions.

#### 2. Agri-Assistant Chatbot
-   **How it Works:** A conversational AI chatbot where farmers can ask any farming-related question. The AI, powered by a Gemini model fine-tuned for agricultural expertise, provides instant, actionable advice on topics like crop diseases, soil health, and pest control.
-   **Tech Used:** Genkit, Gemini, React.

#### 3. Produce Listings Management
-   **How it Works:** Farmers can easily create, view, and manage their produce listings. They can set the name, variety, quantity, price, and description, and upload an image. All listings are stored in Firebase Realtime Database and are instantly available to retailers on the platform.
-   **Tech Used:** Firebase Realtime Database, Next.js Server Actions, React.

#### 4. AI Market Suggestions
-   **How it Works:** Farmers select a commodity they wish to sell. The AI uses a Genkit tool to query a government market data API for the latest prices across different regions. It then analyzes this data to provide a summary of market conditions and suggests the most profitable markets for that specific produce.
-   **Tech Used:** Genkit, Gemini, External Data API, Next.js Server Actions.

#### 5. Orders Received
-   **How it Works:** Farmers can view and manage a real-time list of all incoming orders for their produce placed by retailers on the platform.
-   **Tech Used:** Firebase Realtime Database, React.

#### 6. Payments & Earnings
-   **How it Works:** A dedicated dashboard for farmers to track their total revenue, number of orders, and average order value. It also provides a detailed transaction history for all completed sales.
-   **Tech Used:** Firebase Realtime Database, React.

#### 7. Alerts & Notifications
-   **How it Works:** Farmers receive automated alerts for important events, such as new orders, low stock on their listings, and significant changes in market prices for their commodities.
-   **Tech Used:** Firebase Realtime Database, React.

### For Retailers:

#### 1. Browse and Order Produce
-   **How it Works:** Retailers can view a comprehensive, real-time catalog of all produce listed by every farmer on the platform. They can see details like price, quantity, and farmer information, and place orders directly.
-   **Tech Used:** Firebase Realtime Database, React.

#### 2. AI Recommended Deals
-   **How it Works:** The AI analyzes a retailer's order history and favorited items to understand their preferences. It then compares these preferences with all currently available produce to generate a personalized list of 2-3 recommended deals, complete with a reason for each suggestion.
-   **Tech Used:** Genkit, Gemini, Firebase Realtime Database, Next.js Server Actions.

#### 3. Favorites Management
-   **How it Works:** Retailers can mark any produce item as a favorite. This creates a personalized list for quick access and also provides data for the AI Deal Recommender.
-   **Tech Used:** Firebase Realtime Database, React.

### For Market Managers & Admins:

#### 1. Centralized Analytics Dashboards
-   **How it Works:** Both Market Managers and Admins have access to dashboards that provide a high-level view of platform activity. These dashboards display key metrics like total revenue, user counts (farmers and retailers), active listings, and sales trends visualized with charts.
-   **Tech Used:** Firebase Realtime Database, Recharts, React.

#### 2. User and Transaction Monitoring
-   **How it Works:** Admins and Market Managers can view detailed tables listing all users (farmers, retailers) and all transactions (orders) that have occurred on the platform. This allows for complete oversight and logistical management.
-   **Tech Used:** Firebase Realtime Database, Next.js Server Actions, React.

#### 3. Contact Message Inbox
-   **How it Works:** Admins can view and manage messages submitted through the public "Contact Us" form on the landing page.
-   **Tech Used:** Firebase Realtime Database, Next.js Server Actions, React.

### Public Features:

#### 1. AI-Powered FAQ Chatbot
-   **How it Works:** An interactive chatbot on the main landing page, powered by a Gemini model, is trained on platform-specific information to answer visitor questions about FarmLink's features and mission.
-   **Tech Used:** Genkit, Gemini, React.

## Getting Started

To run this project locally, you will need to have Node.js and npm installed.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**
    Create a `.env` file in the root of the project and add your Firebase project configuration keys.

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

This will start the Next.js application, which you can access at `http://localhost:9002`.
