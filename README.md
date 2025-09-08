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

The platform is divided into four distinct user portals and a public-facing website, each tailored with specific features.

### 1. Public-Facing Website

The main entry point for users, showcasing the platform's capabilities.

-   **Engaging Landing Page:** A visually rich introduction to FarmLink's features and mission.
-   **User Portals:** Clear navigation to dedicated login and registration pages for each user role.
-   **AI-Powered FAQ Chatbot:** An interactive bot, powered by Gemini, that answers visitor questions about the platform's features.
-   **Feature Showcases:** Detailed sections for public-facing tools like the AI Price Estimator and Distribution Optimizer.

### 2. Farmer Portal

A comprehensive dashboard for farmers to manage their business.

-   **AI Price Advisor:** Upload a photo of produce to get an AI-driven quality assessment and a fair market price recommendation.
-   **Agri-Assistant Chatbot:** A specialized AI expert that answers any farming-related question, from crop diseases to soil management.
-   **Produce Listings Management:** Easily create, view, and manage produce listings for sale.
-   **AI Market Suggestions:** Get AI-analyzed suggestions on the best markets to sell specific produce based on real-time price data.
-   **Order & Earnings Management:** Track incoming orders and review payment history.

### 3. Retailer Portal

Tools for retailers to source the best local produce.

-   **Browse Produce:** A comprehensive and filterable view of all produce available from every farmer on the platform.
-   **AI Recommended Deals:** The platform uses AI to analyze purchasing history and favorites to generate personalized deal recommendations.
-   **Direct Ordering:** Place orders directly with farmers through the platform.
-   **Favorites:** Save preferred produce items for quick access.

### 4. Market Manager Portal

A high-level dashboard for overseeing market operations.

-   **Market Overview Analytics:** A dashboard with key metrics on platform activity, including total revenue, user participation, and sales trends visualized with charts.
-   **Farmer & Retailer Activity:** Monitor the participation and activity levels of all farmers and retailers.
-   **Logistics Snapshot:** A real-time view of all orders and deliveries across the market.
-   **Revenue Tracking:** A complete log of all transactions and revenue flowing through the platform.

### 5. Admin Portal

The central control panel for platform administrators.

-   **User Management:** View a list of all registered users (farmers, retailers, etc.) and their roles.
-   **Platform-Wide Analytics:** Access high-level analytics and data visualizations for the entire ecosystem.
-   **Transaction Monitoring:** A complete log of all transactions occurring on the platform.

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
