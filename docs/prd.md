# NexCommerce — Product Requirements Document (PRD)

## AI-Powered Multi-Vendor E-Commerce Platform

> **Document Version**: 1.0.0  
> **Last Updated**: September 4, 2026  
> **Document Owner**: Product & Engineering Team  
> **Status**: Approved for Development  
> **Classification**: Internal — Engineering & Product  
> **Companion Document**: [architecture.md](./architecture.md)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users & Personas](#3-target-users--personas)
4. [User Stories & Acceptance Criteria](#4-user-stories--acceptance-criteria)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [System Architecture Overview](#7-system-architecture-overview)
8. [API Specification Summary](#8-api-specification-summary)
9. [AI Features Specification](#9-ai-features-specification)
10. [Database Schema](#10-database-schema)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Testing Strategy](#12-testing-strategy)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Security & Compliance](#14-security--compliance)
15. [Project Plan & Timeline](#15-project-plan--timeline)
16. [Success Metrics & Analytics](#16-success-metrics--analytics)
17. [Appendix](#17-appendix)
18. [Evolution & Scalability Roadmap](#18-evolution--scalability-roadmap)

---

## 1. Executive Summary

**Product Name:** NexCommerce
**Tagline:** The AI-Native Multi-Vendor E-Commerce Operating System.
**Elevator Pitch:** NexCommerce is a next-generation multi-vendor e-commerce platform built from the ground up with artificial intelligence. Unlike legacy systems that bolt on AI as an afterthought, NexCommerce integrates predictive algorithms, semantic search, and generative AI into the core workflows of customers, vendors, and platform administrators, enabling hyper-personalized shopping experiences, automated store operations, and intelligent logistics.

### Problem Statement
Current e-commerce platforms suffer from several key pain points:
1. **Fragmented AI Integration:** AI features (like chatbots or recommendations) are often implemented via disparate third-party plugins that don't share context, leading to disjointed user experiences.
2. **Poor Vendor Tools:** Small business owners spend excessive time manually writing product descriptions, adjusting pricing, and analyzing trends instead of focusing on fulfillment and growth.
3. **No Semantic Search:** Traditional keyword-based search fails to understand natural language queries (e.g., "warm winter jacket for skiing"), leading to high search abandonment and lost sales.
4. **Manual Pricing & Operations:** Vendors lack real-time competitive insights and dynamic pricing capabilities, leaving money on the table or losing price-sensitive customers.

### Proposed Solution
NexCommerce serves as an AI-native multi-vendor marketplace where:
- **Customers** enjoy semantic search, natural language interactions via an intelligent RAG chatbot, and highly personalized recommendations.
- **Vendors** leverage generative AI to instantly create SEO-optimized product listings and dynamic pricing engines to maximize margins.
- **Platform Admins** benefit from automated AI review moderation and multi-signal fraud detection to maintain platform integrity at scale.

### Launch Strategy & Metrics
- **Target Launch Date:** Q3 2026
- **MVP Scope:** Core multi-vendor capabilities, semantic search, AI product descriptions, Stripe Connect payouts, and basic RAG chatbot.
- **Success Metrics:**
  - **GMV:** $1M in first 6 months.
  - **DAU:** 10,000 active daily users by Month 3.
  - **Vendor Onboarding Rate:** 500 active vendors within 6 months.
  - **Search Conversion Rate:** >12% (industry average is ~8%).

### Key Stakeholders
- **Product:** Defines roadmap, prioritizes AI features, monitors user engagement.
- **Engineering:** Builds the modular monolith Node.js architecture and integrates OpenAI/Pinecone APIs.
- **Design:** Crafts intuitive interfaces for 4 distinct user roles.
- **Business/Ops:** Manages vendor acquisition, logistics partnerships, and financial operations.

---

## 2. Product Vision & Goals

### Vision Statement
To democratize advanced AI commerce capabilities, empowering every vendor to operate like a retail giant while providing customers with an effortlessly intuitive shopping experience.

### Mission Statement
To build the most intelligent, scalable, and user-centric multi-vendor marketplace platform that seamlessly connects buyers and sellers through data-driven automation.

### Strategic Goals & OKRs
- **6-Month:** Successfully launch MVP, onboard initial 500 vendors, and achieve baseline stability with 99.9% uptime.
- **12-Month:** Extract core domains into microservices, roll out advanced dynamic pricing and AI BI querying, reach 5,000 vendors.
- **24-Month:** Expand internationally, introduce predictive inventory placement, and achieve $50M annualized GMV.

### Product Principles
1. **AI-First, Not AI-Added:** AI is integrated into the core schema and business logic, not just the UI layer.
2. **Vendor Empowerment:** If a task can be automated for a vendor, it should be.
3. **Data-Driven Execution:** Every interaction is an opportunity to improve recommendations and platform intelligence.
4. **Modular Architecture:** Build for today's scale (monolith) but design for tomorrow's (microservices).

### Success Criteria & KPIs

| KPI | Target (6mo) | Target (12mo) | Measurement Method |
| :--- | :--- | :--- | :--- |
| **Search Conversion Rate** | 10% | 15% | Analytics Module (Orders / Search Sessions) |
| **Vendor Churn Rate** | < 5% | < 3% | Admin Dashboard (Vendor active status over 30 days) |
| **Avg. Order Value (AOV)** | $45 | $65 | Order Module (Total GMV / Total Orders) |
| **Chatbot Resolution Rate** | 40% | 65% | AI Module (Tickets resolved without human agent) |
| **System Uptime** | 99.9% | 99.99% | Prometheus/Grafana monitoring metrics |

---

## 3. Target Users & Personas

### Persona 1: Customer (Priya, 28, Urban Professional)
- **Demographics:** 28 years old, lives in a metropolitan area, earns $85k/year.
- **Goals:** Find high-quality, unique products quickly; get accurate delivery estimates.
- **Frustrations:** Irrelevant search results, clunky checkout processes, unresponsive customer service.
- **Tech Savviness:** High. Uses mobile predominantly.
- **Key Jobs-to-be-Done (JTBD):** Discover products matching specific vague criteria; track orders in real-time; get quick answers to product questions.
- **Feature Priorities:** Semantic search, AI recommendations, fast checkout, RAG chatbot.
- **Usage Scenarios:** Browsing on her commute, asking the chatbot if a specific dress is suitable for a summer wedding.

### Persona 2: Vendor (Raj, 35, Small Business Owner)
- **Demographics:** 35 years old, runs a boutique electronics store.
- **Goals:** Increase sales volume, manage inventory easily, maximize profit margins.
- **Frustrations:** Time spent writing listings, guessing competitive prices, delayed payouts.
- **Tech Savviness:** Medium. Prefers desktop dashboards.
- **Key Jobs-to-be-Done (JTBD):** List products quickly; monitor sales performance; manage fulfillment.
- **Feature Priorities:** AI product descriptions, dynamic pricing, clear payout analytics.

### Persona 3: Delivery Partner (Arun, 24, Gig Worker)
- **Demographics:** 24 years old, university student working part-time.
- **Goals:** Maximize earnings per hour, navigate routes efficiently.
- **Frustrations:** Confusing app interfaces, inaccurate delivery addresses, poor battery optimization.
- **Tech Savviness:** Medium-High. Uses a budget Android smartphone.
- **Key Jobs-to-be-Done (JTBD):** Accept delivery jobs; navigate to destination; capture proof of delivery.

### Persona 4: Admin (Meera, 32, Platform Operations Manager)
- **Demographics:** 32 years old, background in marketplace operations.
- **Goals:** Ensure platform integrity, assist struggling vendors, monitor system health.
- **Frustrations:** Reviewing thousands of products/reviews manually, complex SQL queries for reporting.
- **Tech Savviness:** High. Comfortable with complex admin panels.
- **Key Jobs-to-be-Done (JTBD):** Approve/reject vendor applications; moderate toxic content; pull platform reports.

### User Needs Matrix

| Need | Customer | Vendor | Delivery | Admin |
| :--- | :--- | :--- | :--- | :--- |
| **Intuitive Mobile Experience** | High | Medium | High | Low |
| **Real-time Notifications** | High | High | High | Medium |
| **Advanced Analytics/Insights** | Low | High | Low | High |
| **Automated Data Entry (AI)** | Low | High | Low | Medium |
| **Robust Financial Tracking** | Low | High | Medium | High |

---

## 4. User Stories & Acceptance Criteria

### Auth Module
**US-001: Register Account**
- As a customer, I want to register for a new account using my email and password, so that I can make purchases.
- **Acceptance Criteria:**
  - GIVEN an unregistered email WHEN the user submits valid details THEN an account is created and a verification email is sent.
  - GIVEN an existing email WHEN the user submits THEN an error message is displayed.
- **Priority:** P0 | **Module:** Auth | **Complexity:** S

**US-002: Login**
- As a user, I want to log in with my credentials, so that I can access my account.
- **Acceptance Criteria:**
  - GIVEN valid credentials WHEN submitted THEN a JWT access and refresh token are returned.
  - GIVEN invalid credentials WHEN submitted THEN a generic "invalid credentials" error is shown.
- **Priority:** P0 | **Module:** Auth | **Complexity:** S

**US-003: OAuth Login**
- As a user, I want to log in using Google/Facebook, so that I don't have to remember another password.
- **Acceptance Criteria:**
  - GIVEN a valid OAuth token WHEN passed to the backend THEN an account is created/linked and JWT is issued.
- **Priority:** P1 | **Module:** Auth | **Complexity:** M

**US-004: Forgot Password**
- As a user, I want to reset my password, so that I can regain access if I forget it.
- **Acceptance Criteria:**
  - GIVEN a valid email WHEN requested THEN a secure reset link is emailed.
  - GIVEN a valid reset token and new password WHEN submitted THEN the password is updated securely.
- **Priority:** P0 | **Module:** Auth | **Complexity:** S

**US-005: Refresh Token**
- As a client app, I want to silently refresh the access token, so that the user stays logged in securely.
- **Acceptance Criteria:**
  - GIVEN a valid refresh token WHEN sent to the refresh endpoint THEN a new access token is returned.
  - GIVEN an expired/revoked refresh token WHEN sent THEN a 401 response triggers a forced logout.
- **Priority:** P0 | **Module:** Auth | **Complexity:** M

**US-006: Role-Based Access Control (RBAC)**
- As a backend system, I want to restrict route access based on user roles, so that users cannot access unauthorized data.
- **Acceptance Criteria:**
  - GIVEN a user with 'Customer' role WHEN accessing an 'Admin' route THEN a 403 Forbidden is returned.
- **Priority:** P0 | **Module:** Auth | **Complexity:** M

### User Module
**US-007: View Profile**
- As a user, I want to view my profile details, so that I can see my current information.
- **Acceptance Criteria:**
  - GIVEN an authenticated user WHEN they request their profile THEN their details (name, email, phone) are returned.
- **Priority:** P1 | **Module:** User | **Complexity:** S

**US-008: Update Profile**
- As a user, I want to update my profile information, so that it remains accurate.
- **Acceptance Criteria:**
  - GIVEN valid updated details WHEN submitted THEN the database is updated and the new profile is returned.
- **Priority:** P1 | **Module:** User | **Complexity:** S

**US-009: Manage Addresses**
- As a customer, I want to add, edit, and delete shipping addresses, so that I can manage where my orders go.
- **Acceptance Criteria:**
  - GIVEN valid address data WHEN submitted THEN it is saved and marked as default if requested.
  - GIVEN a delete request WHEN submitted THEN the address is logically deleted.
- **Priority:** P0 | **Module:** User | **Complexity:** M

**US-010: User Preferences**
- As a user, I want to set my communication preferences, so that I control how I receive notifications.
- **Acceptance Criteria:**
  - GIVEN updated preferences (email/SMS/push toggles) WHEN submitted THEN they are saved to the user record.
- **Priority:** P2 | **Module:** User | **Complexity:** S

**US-011: Upload Avatar**
- As a user, I want to upload a profile picture, so that I can personalize my account.
- **Acceptance Criteria:**
  - GIVEN a valid image file (<2MB, jpg/png) WHEN uploaded THEN it is stored in S3 and the URL is saved to the profile.
- **Priority:** P3 | **Module:** User | **Complexity:** M

### Vendor Module
**US-012: Register Vendor**
- As a user, I want to register as a vendor, so that I can start selling on the platform.
- **Acceptance Criteria:**
  - GIVEN basic business details WHEN submitted THEN a vendor profile is created in a 'pending' state.
- **Priority:** P0 | **Module:** Vendor | **Complexity:** M

**US-013: Upload KYC Documents**
- As a pending vendor, I want to upload KYC documents, so that the admin can verify my business.
- **Acceptance Criteria:**
  - GIVEN valid PDF/Image documents WHEN uploaded THEN they are securely stored and linked to the vendor profile.
- **Priority:** P0 | **Module:** Vendor | **Complexity:** M

**US-014: Store Setup**
- As an approved vendor, I want to configure my store details (logo, banner, policies), so that my shop looks professional.
- **Acceptance Criteria:**
  - GIVEN valid store configurations WHEN saved THEN the public store page reflects these updates immediately.
- **Priority:** P1 | **Module:** Vendor | **Complexity:** M

**US-015: View Commission Rates**
- As a vendor, I want to see the platform commission rates applied to my account, so I can price accordingly.
- **Acceptance Criteria:**
  - GIVEN a vendor session WHEN viewing billing settings THEN the current commission tier is displayed.
- **Priority:** P2 | **Module:** Vendor | **Complexity:** S

**US-016: Payout History**
- As a vendor, I want to view my past payouts and pending balances, so that I can track my revenue.
- **Acceptance Criteria:**
  - GIVEN a vendor session WHEN viewing financial dashboard THEN a paginated list of Stripe Connect transfers is shown.
- **Priority:** P1 | **Module:** Vendor | **Complexity:** L

**US-017: Vendor Dashboard**
- As a vendor, I want to see a summary dashboard of my store's performance, so I can monitor key metrics quickly.
- **Acceptance Criteria:**
  - GIVEN a vendor session WHEN loading the dashboard THEN total sales, active orders, and top products are displayed.
- **Priority:** P1 | **Module:** Vendor | **Complexity:** L

### Product Module
**US-018: Create Product**
- As a vendor, I want to add a new product manually, so that customers can buy it.
- **Acceptance Criteria:**
  - GIVEN valid product details (name, price, SKU) WHEN submitted THEN the product is created in the database.
- **Priority:** P0 | **Module:** Product | **Complexity:** M

**US-019: Product Variants**
- As a vendor, I want to add variants (size, color) to a product, so I don't have to create separate listings.
- **Acceptance Criteria:**
  - GIVEN variant attributes and prices WHEN saved THEN the system generates unique SKUs for each combination.
- **Priority:** P0 | **Module:** Product | **Complexity:** L

**US-020: Manage Product Images**
- As a vendor, I want to upload and reorder product images, so that my product is visually appealing.
- **Acceptance Criteria:**
  - GIVEN multiple image files WHEN uploaded THEN they are resized, saved to S3, and ordered according to input.
- **Priority:** P1 | **Module:** Product | **Complexity:** M

**US-021: Product Categories**
- As a vendor, I want to assign my product to nested categories, so that it can be found easily.
- **Acceptance Criteria:**
  - GIVEN a valid category ID WHEN saving a product THEN the product is linked to that category and its parents.
- **Priority:** P1 | **Module:** Product | **Complexity:** S

**US-022: Manage Inventory**
- As a vendor, I want to update stock levels, so that I don't oversell items.
- **Acceptance Criteria:**
  - GIVEN a stock update request WHEN submitted THEN the product inventory count is updated immediately.
- **Priority:** P0 | **Module:** Product | **Complexity:** S

**US-023: Bulk Import Products**
- As a vendor, I want to upload a CSV of products, so I can onboard my catalog quickly.
- **Acceptance Criteria:**
  - GIVEN a valid CSV format WHEN uploaded THEN a background job parses and creates the products, reporting any errors.
- **Priority:** P2 | **Module:** Product | **Complexity:** XL

**US-024: AI Product Description**
- As a vendor, I want to generate a product description using AI, so that I save time writing copy.
- **Acceptance Criteria:**
  - GIVEN a product title and key features WHEN requested THEN the OpenAI integration returns a formatted, SEO-friendly description.
- **Priority:** P1 | **Module:** Product | **Complexity:** M

**US-025: View Price History**
- As a vendor, I want to see the history of price changes for my product, so I can analyze pricing strategies.
- **Acceptance Criteria:**
  - GIVEN a product ID WHEN viewing history THEN a timeline of price modifications is displayed.
- **Priority:** P3 | **Module:** Product | **Complexity:** S

### Search Module
**US-026: Keyword Search**
- As a customer, I want to search for products using keywords, so that I can find specific items.
- **Acceptance Criteria:**
  - GIVEN a search query WHEN submitted THEN Elasticsearch returns relevant products matched by title/tags.
- **Priority:** P0 | **Module:** Search | **Complexity:** M

**US-027: Semantic Search**
- As a customer, I want to search using natural language (e.g., "red dress for summer"), so that I find conceptually relevant items.
- **Acceptance Criteria:**
  - GIVEN a natural language query WHEN submitted THEN the query is embedded and Pinecone returns vector-matched products.
- **Priority:** P1 | **Module:** Search | **Complexity:** L

**US-028: Search Filters**
- As a customer, I want to filter search results (price, brand, rating), so that I can narrow down my options.
- **Acceptance Criteria:**
  - GIVEN search results WHEN a filter is applied THEN the results are instantly refined based on the criteria.
- **Priority:** P0 | **Module:** Search | **Complexity:** M

**US-029: Autocomplete Suggestions**
- As a customer, I want to see suggestions as I type, so that I can search faster.
- **Acceptance Criteria:**
  - GIVEN 3+ typed characters WHEN pausing THEN Elasticsearch returns top matching queries and product previews.
- **Priority:** P1 | **Module:** Search | **Complexity:** M

**US-030: Search Analytics Tracking**
- As a system, I want to log search queries and click-through rates, so that we can improve the search algorithm.
- **Acceptance Criteria:**
  - GIVEN a user clicks a search result WHEN tracked THEN the event is sent to ClickHouse for analytics.
- **Priority:** P2 | **Module:** Search | **Complexity:** M

### Order Module
**US-031: Add to Cart**
- As a customer, I want to add products to my cart, so that I can purchase them later.
- **Acceptance Criteria:**
  - GIVEN a valid product variant and quantity WHEN added THEN the cart session (Redis) is updated.
- **Priority:** P0 | **Module:** Order | **Complexity:** S

**US-032: Checkout Flow**
- As a customer, I want to proceed through checkout (address, shipping, summary), so that I can finalize my order.
- **Acceptance Criteria:**
  - GIVEN a valid cart WHEN proceeding THEN the system calculates taxes, shipping, and total cost accurately.
- **Priority:** P0 | **Module:** Order | **Complexity:** L

**US-033: Order Tracking**
- As a customer, I want to view the status of my order, so that I know when it will arrive.
- **Acceptance Criteria:**
  - GIVEN a placed order WHEN viewing details THEN the current status (Pending, Shipped, Delivered) is shown.
- **Priority:** P0 | **Module:** Order | **Complexity:** S

**US-034: Cancel Order**
- As a customer, I want to cancel my order before it ships, so that I can change my mind.
- **Acceptance Criteria:**
  - GIVEN an order in 'Pending' state WHEN cancelled THEN the status updates, inventory is released, and refund initiated.
- **Priority:** P1 | **Module:** Order | **Complexity:** M

**US-035: Return Order**
- As a customer, I want to request a return for a delivered order, so that I can get my money back for a faulty item.
- **Acceptance Criteria:**
  - GIVEN a delivered order (<14 days old) WHEN a return is requested THEN a return workflow is initiated for vendor approval.
- **Priority:** P2 | **Module:** Order | **Complexity:** L

**US-036: Order History**
- As a customer, I want to view all my past orders, so that I can track my spending.
- **Acceptance Criteria:**
  - GIVEN an authenticated customer WHEN viewing history THEN a paginated list of all past orders is displayed.
- **Priority:** P1 | **Module:** Order | **Complexity:** S

**US-037: Reorder**
- As a customer, I want to easily reorder a past purchase, so that I save time.
- **Acceptance Criteria:**
  - GIVEN a past order WHEN clicking 'Reorder' THEN available items are added to the current cart.
- **Priority:** P2 | **Module:** Order | **Complexity:** M

### Payment Module
**US-038: Checkout Payment processing**
- As a customer, I want to pay securely using my credit card, so that my order is confirmed.
- **Acceptance Criteria:**
  - GIVEN a valid Stripe payment intent WHEN processed successfully THEN the order state moves to 'Paid'.
- **Priority:** P0 | **Module:** Payment | **Complexity:** L

**US-039: Process Refund**
- As a system, I want to issue refunds via Stripe, so that customers get their money back for returns/cancellations.
- **Acceptance Criteria:**
  - GIVEN a valid refund request WHEN processed THEN Stripe API is called and the order payment status reflects the refund.
- **Priority:** P1 | **Module:** Payment | **Complexity:** M

**US-040: Vendor Payout (Stripe Connect)**
- As a system, I want to route funds to the vendor's connected account automatically, so that vendors get paid.
- **Acceptance Criteria:**
  - GIVEN a completed order WHEN the holding period expires THEN funds (minus commission) are transferred to the vendor.
- **Priority:** P0 | **Module:** Payment | **Complexity:** XL

**US-041: Payment History Dashboard**
- As an Admin, I want to view all platform transactions, so that I can audit financials.
- **Acceptance Criteria:**
  - GIVEN an admin session WHEN viewing transactions THEN a list of all successful and failed payments is displayed.
- **Priority:** P2 | **Module:** Payment | **Complexity:** M

**US-042: Failed Payment Retry**
- As a customer, I want to retry a failed payment without losing my cart, so that I can use a different card.
- **Acceptance Criteria:**
  - GIVEN a declined card WHEN retrying THEN a new payment intent is created without clearing the cart.
- **Priority:** P1 | **Module:** Payment | **Complexity:** M

### Delivery Module
**US-043: Accept Delivery Assignment**
- As a delivery partner, I want to receive and accept delivery jobs, so that I can earn money.
- **Acceptance Criteria:**
  - GIVEN a new nearby order WHEN broadcasted THEN the partner can accept it, locking it to their account.
- **Priority:** P0 | **Module:** Delivery | **Complexity:** L

**US-044: Live GPS Tracking**
- As a customer, I want to see the driver's location on a map, so that I know exactly when they will arrive.
- **Acceptance Criteria:**
  - GIVEN an active delivery WHEN the driver app sends GPS updates THEN the customer UI updates via WebSockets.
- **Priority:** P1 | **Module:** Delivery | **Complexity:** XL

**US-045: Proof of Delivery**
- As a delivery partner, I want to upload a photo and get a signature, so that I have proof of drop-off.
- **Acceptance Criteria:**
  - GIVEN a destination reached WHEN the partner uploads an image THEN it is attached to the order record and marked Delivered.
- **Priority:** P1 | **Module:** Delivery | **Complexity:** M

**US-046: Reassign Delivery**
- As a system, I want to reassign a delivery if a partner drops it or stalls, so that SLAs are met.
- **Acceptance Criteria:**
  - GIVEN a driver hasn't moved in 15 mins WHEN the threshold is hit THEN the job is rebroadcast to other drivers.
- **Priority:** P2 | **Module:** Delivery | **Complexity:** L

**US-047: Delivery History & Earnings**
- As a delivery partner, I want to view my past trips and earnings, so that I can track my income.
- **Acceptance Criteria:**
  - GIVEN a partner session WHEN viewing earnings THEN a daily/weekly breakdown of completed deliveries and payouts is shown.
- **Priority:** P1 | **Module:** Delivery | **Complexity:** M

### Notification Module
**US-048: Order Status Notifications**
- As a customer, I want to receive emails/push notifications when my order status changes, so that I stay informed.
- **Acceptance Criteria:**
  - GIVEN an order changes to 'Shipped' WHEN triggered THEN a BullMQ job sends an email via SendGrid and push via FCM.
- **Priority:** P0 | **Module:** Notification | **Complexity:** M

**US-049: Notification Preferences**
- As a user, I want to toggle SMS vs Email notifications, so that I am not spammed.
- **Acceptance Criteria:**
  - GIVEN user preferences WHEN a notification event occurs THEN the system only routes via allowed channels.
- **Priority:** P1 | **Module:** Notification | **Complexity:** S

**US-050: Marketing Opt-in/out**
- As a customer, I want to subscribe/unsubscribe from marketing emails, so that I control promotional content.
- **Acceptance Criteria:**
  - GIVEN a user unchecks the marketing flag WHEN saving THEN they are removed from the promotional mailing list.
- **Priority:** P2 | **Module:** Notification | **Complexity:** S

**US-051: In-App Notification Center**
- As a user, I want to see a bell icon with unread alerts, so that I can catch up on missed notifications.
- **Acceptance Criteria:**
  - GIVEN unread notifications WHEN the user logs in THEN the bell icon shows a badge count and lists recent alerts.
- **Priority:** P2 | **Module:** Notification | **Complexity:** M

### Review Module
**US-052: Write Product Review**
- As a verified buyer, I want to rate and review a product, so that I can share my experience.
- **Acceptance Criteria:**
  - GIVEN a delivered order WHEN the user submits a 1-5 star rating and text THEN it is saved to the product.
- **Priority:** P0 | **Module:** Review | **Complexity:** M

**US-053: AI Review Moderation**
- As an Admin, I want AI to automatically flag toxic or spam reviews, so that the platform remains professional.
- **Acceptance Criteria:**
  - GIVEN a newly submitted review WHEN analyzed by the AI module THEN if toxicity score > 0.8, it is hidden and flagged for manual review.
- **Priority:** P1 | **Module:** Review | **Complexity:** L

**US-054: Review Helpfulness Voting**
- As a customer, I want to upvote helpful reviews, so that the best reviews bubble to the top.
- **Acceptance Criteria:**
  - GIVEN a review WHEN a user clicks 'Helpful' THEN the helpful count increments.
- **Priority:** P2 | **Module:** Review | **Complexity:** S

**US-055: Vendor Response to Review**
- As a vendor, I want to publicly reply to a review, so that I can address customer concerns.
- **Acceptance Criteria:**
  - GIVEN a review on their product WHEN the vendor submits a reply THEN it is displayed nested under the original review.
- **Priority:** P1 | **Module:** Review | **Complexity:** M

### Analytics Module
**US-056: Vendor Sales Dashboard**
- As a vendor, I want to see charts of my revenue over time, so that I can analyze trends.
- **Acceptance Criteria:**
  - GIVEN a date range WHEN queried THEN time-series data of GMV and order counts is visualized.
- **Priority:** P1 | **Module:** Analytics | **Complexity:** L

**US-057: Admin Platform Dashboard**
- As an Admin, I want to see aggregate platform metrics (Total GMV, active users), so that I can gauge business health.
- **Acceptance Criteria:**
  - GIVEN an admin session WHEN viewing the dashboard THEN real-time metrics aggregated from ClickHouse are displayed.
- **Priority:** P1 | **Module:** Analytics | **Complexity:** L

**US-058: Export Reports**
- As a vendor/admin, I want to export data to CSV/Excel, so that I can do external accounting.
- **Acceptance Criteria:**
  - GIVEN a report view WHEN clicking export THEN a downloadable CSV file is generated and returned.
- **Priority:** P2 | **Module:** Analytics | **Complexity:** M

**US-059: AI Insights Query**
- As an Admin, I want to ask questions in plain English (e.g., "What is the top selling category this month?"), so that I don't have to write SQL.
- **Acceptance Criteria:**
  - GIVEN a natural language query WHEN submitted THEN the AI translates it to SQL, runs it against ClickHouse, and returns the result.
- **Priority:** P2 | **Module:** Analytics | **Complexity:** XL

### AI Module
**US-060: RAG Chatbot Conversation**
- As a customer, I want to chat with an AI assistant about products, so that I can get specific questions answered based on the catalog.
- **Acceptance Criteria:**
  - GIVEN a user query WHEN submitted THEN the RAG system retrieves context from Pinecone and streams a GPT-4 response.
- **Priority:** P0 | **Module:** AI | **Complexity:** XL

**US-061: Dynamic Pricing Recommendations**
- As a vendor, I want AI to suggest optimal pricing based on demand and competitors, so that I maximize profit.
- **Acceptance Criteria:**
  - GIVEN a product WHEN the pricing engine runs THEN it suggests a price range based on market signals.
- **Priority:** P1 | **Module:** AI | **Complexity:** XL

**US-062: Generate AI Descriptions**
- As a vendor, I want to click a button to auto-generate a description, so that listing is effortless.
- **Acceptance Criteria:**
  - (Covered in Product Module US-024, but explicitly handled by AI service).
- **Priority:** P1 | **Module:** AI | **Complexity:** M

**US-063: AI Fraud Detection Alert**
- As an Admin, I want the system to flag suspicious orders automatically, so that chargebacks are minimized.
- **Acceptance Criteria:**
  - GIVEN a new order WHEN multi-signal scoring evaluates it as high risk THEN the order is paused and an admin alert is generated.
- **Priority:** P1 | **Module:** AI | **Complexity:** L

**US-064: Personalized Recommendations**
- As a customer, I want to see products recommended for me, so that I discover items I like.
- **Acceptance Criteria:**
  - GIVEN a user profile and history WHEN viewing the homepage THEN a customized list of products is retrieved based on collaborative filtering embeddings.
- **Priority:** P1 | **Module:** AI | **Complexity:** L

**US-065: Natural Language Analytics (Admin)**
- As an admin, I want to query platform metrics using chat.
- **Acceptance Criteria:**
  - (Covered in Analytics US-059).
- **Priority:** P2 | **Module:** AI | **Complexity:** XL

### Admin Module
**US-066: Approve/Reject Vendor**
- As an Admin, I want to review vendor applications, so that I can ensure quality on the platform.
- **Acceptance Criteria:**
  - GIVEN a pending vendor WHEN approved THEN their status changes to active and they are notified.
- **Priority:** P0 | **Module:** Admin | **Complexity:** S

**US-067: Ban User/Vendor**
- As an Admin, I want to ban bad actors, so that the platform remains safe.
- **Acceptance Criteria:**
  - GIVEN a user/vendor ID WHEN banned THEN their active sessions are revoked and they can no longer log in.
- **Priority:** P1 | **Module:** Admin | **Complexity:** M

**US-068: Manage Feature Flags**
- As an Admin, I want to toggle features on/off globally, so that we can safely roll out new capabilities.
- **Acceptance Criteria:**
  - GIVEN a feature flag dashboard WHEN toggling a feature THEN the system updates cache and clients adapt instantly.
- **Priority:** P2 | **Module:** Admin | **Complexity:** M

**US-069: System Configuration**
- As an Admin, I want to update platform fees and commission structures, so that business logic can be adjusted without code deployment.
- **Acceptance Criteria:**
  - GIVEN a config update WHEN saved THEN the new commission rates apply to all subsequent orders.
- **Priority:** P1 | **Module:** Admin | **Complexity:** M

**US-070: Audit Logs**
- As an Admin, I want to view a log of all administrative actions, so that there is accountability.
- **Acceptance Criteria:**
  - GIVEN an admin takes an action WHEN viewing logs THEN the action, timestamp, and admin ID are recorded immutably.
- **Priority:** P2 | **Module:** Admin | **Complexity:** M

---

## 5. Functional Requirements

### 1. Auth Module
- **FR-001 (JWT Authentication):** The system MUST issue short-lived JWTs (15 min) and long-lived HTTP-only Refresh tokens (7 days).
  - **Input:** Credentials / **Processing:** Hash validation (Argon2) / **Output:** Token pair.
- **FR-002 (OAuth 2.0 Integration):** The system MUST support Google and Facebook OAuth flows.
  - **Constraints:** Must link to existing accounts based on verified email.
- **FR-003 (RBAC Enforcement):** The system MUST intercept all API requests to validate the `role` claim in the JWT.
  - **Edge Cases:** Token valid but role changed in DB -> Requires cache invalidation strategy.
- **FR-004 (Password Policy):** Passwords MUST be at least 12 characters, containing upper, lower, number, and special character.
- **FR-005 (Rate Limiting):** The login and password reset endpoints MUST be rate-limited to 5 attempts per 15 minutes per IP.

### 2. User Module
- **FR-006 (Profile CRUD):** The system MUST allow users to read and update their demographic data.
- **FR-007 (Address Geocoding):** When an address is saved, the system MUST asynchronously geocode it to lat/lng via Google Maps API.
  - **Output:** Stored GeoJSON point.
- **FR-008 (Default Address Logic):** A user MUST have exactly one default shipping address if any addresses exist.
- **FR-009 (Data Portability):** Users MUST be able to request an export of all their PII data (GDPR requirement).
- **FR-010 (Account Deletion):** The system MUST soft-delete user accounts and anonymize their historical order data.

### 3. Vendor Module
- **FR-011 (State Machine):** Vendor accounts MUST strictly follow the state machine: Pending -> In Review -> Active | Rejected -> Suspended.
- **FR-012 (KYC Storage):** KYC documents MUST be stored in private S3 buckets with presigned URLs expiring in 15 minutes.
- **FR-013 (Store Slug Generation):** The system MUST auto-generate a unique URL slug based on the store name.
- **FR-014 (Commission Calculation Engine):** The system MUST calculate commissions dynamically based on the vendor's assigned tier during checkout.
- **FR-015 (Stripe Connect Onboarding):** Vendors MUST complete Stripe Express onboarding before their store can be set to 'Active'.

### 4. Product Module
- **FR-016 (Product Schema):** Products MUST support unlimited key-value attributes (JSONB) for variants (e.g., {"color": "red", "size": "M"}).
- **FR-017 (SKU Uniqueness):** Every product variant MUST have a globally unique SKU.
- **FR-018 (Inventory Locking):** Inventory MUST be locked temporarily when added to a cart (15 min TTL) and permanently decremented upon payment intent success.
- **FR-019 (Image Processing):** Uploaded images MUST be converted to WebP format and resized to thumbnail, medium, and large dimensions.
- **FR-020 (Category Hierarchy):** Categories MUST be implemented as an Adjacency List or Materialized Path in PostgreSQL to support infinite depth.

### 5. Search Module
- **FR-021 (Data Syncing):** Any CRUD operation on a Product MUST emit a Kafka/BullMQ event to sync the document to Elasticsearch and Pinecone.
- **FR-022 (Semantic Embedding Pipeline):** The system MUST use OpenAI `text-embedding-3-small` to generate vectors for product title + description.
- **FR-023 (Hybrid Search):** The search endpoint MUST combine keyword scores (BM25) and semantic scores (Cosine Similarity) with configurable weights.
- **FR-024 (Faceted Search):** The search API MUST return dynamic aggregations (facets) for price ranges, brands, and categories based on the current result set.
- **FR-025 (Pagination):** Search results MUST be paginated using cursor-based pagination for performance.

### 6. Order Module
- **FR-026 (Cart Session Storage):** Shopping carts MUST be stored in Redis for fast access, merging local (anonymous) carts with user carts upon login.
- **FR-027 (Order Saga Orchestration):** Order creation MUST use the Saga pattern across Inventory, Payment, and Delivery modules to ensure distributed consistency.
- **FR-028 (Idempotency Keys):** Order creation endpoints MUST require an idempotency key to prevent duplicate orders on network retries.
- **FR-029 (Tax Calculation):** The system MUST calculate localized taxes based on the destination shipping address.
- **FR-030 (Order State Machine):** Orders MUST strictly follow: Pending -> Paid -> Processing -> Shipped -> Delivered -> (Optional) Returned.

### 7. Payment Module
- **FR-031 (Stripe Webhooks):** The system MUST process Stripe webhooks to asynchronously update order payment status.
  - **Edge Case:** Webhook arrives before synchronous API response -> Requires strict upsert/locking logic.
- **FR-032 (Split Payments):** The system MUST utilize Stripe Connect destination charges to split the payment between the platform (commission) and the vendor.
- **FR-033 (Refund Handling):** Partial and full refunds MUST automatically calculate and adjust the platform commission proportionally.
- **FR-034 (Currency Support):** All financial values MUST be stored as integers (cents) in the database to prevent floating-point errors.
- **FR-035 (Fraud Verification):** Transactions flagged by Stripe Radar or the internal AI Fraud Module MUST put the order in 'Manual Review' state.

### 8. Delivery Module
- **FR-036 (Geospatial Queries):** The system MUST use PostGIS to find available delivery partners within a 5km radius of the pickup location.
- **FR-037 (WebSocket Tracking):** Location updates from driver apps MUST be broadcasted via Socket.io to the specific customer connected to that order room.
- **FR-038 (Assignment Timeout):** If an assigned driver does not accept within 60 seconds, the system MUST route the request to the next nearest driver.
- **FR-039 (Proof of Delivery Upload):** The system MUST require a photo upload or digital signature payload before transitioning an order to 'Delivered'.
- **FR-040 (Route Optimization):** The system SHOULD integrate with Google Maps Directions API to provide the driver with the most efficient route.

### 9. Notification Module
- **FR-041 (Fan-out Architecture):** Notification triggers MUST publish to a central topic, which fans out to Email, SMS, and Push worker queues based on user preferences.
- **FR-042 (Template Management):** Email and SMS payloads MUST use Handlebars templates compiled dynamically with order/user context.
- **FR-043 (Retry Logic):** Failed notification dispatches MUST be retried with exponential backoff up to 3 times.
- **FR-044 (FCM Integration):** Push notifications MUST utilize Firebase Cloud Messaging with valid device tokens stored in the User Module.
- **FR-045 (Unsubscribe Handling):** All promotional emails MUST include a one-click unsubscribe link that updates the user's preference record immediately.

### 10. Review Module
- **FR-046 (Verified Purchase Validation):** The system MUST ensure a user has a completed 'Delivered' order for a product before allowing a review submission.
- **FR-047 (Rating Aggregation):** When a new review is added, the system MUST asynchronously recalculate and cache the product's average rating and review count.
- **FR-048 (AI Toxicity Check):** Text content MUST be synchronously passed to the AI Module for moderation before being persisted.
- **FR-049 (Review Pagination):** Reviews MUST be fetchable via cursor pagination, sortable by 'Most Recent' or 'Most Helpful'.
- **FR-050 (Vendor Reply Linking):** Vendor replies MUST be stored with a `parent_review_id` linking them to the original customer review.

### 11. Analytics Module
- **FR-051 (Event Ingestion):** The system MUST stream business events (Page View, Add to Cart, Purchase) to ClickHouse via Kafka.
- **FR-052 (Materialized Views):** ClickHouse MUST maintain materialized views for daily aggregations (Daily GMV, Daily Active Users) for fast dashboard querying.
- **FR-053 (Vendor Data Isolation):** The analytics API MUST enforce tenant isolation so vendors can ONLY query data related to their own `vendor_id`.
- **FR-054 (Report Generation):** CSV exports MUST be generated via background jobs and delivered to the user via a temporary download link to prevent API timeouts.
- **FR-055 (Dashboard Caching):** Heavy aggregate queries for the Admin dashboard MUST be cached in Redis with a 5-minute TTL.

### 12. AI Module
- **FR-056 (RAG Pipeline Context):** The RAG Chatbot MUST inject the customer's cart context and past order history into the system prompt to enable personalized answers.
- **FR-057 (Rate Limiting LLMs):** Calls to the OpenAI API MUST be heavily rate-limited per user to prevent cost overruns and abuse.
- **FR-058 (Dynamic Pricing Engine):** The pricing cron job MUST evaluate competitor prices and inventory levels nightly to suggest a new price point.
- **FR-059 (Fallback Strategies):** If the OpenAI API is down, the system MUST fallback gracefully (e.g., standard search instead of semantic search, disabled chatbot).
- **FR-060 (Fraud Scoring Algorithm):** The fraud detector MUST calculate a risk score (0-100) based on factors like IP location mismatch, new account velocity, and order value standard deviation.

### 13. Admin Module
- **FR-061 (Superadmin Overrides):** Admin users with 'Superadmin' roles MUST have the ability to override any system state (e.g., force refund, unban user).
- **FR-062 (Config Map Refresh):** System configurations (like platform fee %) MUST be stored in DB but cached in application memory, updating via pub/sub on changes.
- **FR-063 (Audit Log Immutability):** The `audit_logs` table MUST be append-only. UPDATE and DELETE permissions MUST be revoked at the database user level.
- **FR-064 (Impersonation):** The system MUST allow admins to securely "impersonate" a user or vendor for debugging purposes without requiring their password.
- **FR-065 (Health Check API):** The module MUST expose an unauthenticated `/healthz` endpoint returning the status of DB, Redis, and external APIs for Kubernetes readiness probes.


---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements
| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| API Response Time (p95) | < 200ms | DataDog/Prometheus |
| Search Query Time (p95) | < 50ms | Elasticsearch metrics |
| AI Inference Time | < 2s (streaming starts < 500ms) | Custom metrics |
| Page Load Time | < 2s (LCP) | Lighthouse |
| WebSocket Latency | < 100ms | Socket.io metrics |
| Database Query Time | < 50ms (p95) | Prisma query metrics |
| Throughput | 10,000 RPS at peak | Load testing |

### 6.2 Scalability Requirements
- **Horizontal scaling targets**: Auto-scale stateless Express.js pods based on CPU utilization > 70% or queue depth > 1000.
- **Database connection pooling**: PgBouncer deployed in front of PostgreSQL to manage up to 5,000 concurrent client connections, scaling read replicas dynamically based on read-heavy traffic.
- **Queue throughput targets**: BullMQ processing > 5,000 jobs/sec across all queues (emails, image processing, webhook delivery).
- **CDN caching targets**: 85%+ cache hit ratio for static assets, product images, and public product endpoints (Cloudflare/CloudFront).
- **When to scale triggers**: Sustained load > 5 minutes, pre-scheduled scaling events for flash sales (e.g., Black Friday).

### 6.3 Availability & Reliability
- **Uptime SLA**: 99.99% for critical paths (checkout, search, auth). 99.9% for non-critical paths (analytics, vendor dashboard, reviews).
- **RTO (Recovery Time Objective)**: < 5 minutes for automated failover to standby DBs.
- **RPO (Recovery Point Objective)**: < 1 minute via streaming WAL replication.
- **Disaster recovery strategy**: Multi-AZ deployment within primary region. Nightly cross-region DB snapshots. IaC (Terraform) allows spin-up in secondary region within 1 hour.
- **Health check endpoints**: Liveness (`/health/live`) and readiness (`/health/ready`) probes checking DB, Redis, and ES connectivity.
- **Circuit breaker patterns**: Implemented for 3rd party calls (Stripe, OpenAI, Twilio) using resilience4j-like pattern in Node.js to fail fast when services degrade.

### 6.4 Security Requirements
- **Authentication & Authorization**: Stateless JWT (HMAC-SHA256) with short lifetimes (15m) + secure, HTTP-only refresh tokens. OAuth 2.0 via Google/Facebook. Strict Role-Based Access Control (RBAC).
- **Data encryption**: At rest using AES-256 (AWS KMS). In transit via TLS 1.3 only.
- **PCI DSS compliance**: Fully mediated via Stripe Elements/Connect. No raw PAN/CVV data touches NexCommerce servers.
- **KYC document encryption**: Vendor identity docs stored in AWS S3 with Server-Side Encryption (SSE-KMS) and strict IAM bucket policies.
- **Input validation & sanitization**: Zod schemas for strict request body/query parsing. XSS mitigation via output encoding.
- **Rate limiting**: Tiered by role (e.g., Unauthenticated: 100 req/15min, Customer: 1000 req/15min, Vendor: 5000 req/15min) via Redis token bucket algorithm.
- **OWASP Top 10 mitigations**: Helmet.js for HTTP headers, parameterized queries via Prisma (prevent SQLi), CSRF protection for state-changing endpoints.
- **Security audit schedule**: Automated weekly dependency scanning (Snyk), quarterly internal reviews.
- **Penetration testing cadence**: Bi-annual external penetration testing by certified third-party vendor.

### 6.5 Compliance Requirements
- **GDPR**: Full support for right to erasure (hard delete PII, anonymize order history), data export (JSON dump endpoint), and cookie/tracking consent management.
- **PCI DSS**: SAQ-A compliant through Stripe Checkout/Connect integration.
- **Data retention policies**: 
  - Server logs: 30 days
  - Audit logs: 7 years
  - PII: Deleted upon user request or 3 years inactive
  - Financial records (metadata): 7 years for tax compliance

### 6.6 Accessibility Requirements
- **WCAG 2.1 AA compliance**: Minimum baseline for all customer-facing UIs.
- **Screen reader support**: ARIA labels, roles, and semantic HTML for VoiceOver/NVDA.
- **Keyboard navigation**: Fully traversable via Tab, Enter, Space, Esc with visible focus rings.
- **Color contrast ratios**: Minimum 4.5:1 for normal text, 3:1 for large text and UI components.

---

## 7. System Architecture Overview (for PRD)

**High-level architecture summary**: 
NexCommerce employs a Modular Monolith architecture built on Node.js/Express.js, designed for eventual extraction into microservices as organizational boundaries form. Communication between modules uses in-process event emitters and Redis pub/sub for decoupled, asynchronous flows. 

### ASCII System Diagram
```text
[ Web App ]  [ Mobile App ]  [ Vendor Portal ]  [ Admin Panel ]
     |             |                |                 |
     +-------------+-------+--------+-----------------+
                           | (HTTPS / WSS)
                    +-------------+
                    | AWS ALB /   | (CDN, WAF, Rate Limiting)
                    | Cloudflare  |
                    +------+------+
                           |
                    +------v------+
                    |  Nginx API  | (Reverse Proxy / Routing)
                    |   Gateway   |
                    +------+------+
                           |
+--------------------------v---------------------------+
|               Node.js Express App (Monolith)         |
|                                                      |
| [Auth]  [User]  [Vendor] [Product] [Search] [Order]  |
| [Pay]   [Deliv] [Notif]  [Review]  [Analyt] [AI]     |
| [Admin]                                              |
|                                                      |
|   +----------------------------------------------+   |
|   |         Event Bus (EventEmitter / Redis)     |   |
|   +----------------------------------------------+   |
+----+-------------+--------------+--------------+-----+
     |             |              |              |
+----v----+  +-----v---+  +-------v------+ +-----v-----+
|  Prisma |  | Redis   |  | Elasticsearch| | Pinecone  |
|  (Post- |  | (Cache, |  | (Full-text & | | (Vectors) |
|  greSQL)|  | Session)|  | Faceted)     | |           |
+---------+  +---------+  +--------------+ +-----------+
```

### Module Dependency Diagram
```text
[Admin] ---> [All Modules] (Config/Overrides)
[API Gateway] ---> [Auth] (Token validation)
[Order] ---> [Product] (Inventory check)
[Order] ---> [Payment] (Process transaction)
[Order] ---> [Delivery] (Dispatch)
[Payment] ---> [Notification] (Receipts)
[Product] ---> [Search] (Index sync)
[Review] ---> [AI] (Moderation)
[Search] ---> [AI] (Semantic queries)
```

### Data Flow Diagram (Checkout Request Lifecycle)
```text
1. Client POST /api/v1/orders/checkout (JWT Token)
2. Auth Middleware validates JWT -> Injects User ID
3. Order Module: 
   a. Fetches Cart from Redis
   b. Calls Product Module to lock inventory (Transaction start)
   c. Calculates totals (Taxes, Shipping, Discounts)
4. Payment Module creates Stripe PaymentIntent -> Returns Client Secret
5. Client confirms payment with Stripe -> Stripe sends Webhook
6. Payment Webhook handler verifies signature -> Publishes 'PaymentSuccess' event
7. Order Module consumes event -> Updates order status to 'PAID' -> Commits DB Tx
8. Delivery Module consumes event -> Seeks driver via Socket.io
9. Notification Module consumes event -> Sends order confirmation email via SendGrid
```

### Integration Points
- **Payment Processing & Payouts**: Stripe Connect
- **Transactional Email**: SendGrid
- **SMS / OTP**: Twilio
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **AI Models & Embeddings**: OpenAI API (GPT-4o, text-embedding-3-small)
- **Object Storage**: AWS S3
- **Observability**: DataDog / Sentry

### Technology Stack Summary Table
| Layer | Technology | Purpose |
|-------|------------|---------|
| Application Server | Node.js (TypeScript) + Express.js | Core API, modular monolith runtime |
| Primary Database | PostgreSQL (Prisma ORM) | Relational data (users, orders, products) |
| Caching/Queue/PubSub | Redis + BullMQ | Ephemeral storage, job queues, event bus |
| Search Engine | Elasticsearch | Fast textual, faceted, and geo-spatial search |
| Vector Database | Pinecone | Storing/querying AI embeddings for semantic search |
| Analytics DB | ClickHouse | High-volume read-heavy analytics/metrics |
| Real-time Comm. | Socket.io | Delivery tracking, chat, live notifications |

---

## 8. API Specification Summary

### 8.1 API Design Principles
- **RESTful standard**: Resources map to URIs, verbs dictate action, versions in path `/api/v1/`.
- **JWT Bearer auth**: Tokens required for protected routes in `Authorization: Bearer <token>` header.
- **Cursor-based pagination**: Standardized `?cursor=XYZ&limit=20` for infinite scrolling stability.
- **Idempotency keys**: `Idempotency-Key` header required for mutations (checkout, payment) to prevent duplicate processing.
- **Rate limiting**: Response headers include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- **Envelope formatting**: All responses wrapped in `{ success: boolean, data?: any, error?: ErrorObject, meta?: PaginationMeta }`.

### 8.2 Complete API Endpoint Reference

| Method | Endpoint | Auth | Role | Rate Limit | Description | Request Body | Response |
|--------|----------|------|------|------------|-------------|--------------|----------|
| **Auth** | | | | | | | |
| POST | `/api/v1/auth/register` | None | Any | 10/hr | Register new user account | `{ email, password, firstName, lastName }` | `{ user, accessToken, refreshToken }` |
| POST | `/api/v1/auth/login` | None | Any | 20/hr | Authenticate and receive JWT | `{ email, password }` | `{ user, accessToken }` |
| POST | `/api/v1/auth/logout` | JWT | Any | 100/hr | Invalidate current refresh token | `{}` | `{ success: true }` |
| POST | `/api/v1/auth/refresh` | RT | Any | 100/hr | Rotate refresh token, get new JWT | `{ refreshToken }` | `{ accessToken }` |
| GET | `/api/v1/auth/oauth/google` | None | Any | 20/hr | Redirect to Google OAuth | N/A | Redirect |
| POST | `/api/v1/auth/forgot-password` | None | Any | 5/hr | Send reset link to email | `{ email }` | `{ success: true }` |
| POST | `/api/v1/auth/reset-password` | None | Any | 5/hr | Reset with valid token | `{ token, newPassword }` | `{ success: true }` |
| POST | `/api/v1/auth/verify-email` | None | Any | 10/hr | Verify email address | `{ token }` | `{ success: true }` |
| POST | `/api/v1/auth/verify-phone` | JWT | User | 5/hr | Verify phone via OTP | `{ otp }` | `{ success: true }` |
| **User** | | | | | | | |
| GET | `/api/v1/users/me` | JWT | Any | 1k/hr | Get current user profile | N/A | `{ user }` |
| PATCH| `/api/v1/users/me` | JWT | Any | 100/hr | Update profile details | `{ firstName, lastName, phone }` | `{ user }` |
| GET | `/api/v1/users/me/addresses` | JWT | User | 1k/hr | List user addresses | N/A | `[{ address }]` |
| POST | `/api/v1/users/me/addresses` | JWT | User | 50/hr | Add delivery address | `{ street, city, state, zip }` | `{ address }` |
| PUT | `/api/v1/users/me/addresses/:id`| JWT | User | 50/hr | Update delivery address | `{ street, city, state, zip }` | `{ address }` |
| DELETE| `/api/v1/users/me/addresses/:id`| JWT | User | 50/hr | Remove address | N/A | `{ success: true }` |
| GET | `/api/v1/users/me/wishlist` | JWT | User | 1k/hr | Get user wishlist | N/A | `[{ product }]` |
| POST | `/api/v1/users/me/wishlist` | JWT | User | 500/hr | Add item to wishlist | `{ productId }` | `{ success: true }` |
| DELETE| `/api/v1/users/me/wishlist/:id`| JWT | User | 500/hr | Remove from wishlist | N/A | `{ success: true }` |
| POST | `/api/v1/users/me/avatar` | JWT | Any | 20/hr | Upload user avatar (multipart) | `FormData` | `{ url }` |
| **Vendor**| | | | | | | |
| POST | `/api/v1/vendors/register` | JWT | User | 5/hr | Apply for vendor status | `{ storeName, category }` | `{ vendorProfile }` |
| POST | `/api/v1/vendors/kyc` | JWT | Vendor | 10/hr | Submit KYC docs (multipart) | `FormData` | `{ status: PENDING }` |
| GET | `/api/v1/vendors/me/store` | JWT | Vendor | 1k/hr | Get store settings | N/A | `{ store }` |
| PATCH| `/api/v1/vendors/me/store` | JWT | Vendor | 100/hr | Update store details | `{ description, banner }` | `{ store }` |
| GET | `/api/v1/vendors/me/dashboard`| JWT | Vendor | 500/hr | Dashboard high-level stats | N/A | `{ metrics }` |
| GET | `/api/v1/vendors/me/payouts` | JWT | Vendor | 500/hr | Payout history/status | N/A | `[{ payout }]` |
| GET | `/api/v1/vendors/tiers` | None | Any | 1k/hr | List commission tiers | N/A | `[{ tier }]` |
| **Product**| | | | | | | |
| GET | `/api/v1/products` | None | Any | 5k/hr | List products (filterable) | N/A | `[{ product }]` |
| GET | `/api/v1/products/:id` | None | Any | 5k/hr | Get product details | N/A | `{ product }` |
| POST | `/api/v1/products` | JWT | Vendor| 500/hr | Create new product | `{ name, categoryId, basePrice, description }` | `{ product }` |
| PUT | `/api/v1/products/:id` | JWT | Vendor| 500/hr | Update product | `{ name, basePrice, description }` | `{ product }` |
| DELETE| `/api/v1/products/:id` | JWT | Vendor| 100/hr | Archive product | N/A | `{ success: true }` |
| POST | `/api/v1/products/:id/variants`| JWT | Vendor| 500/hr | Add product variant | `{ sku, color, stock }` | `{ variant }` |
| DELETE| `/api/v1/products/variants/:id`| JWT | Vendor| 100/hr | Remove variant | N/A | `{ success: true }` |
| POST | `/api/v1/products/:id/images` | JWT | Vendor| 200/hr | Upload product images | `FormData` | `[{ url }]` |
| GET | `/api/v1/categories` | None | Any | 5k/hr | List category tree | N/A | `[{ category }]` |
| POST | `/api/v1/categories` | JWT | Admin | 100/hr | Create category | `{ name, parentId }` | `{ category }` |
| PATCH| `/api/v1/products/:id/inventory`| JWT | Vendor| 1k/hr | Update inventory counts | `{ variantId, stock }` | `{ success: true }` |
| POST | `/api/v1/products/bulk-import` | JWT | Vendor| 10/hr | Upload CSV for bulk create | `FormData(CSV)` | `{ imported: 100 }` |
| GET | `/api/v1/products/:id/prices` | None | Any | 1k/hr | Historical price tracking | N/A | `[{ date, price }]` |
| **Search** | | | | | | | |
| POST | `/api/v1/search/products` | None | Any | 5k/hr | Advanced boolean search | `{ query, filters: { brand, priceMax } }` | `[{ product }]` |
| POST | `/api/v1/search/semantic` | None | Any | 2k/hr | Vector similarity search | `{ query }` | `[{ product }]` |
| GET | `/api/v1/search/autocomplete` | None | Any | 10k/hr | Typeahead suggestions | N/A | `[{ text, type }]` |
| GET | `/api/v1/search/suggestions` | None | Any | 5k/hr | 'Did you mean' & related | N/A | `[{ suggestion }]` |
| POST | `/api/v1/search/analytics` | None | Any | 5k/hr | Log search interaction | `{ query, clickedId }` | `{ success: true }` |
| **Order** | | | | | | | |
| GET | `/api/v1/cart` | JWT | User | 5k/hr | Get current cart | N/A | `{ cart }` |
| POST | `/api/v1/cart/items` | JWT | User | 2k/hr | Add to cart | `{ productId, variantId, qty }` | `{ cart }` |
| PATCH| `/api/v1/cart/items/:id` | JWT | User | 2k/hr | Update cart quantity | `{ qty }` | `{ cart }` |
| DELETE| `/api/v1/cart/items/:id` | JWT | User | 2k/hr | Remove from cart | N/A | `{ cart }` |
| POST | `/api/v1/orders/checkout` | JWT | User | 100/hr | Convert cart to order | `{ addressId, shippingMethod }` | `{ orderId, totalAmount, status }` |
| GET | `/api/v1/orders` | JWT | User | 1k/hr | List user orders | N/A | `[{ order }]` |
| GET | `/api/v1/orders/:id` | JWT | User/V| 2k/hr | Get order details | N/A | `{ order }` |
| POST | `/api/v1/orders/:id/cancel` | JWT | User/V| 100/hr | Cancel unfulfilled order | `{ reason }` | `{ success: true }` |
| POST | `/api/v1/orders/:id/return` | JWT | User | 50/hr | Request RMA | `{ reason, items }` | `{ rmaId }` |
| POST | `/api/v1/orders/:id/reorder` | JWT | User | 100/hr | Copy old order to cart | N/A | `{ cart }` |
| GET | `/api/v1/orders/:id/track` | JWT | User | 5k/hr | Real-time status / driver | N/A | `{ status, driverId, location }` |
| **Payment**| | | | | | | |
| POST | `/api/v1/payments/intent` | JWT | User | 100/hr | Create Stripe intent | `{ orderId }` | `{ clientSecret, publishableKey }` |
| POST | `/api/v1/payments/confirm` | JWT | User | 100/hr | Confirm payment on BE | `{ paymentIntentId }` | `{ success: true }` |
| POST | `/api/v1/payments/:id/refund` | JWT | Vendor| 50/hr | Issue partial/full refund | `{ amount, reason }` | `{ refundId }` |
| GET | `/api/v1/payments/history` | JWT | User/V| 500/hr | Get transaction ledger | N/A | `[{ transaction }]` |
| POST | `/api/v1/payments/webhook` | None | Stripe| - | Async webhook handler | `StripeEvent` | `{ received: true }` |
| **Delivery**| | | | | | | |
| GET | `/api/v1/deliveries/active` | JWT | Driver| 1k/hr | Polling for assignments | N/A | `[{ job }]` |
| POST | `/api/v1/deliveries/:id/accept`| JWT | Driver| 500/hr | Claim delivery job | N/A | `{ success: true }` |
| PATCH| `/api/v1/deliveries/:id/location`| JWT | Driver| 10k/hr | WSS fallback for GPS log | `{ lat, lng }` | `{ success: true }` |
| POST | `/api/v1/deliveries/:id/complete`|JWT| Driver| 500/hr | Mark delivered (with photo) | `FormData` | `{ success: true }` |
| GET | `/api/v1/deliveries/history` | JWT | Driver| 500/hr | Past completed jobs | N/A | `[{ job }]` |
| **Notify** | | | | | | | |
| GET | `/api/v1/notifications` | JWT | Any | 2k/hr | List in-app notifications | N/A | `[{ notification }]` |
| PATCH| `/api/v1/notifications/:id/read`| JWT | Any | 5k/hr | Mark as read | N/A | `{ success: true }` |
| GET | `/api/v1/notifications/prefs` | JWT | Any | 500/hr | Get notification settings | N/A | `{ email: true, sms: false }` |
| PATCH| `/api/v1/notifications/prefs` | JWT | Any | 100/hr | Update channels (SMS/Email)| `{ email, sms, push }` | `{ success: true }` |
| POST | `/api/v1/notifications/push` | JWT | Any | 100/hr | Register FCM token | `{ fcmToken }` | `{ success: true }` |
| **Review** | | | | | | | |
| POST | `/api/v1/reviews` | JWT | User | 100/hr | Create product review | `{ productId, rating, comment }` | `{ reviewId }` |
| GET | `/api/v1/products/:id/reviews` | None | Any | 5k/hr | List reviews for product | N/A | `[{ review }]` |
| POST | `/api/v1/reviews/:id/vote` | JWT | User | 1k/hr | Upvote/downvote helpful | `{ type: UP }` | `{ success: true }` |
| POST | `/api/v1/reviews/:id/reply` | JWT | Vendor| 100/hr | Vendor response | `{ comment }` | `{ success: true }` |
| POST | `/api/v1/reviews/:id/report` | JWT | Any | 50/hr | Report abuse/spam | `{ reason }` | `{ success: true }` |
| GET | `/api/v1/reviews/moderation` | JWT | Admin | 500/hr | Queue of flagged reviews | N/A | `[{ review }]` |
| PATCH| `/api/v1/reviews/:id/moderate` | JWT | Admin | 500/hr | Approve/reject review | `{ status: APPROVED }` | `{ success: true }` |
| **Analyt** | | | | | | | |
| GET | `/api/v1/analytics/vendor` | JWT | Vendor| 500/hr | Time-series sales data | N/A | `{ timeSeriesData }` |
| GET | `/api/v1/analytics/admin` | JWT | Admin | 500/hr | Platform-wide GMV | N/A | `{ gmv }` |
| POST | `/api/v1/analytics/export` | JWT | V/Adm | 20/hr | Trigger async CSV export | `{ type: SALES }` | `{ jobId }` |
| POST | `/api/v1/analytics/ai-query` | JWT | V/Adm | 100/hr | NL -> SQL -> Chart query | `{ query }` | `{ data, type: CHART }` |
| **AI** | | | | | | | |
| POST | `/api/v1/ai/chat/message` | JWT | Any | 200/hr | Send query to chatbot | `{ message, sessionId }` | `{ reply, suggestedProducts }` |
| GET | `/api/v1/ai/chat/conversations`| JWT | Any | 500/hr | Chat history | N/A | `[{ conversation }]` |
| POST | `/api/v1/ai/pricing/check` | JWT | Vendor| 500/hr | Suggest optimal price | `{ productId }` | `{ suggestedPrice, rationale }` |
| POST | `/api/v1/ai/generate-desc` | JWT | Vendor| 200/hr | Auto-gen SEO description | `{ productId, features }` | `{ description }` |
| GET | `/api/v1/ai/recommendations` | JWT | User | 2k/hr | Personalized home feed | N/A | `[{ product }]` |
| **Admin** | | | | | | | |
| GET | `/api/v1/admin/users` | JWT | Admin | 500/hr | Paginated user list | N/A | `[{ user }]` |
| POST | `/api/v1/admin/users/:id/ban` | JWT | Admin | 100/hr | Suspend user account | `{ reason }` | `{ success: true }` |
| GET | `/api/v1/admin/vendors` | JWT | Admin | 500/hr | List vendors | N/A | `[{ vendor }]` |
| POST | `/api/v1/admin/vendors/:id/kyc`| JWT | Admin | 100/hr | Approve/Reject vendor | `{ status }` | `{ success: true }` |
| GET | `/api/v1/admin/features` | JWT | Admin | 1k/hr | List feature flags | N/A | `[{ feature }]` |
| PATCH| `/api/v1/admin/features/:key` | JWT | Admin | 100/hr | Toggle feature flag | `{ enabled: true }` | `{ success: true }` |
| GET | `/api/v1/admin/config` | JWT | Admin | 1k/hr | System-wide config | N/A | `{ config }` |
| PATCH| `/api/v1/admin/config` | JWT | Admin | 50/hr | Update config | `{ key, value }` | `{ success: true }` |
| GET | `/api/v1/admin/audit-logs` | JWT | Admin | 500/hr | View action ledger | N/A | `[{ log }]` |


### 8.3 Request/Response Examples

**1. POST /api/v1/auth/register**
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
// Response
{
  "success": true,
  "data": {
    "user": { "id": "u_123", "email": "user@example.com", "role": "CUSTOMER" },
    "accessToken": "eyJhbG...",
    "refreshToken": "def502..."
  }
}
```

**2. POST /api/v1/auth/login**
```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
// Response
{
  "success": true,
  "data": {
    "user": { "id": "u_123", "role": "CUSTOMER" },
    "accessToken": "eyJhbG..."
  }
}
```

**3. GET /api/v1/products?cursor=X**
```json
// Request: GET /api/v1/products?categoryId=c_55&limit=2
// Response
{
  "success": true,
  "data": [
    { "id": "p_1", "name": "Wireless Mouse", "price": 29.99 },
    { "id": "p_2", "name": "Mech Keyboard", "price": 99.50 }
  ],
  "meta": {
    "nextCursor": "eyJwXzIifQ==",
    "hasMore": true
  }
}
```

**4. POST /api/v1/orders/checkout**
```json
// Request
{
  "addressId": "addr_99",
  "shippingMethod": "EXPRESS"
}
// Response
{
  "success": true,
  "data": {
    "orderId": "ord_88",
    "totalAmount": 145.50,
    "status": "PENDING_PAYMENT"
  }
}
```

**5. POST /api/v1/payments/create-intent**
```json
// Request
{
  "orderId": "ord_88"
}
// Response
{
  "success": true,
  "data": {
    "clientSecret": "pi_123_secret_456",
    "publishableKey": "pk_test_..."
  }
}
```

**6. POST /api/v1/search/products**
```json
// Request
{
  "query": "noise cancelling headphones",
  "filters": { "brand": ["Sony", "Bose"], "priceMax": 300 }
}
// Response
{
  "success": true,
  "data": [
    { "id": "p_99", "name": "Sony WH-1000XM4", "price": 298.00 }
  ]
}
```

**7. POST /api/v1/ai/chat**
```json
// Request
{
  "message": "Do you have any waterproof running shoes under $100?",
  "sessionId": "sess_11"
}
// Response
{
  "success": true,
  "data": {
    "reply": "Yes, we have several options! The **AquaSprint X** is $89.99 and fully waterproof.",
    "suggestedProducts": ["p_44", "p_45"]
  }
}
```

**8. GET /api/v1/vendor/dashboard**
```json
// Request: GET
// Response
{
  "success": true,
  "data": {
    "metrics": {
      "totalRevenue": 15400.00,
      "ordersPending": 12,
      "activeProducts": 45
    },
    "recentOrders": [...]
  }
}
```

**9. POST /api/v1/products**
```json
// Request
{
  "name": "Coffee Maker",
  "categoryId": "c_22",
  "basePrice": 49.99,
  "description": "Brew the perfect cup.",
  "variants": [
    { "sku": "CM-BLK", "color": "Black", "stock": 50 }
  ]
}
// Response
{
  "success": true,
  "data": { "id": "p_55", "status": "DRAFT" }
}
```

**10. GET /api/v1/orders/:id**
```json
// Request: GET /api/v1/orders/ord_88
// Response
{
  "success": true,
  "data": {
    "id": "ord_88",
    "status": "PROCESSING",
    "items": [{ "productId": "p_1", "qty": 1, "price": 29.99 }],
    "trackingInfo": { "driverId": "d_77", "eta": "2024-05-10T14:00:00Z" }
  }
}
```

### 8.4 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body.",
    "details": [
      { "field": "password", "issue": "Must be at least 8 characters" }
    ],
    "requestId": "req_a1b2c3",
    "timestamp": "2024-05-01T12:00:00Z"
  }
}
```
**Error Codes**:
1. `BAD_REQUEST`: General malformed request syntax.
2. `VALIDATION_ERROR`: Schema validation failed (Zod).
3. `UNAUTHORIZED`: Missing or invalid JWT.
4. `TOKEN_EXPIRED`: JWT lifetime exceeded.
5. `FORBIDDEN`: Valid token, insufficient RBAC permissions.
6. `NOT_FOUND`: Resource ID does not exist.
7. `METHOD_NOT_ALLOWED`: HTTP verb not supported here.
8. `CONFLICT`: State conflict (e.g., email already exists).
9. `PAYLOAD_TOO_LARGE`: Request body/image exceeds limit.
10. `UNSUPPORTED_MEDIA_TYPE`: Invalid upload format.
11. `RATE_LIMIT_EXCEEDED`: Too many requests in time window.
12. `INTERNAL_SERVER_ERROR`: Unhandled exception.
13. `SERVICE_UNAVAILABLE`: Component (e.g., DB) down.
14. `GATEWAY_TIMEOUT`: Upstream service took too long.
15. `INSUFFICIENT_FUNDS`: Payment declined.
16. `CARD_DECLINED`: Stripe declined the card.
17. `INVENTORY_SHORTAGE`: Trying to checkout more than stock.
18. `CART_EMPTY`: Cannot checkout empty cart.
19. `ORDER_NOT_CANCELLABLE`: Order already dispatched.
20. `VENDOR_NOT_APPROVED`: KYC pending.
21. `IDEMPOTENCY_KEY_MISSING`: Required header absent.
22. `DUPLICATE_REQUEST`: Idempotency key already processed.
23. `AI_SERVICE_UNAVAILABLE`: OpenAI API failure.
24. `CONTENT_MODERATION_FLAG`: Text flagged as toxic.
25. `ACCOUNT_SUSPENDED`: Admin disabled user.
26. `DELIVERY_ALREADY_CLAIMED`: Another driver took the job.
27. `REFUND_EXCEEDS_TOTAL`: Invalid refund amount.
28. `GEO_SEARCH_FAILED`: Invalid coordinates provided.
29. `WEBHOOK_SIGNATURE_INVALID`: Bad Stripe/Twilio sig.
30. `FEATURE_DISABLED`: Endpoint behind inactive feature flag.

### 8.5 Webhook Events
| Event | Payload | When Triggered | Retry Policy |
|-------|---------|----------------|--------------|
| `order.created` | Order ID, Total | Post-checkout | 5x exp backoff |
| `payment.succeeded` | Order ID, Txn ID | Stripe confirms funds | 5x exp backoff |
| `payment.failed` | Order ID, Reason | Stripe declines | 3x exp backoff |
| `delivery.started` | Order ID, Driver ID | Driver accepts job | 3x exp backoff |
| `delivery.completed`| Order ID, Timestamp | Driver marks delivered | 5x exp backoff |
| `vendor.approved` | Vendor ID | Admin approves KYC | 3x exp backoff |

---

## 9. AI Features Specification

### 1. RAG Chatbot
- **Description**: Conversational agent allowing customers to ask product questions. Uses Pinecone to retrieve relevant product manual snippets or specs, feeding them to GPT-4o.
- **User Behavior**: Floats bottom-right. Suggests products in-chat.
- **Input**: User natural language text, user context (cart, recent views).
- **Output**: Markdown-formatted text + JSON array of product IDs to render rich UI cards.
- **Model**: `gpt-4o` (low latency, high reasoning). Embedding: `text-embedding-3-small`.
- **Prompt**: 
  ```text
  You are an expert sales assistant for NexCommerce. 
  Answer the user's question using ONLY the provided context. 
  If you recommend products, output their IDs in a strictly formatted JSON array at the end of your response inside a block <PRODUCTS>[id1, id2]</PRODUCTS>.
  Context: {{RAG_CONTEXT}}
  User: {{USER_INPUT}}
  ```
- **Fallback**: "I'm having trouble connecting to my brain right now. Try searching using the top bar!"
- **Performance**: <2s response (streaming).
- **Cost**: ~$0.005 / conversation.
- **Metrics**: Chat-to-cart conversion rate, user thumbs up/down.

### 2. Dynamic Pricing Engine
- **Description**: Suggests optimized prices for vendors based on competitor data, inventory aging, and demand elasticity.
- **User Behavior**: On vendor product page, a "Suggest Price" button appears.
- **Input**: Product attributes, competitor average price, days in inventory, current sales velocity.
- **Output**: JSON containing suggested price and a 1-sentence rationale.
- **Model**: Custom heuristic combined with `gpt-4o-mini` for rationale generation.
- **Prompt**:
  ```text
  Product: {{PRODUCT_NAME}} (Cost: ${{COST}}). 
  Competitor avg: ${{COMP_AVG}}. Inventory age: {{AGE}} days. Sales velocity: {{VELOCITY}} units/week.
  Determine the optimal price to maximize profit while clearing stock. 
  Output JSON: { "suggestedPrice": number, "rationale": "string" }
  ```
- **Fallback**: Rule-based: Cost + 20% margin.
- **Performance**: < 3s latency.

### 3. AI Product Description Generator
- **Description**: Generates SEO-optimized product titles and descriptions from raw specs.
- **User Behavior**: Vendor types specs into a bulleted list, clicks "Auto-Generate".
- **Input**: Raw text/bullets, target audience tone (e.g., Professional, Playful).
- **Output**: Rich HTML or Markdown product description.
- **Model**: `gpt-4o-mini`.
- **Prompt**:
  ```text
  Write an engaging, SEO-optimized product description for: {{PRODUCT_NAME}}.
  Features: {{FEATURES_LIST}}.
  Tone: {{TONE}}.
  Include a catchy headline and bullet points for key benefits.
  ```
- **Fallback**: Standard simple bullet list display.
- **Performance**: < 3s latency.

### 4. AI Review Moderation
- **Description**: Automatically screens user reviews for toxic language, spam, or irrelevance before publishing.
- **User Behavior**: Invisible to user. Reviews post instantly if clean, go to "Pending" if flagged.
- **Input**: Review text, star rating.
- **Output**: Boolean (approved), Float (toxicity score), String (reason).
- **Model**: OpenAI Moderation API + `gpt-4o-mini` for sentiment vs rating mismatch.
- **Prompt**:
  ```text
  Analyze this review: "{{REVIEW_TEXT}}". 
  Given the rating is {{RATING}} stars, does the text match the sentiment? Is there any promotional spam or inappropriate content?
  Output JSON: { "approved": boolean, "flagReason": "string or null" }
  ```
- **Fallback**: All reviews published, async batch job flags them later.
- **Performance**: < 1s latency.

### 5. Fraud Detection System
- **Description**: Scores transaction risk based on user history, IP location, and cart contents.
- **User Behavior**: Invisible to user, may trigger CAPTCHA or 3D Secure if high risk.
- **Input**: User account age, IP geolocation, cart value, velocity of purchases.
- **Output**: Risk score (0-100).
- **Model**: Hybrid: Stripe Radar (primary) + lightweight ML model (xgboost) for platform-specific signals.
- **Fallback**: Default to Stripe Radar only.
- **Performance**: < 100ms latency.

### 6. Semantic Search
- **Description**: Allows searching by concepts ("clothes for a rainy wedding") rather than exact keyword matches.
- **User Behavior**: Typing natural language in the main search bar returns semantic matches.
- **Input**: User search query.
- **Output**: Ordered list of product IDs.
- **Model**: `text-embedding-3-small`.
- **Pipeline**: Query -> Embedding -> Pinecone Vector Match -> Elasticsearch Filter (in-stock) -> Results.
- **Fallback**: Standard Elasticsearch BM25 text match.
- **Performance**: < 200ms latency.

### 7. Personalized Recommendations
- **Description**: "You might also like" carousel tailored to user context.
- **User Behavior**: Visible on homepage and product details page.
- **Input**: User ID, current cart context, recent viewing history.
- **Output**: List of recommended product IDs.
- **Model**: Matrix Factorization (ALS) updated nightly, supplemented by real-time vector similarity of current session views via Pinecone.
- **Fallback**: Global top selling products.
- **Performance**: < 150ms latency.

### 8. AI Analytics Insights
- **Description**: Vendor can ask "Why did my sales drop last week?" and get natural language BI.
- **User Behavior**: A small text box in the analytics dashboard for natural language questions.
- **Input**: User NL query.
- **Output**: Data visualization and a brief written insight.
- **Model**: `gpt-4o` (Text-to-SQL).
- **Prompt**:
  ```text
  Schema: {{CLICKHOUSE_SCHEMA}}.
  User asks: "{{USER_QUERY}}".
  Output a valid SQL query to answer this. Return ONLY the SQL.
  ```
- **Fallback**: Standard visual dashboards only.
- **Performance**: < 5s latency.

### AI Feature ASCII Pipeline Diagram (RAG & Semantic Search)
```text
[ User Query ] 
      |
      v
+-------------+      +------------------+
| OpenAI API  | ---> |   Generate Text  |
| (Embedding) |      |    Embedding     |
+-------------+      +------------------+
                            |
                            v
                     +--------------+
                     |   Pinecone   | (Top K Vector Match)
                     | (Vector DB)  |
                     +--------------+
                            |
                            v
                     +--------------+
                     | Elasticsearch| (Filter out-of-stock, 
                     |              |  apply facets)
                     +--------------+
                            |
                            v
                     [ Client UI ]
```


---

## 10. Database Schema

This is a CRITICAL section.

### 10.1 Database Strategy
| Data Type | Database | Why |
|-----------|----------|-----|
| Users, Orders, Products, Payments, Vendors | PostgreSQL | ACID compliance, relational integrity, complex joins |
| Cache, Sessions, Rate Limits, Cart | Redis | Sub-millisecond reads, TTL support, atomic operations |
| Product Search, Catalog | Elasticsearch | Full-text search, faceted filters, autocomplete |
| AI Vectors, Embeddings | Pinecone | Approximate nearest neighbor, similarity search |
| Analytics, Events, Logs | ClickHouse | Column-oriented, fast aggregation, time-series |

### 10.2 PostgreSQL Tables

#### 1. users
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password_hash | VARCHAR(255) | NULLABLE | Null if SSO login |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| phone | VARCHAR(20) | NULLABLE | |
| role | ENUM('customer','vendor','admin','delivery') | NOT NULL | |
| is_verified | BOOLEAN | DEFAULT false | Email verified |
| is_active | BOOLEAN | DEFAULT true | Soft delete |
| avatar_url | TEXT | NULLABLE | S3 URL |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Indexes:**
- `users(email)` — login lookup
- `users(role)` — role filtering
- `users(phone)` — phone verification
- `users(created_at)` — analytics queries

#### 2. user_addresses
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| label | VARCHAR(50) | NOT NULL | e.g. Home, Work |
| address_line_1 | VARCHAR(255) | NOT NULL | |
| address_line_2 | VARCHAR(255) | NULLABLE | |
| city | VARCHAR(100) | NOT NULL | |
| state | VARCHAR(100) | NOT NULL | |
| postal_code | VARCHAR(20) | NOT NULL | |
| country | VARCHAR(100) | NOT NULL | |
| latitude | DECIMAL(10,8) | NULLABLE | |
| longitude | DECIMAL(11,8) | NULLABLE | |
| is_default | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Indexes:**
- `user_addresses(user_id)` — lookup user addresses

#### 3. user_preferences
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), UNIQUE | |
| notification_email | BOOLEAN | DEFAULT true | |
| notification_sms | BOOLEAN | DEFAULT false | |
| notification_push | BOOLEAN | DEFAULT true | |
| preferred_language | VARCHAR(10) | DEFAULT 'en' | |
| preferred_currency | VARCHAR(3) | DEFAULT 'USD' | |
| theme | VARCHAR(10) | DEFAULT 'light' | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 4. sessions
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| token_hash | VARCHAR(255) | NOT NULL | |
| ip_address | VARCHAR(45) | NULLABLE | |
| user_agent | TEXT | NULLABLE | |
| expires_at | TIMESTAMP | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 5. refresh_tokens
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| token_hash | VARCHAR(255) | NOT NULL, UNIQUE | |
| family_id | UUID | NOT NULL | |
| is_revoked | BOOLEAN | DEFAULT false | |
| expires_at | TIMESTAMP | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 6. vendors
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), UNIQUE | |
| store_name | VARCHAR(100) | NOT NULL | |
| store_slug | VARCHAR(100) | UNIQUE, NOT NULL | |
| store_description | TEXT | NULLABLE | |
| logo_url | TEXT | NULLABLE | |
| banner_url | TEXT | NULLABLE | |
| commission_rate | DECIMAL(5,2) | NULLABLE | |
| status | ENUM(...) | DEFAULT 'pending' | pending/approved/rejected/suspended |
| kyc_status | VARCHAR(20) | DEFAULT 'pending' | |
| rating_avg | DECIMAL(3,2) | DEFAULT 0 | |
| total_sales | DECIMAL(15,2) | DEFAULT 0 | |
| stripe_connect_id | VARCHAR(100) | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Indexes:**
- `vendors(store_slug)` — lookup

#### 7. vendor_documents
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| vendor_id | UUID | FK(vendors.id), NOT NULL | |
| document_type | VARCHAR(50) | NOT NULL | id_proof/address_proof etc. |
| document_url | TEXT | NOT NULL | Encrypted S3 |
| verification_status | VARCHAR(20) | DEFAULT 'pending' | |
| verified_by | UUID | FK(users.id), NULLABLE | |
| verified_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 8. vendor_bank_details
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| vendor_id | UUID | FK(vendors.id), UNIQUE | |
| bank_name | VARCHAR(100) | NOT NULL | |
| account_holder | VARCHAR(100) | NOT NULL | |
| account_number_encrypted | TEXT | NOT NULL | |
| routing_number_encrypted | TEXT | NOT NULL | |
| stripe_external_account_id | VARCHAR(100)| NULLABLE | |
| is_verified | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 9. commission_tiers
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| name | VARCHAR(50) | NOT NULL | |
| min_monthly_sales | DECIMAL(15,2) | NOT NULL | |
| max_monthly_sales | DECIMAL(15,2) | NULLABLE | |
| commission_percentage | DECIMAL(5,2) | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 10. categories
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| name | VARCHAR(100) | NOT NULL | |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | |
| parent_id | UUID | FK(categories.id), NULLABLE| |
| description | TEXT | NULLABLE | |
| image_url | TEXT | NULLABLE | |
| sort_order | INTEGER | DEFAULT 0 | |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 11. products
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| vendor_id | UUID | FK(vendors.id), NOT NULL | |
| name | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | |
| description | TEXT | NULLABLE | |
| ai_description | TEXT | NULLABLE | |
| base_price | DECIMAL(10,2) | NOT NULL | |
| current_price | DECIMAL(10,2) | NOT NULL | |
| compare_at_price | DECIMAL(10,2) | NULLABLE | |
| sku | VARCHAR(100) | UNIQUE, NOT NULL | |
| status | ENUM(...) | DEFAULT 'draft' | draft/active/archived |
| is_featured | BOOLEAN | DEFAULT false | |
| weight | DECIMAL(8,2) | NULLABLE | |
| dimensions_json | JSONB | NULLABLE | |
| meta_title | VARCHAR(255) | NULLABLE | |
| meta_description | TEXT | NULLABLE | |
| total_reviews | INTEGER | DEFAULT 0 | |
| rating_avg | DECIMAL(3,2) | DEFAULT 0 | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

**Indexes:**
- `products(vendor_id)` — lookup vendor products
- `products(slug)` — lookup product
- `products(status)` — filter active

#### 12. product_variants
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| product_id | UUID | FK(products.id), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | |
| sku | VARCHAR(100) | UNIQUE, NOT NULL | |
| price | DECIMAL(10,2) | NOT NULL | |
| compare_at_price | DECIMAL(10,2) | NULLABLE | |
| stock_quantity | INTEGER | DEFAULT 0 | |
| low_stock_threshold| INTEGER | DEFAULT 5 | |
| weight | DECIMAL(8,2) | NULLABLE | |
| attributes_json | JSONB | NOT NULL | e.g. {color:'Red',size:'M'} |
| image_url | TEXT | NULLABLE | |
| sort_order | INTEGER | DEFAULT 0 | |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 13. product_images
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| product_id | UUID | FK(products.id), NOT NULL | |
| url | TEXT | NOT NULL | |
| alt_text | VARCHAR(255) | NULLABLE | |
| sort_order | INTEGER | DEFAULT 0 | |
| is_primary | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 14. product_categories
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| product_id | UUID | FK(products.id), NOT NULL | |
| category_id | UUID | FK(categories.id), NOT NULL | |

**Indexes:**
- PK(product_id, category_id)

#### 15. inventory_logs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| product_id | UUID | FK(products.id), NOT NULL | |
| variant_id | UUID | FK(product_variants.id) | |
| change_type | VARCHAR(50) | NOT NULL | restock/sale/return/adjustment |
| quantity_change | INTEGER | NOT NULL | |
| quantity_after | INTEGER | NOT NULL | |
| reason | VARCHAR(255) | NULLABLE | |
| created_by | UUID | FK(users.id), NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 16. wishlists
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| product_id | UUID | FK(products.id), NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

**Indexes:**
- UNIQUE(user_id, product_id)

#### 17. cart_items
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| product_id | UUID | FK(products.id), NOT NULL | |
| variant_id | UUID | FK(product_variants.id)| NULLABLE |
| quantity | INTEGER | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 18. orders
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | unique sequential |
| status | ENUM(...) | DEFAULT 'draft' | draft/pending/confirmed... |
| subtotal | DECIMAL(10,2) | NOT NULL | |
| tax_amount | DECIMAL(10,2) | NOT NULL | |
| shipping_fee | DECIMAL(10,2) | NOT NULL | |
| discount_amount | DECIMAL(10,2) | DEFAULT 0 | |
| total_amount | DECIMAL(10,2) | NOT NULL | |
| shipping_address_json | JSONB | NOT NULL | |
| billing_address_json | JSONB | NOT NULL | |
| notes | TEXT | NULLABLE | |
| idempotency_key | VARCHAR(100) | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 19. order_items
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| product_id | UUID | FK(products.id), NOT NULL | |
| variant_id | UUID | FK(product_variants.id)| NULLABLE |
| vendor_id | UUID | FK(vendors.id), NOT NULL | |
| quantity | INTEGER | NOT NULL | |
| unit_price | DECIMAL(10,2) | NOT NULL | |
| total_price | DECIMAL(10,2) | NOT NULL | |
| status | ENUM(...) | DEFAULT 'pending' | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 20. order_status_history
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| from_status | VARCHAR(50) | NULLABLE | |
| to_status | VARCHAR(50) | NOT NULL | |
| changed_by | UUID | FK(users.id), NULLABLE | |
| reason | TEXT | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 21. payments
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| user_id | UUID | FK(users.id), NOT NULL | |
| stripe_payment_intent_id| VARCHAR(100) | NULLABLE | |
| stripe_charge_id | VARCHAR(100) | NULLABLE | |
| amount | DECIMAL(10,2) | NOT NULL | |
| currency | VARCHAR(3) | DEFAULT 'USD' | |
| status | ENUM(...) | DEFAULT 'pending' | pending/succeeded/failed |
| payment_method_type| VARCHAR(50) | NOT NULL | |
| idempotency_key | VARCHAR(100) | NULLABLE | |
| metadata_json | JSONB | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 22. payment_refunds
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| payment_id | UUID | FK(payments.id), NOT NULL | |
| stripe_refund_id | VARCHAR(100) | NULLABLE | |
| amount | DECIMAL(10,2) | NOT NULL | |
| reason | TEXT | NULLABLE | |
| status | VARCHAR(50) | DEFAULT 'pending' | |
| created_by | UUID | FK(users.id) | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 23. vendor_payouts
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| vendor_id | UUID | FK(vendors.id), NOT NULL | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| gross_amount | DECIMAL(10,2) | NOT NULL | |
| commission_amount| DECIMAL(10,2) | NOT NULL | |
| net_amount | DECIMAL(10,2) | NOT NULL | |
| stripe_transfer_id| VARCHAR(100) | NULLABLE | |
| status | VARCHAR(50) | DEFAULT 'pending' | |
| eligible_at | TIMESTAMP | NOT NULL | |
| paid_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 24. deliveries
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| driver_id | UUID | FK(users.id), NULLABLE | |
| status | VARCHAR(50) | DEFAULT 'pending' | |
| pickup_address_json| JSONB | NOT NULL | |
| delivery_address_json| JSONB | NOT NULL | |
| estimated_delivery_at| TIMESTAMP | NULLABLE | |
| actual_delivery_at | TIMESTAMP | NULLABLE | |
| delivery_proof_url | TEXT | NULLABLE | |
| delivery_notes | TEXT | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 25. delivery_tracking_events
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| delivery_id | UUID | FK(deliveries.id), NOT NULL| |
| latitude | DECIMAL(10,8) | NOT NULL | |
| longitude | DECIMAL(11,8) | NOT NULL | |
| speed | DECIMAL(5,2) | NULLABLE | |
| heading | DECIMAL(5,2) | NULLABLE | |
| event_type | VARCHAR(50) | NOT NULL | |
| description | TEXT | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 26. delivery_drivers
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), UNIQUE | |
| vehicle_type | VARCHAR(50) | NOT NULL | |
| vehicle_number | VARCHAR(50) | NOT NULL | |
| license_number | VARCHAR(100) | NOT NULL | |
| is_available | BOOLEAN | DEFAULT false | |
| current_latitude | DECIMAL(10,8) | NULLABLE | |
| current_longitude| DECIMAL(11,8) | NULLABLE | |
| rating_avg | DECIMAL(3,2) | DEFAULT 0 | |
| total_deliveries | INTEGER | DEFAULT 0 | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 27. reviews
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| product_id | UUID | FK(products.id), NOT NULL | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| rating | INTEGER | CHECK(rating BETWEEN 1 AND 5)| |
| title | VARCHAR(255) | NULLABLE | |
| body | TEXT | NOT NULL | |
| image_urls | JSONB | NULLABLE | |
| is_verified_purchase| BOOLEAN | DEFAULT true | |
| moderation_status| VARCHAR(50) | DEFAULT 'pending' | |
| ai_sentiment_score | DECIMAL(3,2) | NULLABLE | |
| ai_toxicity_score | DECIMAL(3,2) | NULLABLE | |
| helpfulness_up | INTEGER | DEFAULT 0 | |
| helpfulness_down | INTEGER | DEFAULT 0 | |
| vendor_response | TEXT | NULLABLE | |
| vendor_responded_at| TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 28. review_moderation_logs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| review_id | UUID | FK(reviews.id), NOT NULL | |
| action | VARCHAR(50) | NOT NULL | |
| reason | TEXT | NULLABLE | |
| moderator_id | UUID | FK(users.id), NULLABLE | |
| ai_confidence_score| DECIMAL(3,2) | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 29. notifications
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| type | VARCHAR(50) | NOT NULL | |
| title | VARCHAR(255) | NOT NULL | |
| body | TEXT | NOT NULL | |
| data_json | JSONB | NULLABLE | |
| channel | VARCHAR(20) | NOT NULL | email/sms/push |
| is_read | BOOLEAN | DEFAULT false | |
| sent_at | TIMESTAMP | NULLABLE | |
| read_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 30. conversations
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NOT NULL | |
| title | VARCHAR(255) | NULLABLE | |
| status | VARCHAR(20) | DEFAULT 'active' | |
| message_count | INTEGER | DEFAULT 0 | |
| last_message_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 31. conversation_messages
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| conversation_id | UUID | FK(conversations.id) | |
| role | VARCHAR(20) | NOT NULL | user/assistant/system|
| content | TEXT | NOT NULL | |
| tokens_used | INTEGER | NULLABLE | |
| model_used | VARCHAR(50) | NULLABLE | |
| context_sources_json| JSONB | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 32. price_history
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| product_id | UUID | FK(products.id), NOT NULL | |
| old_price | DECIMAL(10,2) | NOT NULL | |
| new_price | DECIMAL(10,2) | NOT NULL | |
| change_reason | VARCHAR(50) | NOT NULL | |
| ai_confidence_score| DECIMAL(3,2) | NULLABLE | |
| changed_by | UUID | FK(users.id), NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 33. pricing_signals
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| product_id | UUID | FK(products.id), NOT NULL | |
| signal_type | VARCHAR(50) | NOT NULL | |
| signal_value | TEXT | NOT NULL | |
| source | VARCHAR(100) | NOT NULL | |
| captured_at | TIMESTAMP | DEFAULT NOW() | |

#### 34. search_analytics
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| user_id | UUID | FK(users.id), NULLABLE | |
| query | VARCHAR(255) | NOT NULL | |
| results_count | INTEGER | NOT NULL | |
| clicked_product_id | UUID | FK(products.id), NULLABLE| |
| search_type | VARCHAR(20) | NOT NULL | keyword/semantic |
| response_time_ms | INTEGER | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 35. feature_flags
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | |
| description | TEXT | NULLABLE | |
| is_enabled | BOOLEAN | DEFAULT false | |
| rollout_percentage | INTEGER | DEFAULT 100 | |
| conditions_json | JSONB | NULLABLE | |
| created_by | UUID | FK(users.id) | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 36. system_configs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| key | VARCHAR(100) | UNIQUE, NOT NULL | |
| value | TEXT | NOT NULL | |
| description | TEXT | NULLABLE | |
| updated_by | UUID | FK(users.id) | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

#### 37. admin_audit_logs
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| admin_id | UUID | FK(users.id), NOT NULL | |
| action | VARCHAR(100) | NOT NULL | |
| entity_type | VARCHAR(50) | NOT NULL | |
| entity_id | UUID | NOT NULL | |
| old_value_json | JSONB | NULLABLE | |
| new_value_json | JSONB | NULLABLE | |
| ip_address | VARCHAR(45) | NULLABLE | |
| user_agent | TEXT | NULLABLE | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 38. idempotency_keys
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| key | VARCHAR(100) | UNIQUE, NOT NULL | |
| user_id | UUID | FK(users.id), NOT NULL | |
| endpoint | VARCHAR(255) | NOT NULL | |
| request_hash | VARCHAR(255) | NOT NULL | |
| response_status | INTEGER | NULLABLE | |
| response_body_json | JSONB | NULLABLE | |
| expires_at | TIMESTAMP | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 39. coupons
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| code | VARCHAR(50) | UNIQUE, NOT NULL | |
| description | TEXT | NULLABLE | |
| discount_type | VARCHAR(20) | NOT NULL | percentage/fixed |
| discount_value | DECIMAL(10,2) | NOT NULL | |
| min_order_amount | DECIMAL(10,2) | NULLABLE | |
| max_uses | INTEGER | NULLABLE | |
| used_count | INTEGER | DEFAULT 0 | |
| valid_from | TIMESTAMP | NOT NULL | |
| valid_until | TIMESTAMP | NOT NULL | |
| is_active | BOOLEAN | DEFAULT true | |
| created_by | UUID | FK(users.id) | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### 40. coupon_uses
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_uuid() | |
| coupon_id | UUID | FK(coupons.id), NOT NULL | |
| user_id | UUID | FK(users.id), NOT NULL | |
| order_id | UUID | FK(orders.id), NOT NULL | |
| discount_applied | DECIMAL(10,2) | NOT NULL | |
| created_at | TIMESTAMP | DEFAULT NOW() | |


### 10.3 Relationships Diagram (ASCII)
```
                                +------------------+
                                |  system_configs  |
                                +------------------+

                                +------------------+
                                |  feature_flags   |
                                +------------------+

  +-------------------+       +-----------------------+      +-------------------+
  | user_preferences  +---<---+                       +--->--+      sessions     |
  +-------------------+       |                       |      +-------------------+
  +-------------------+       |                       |      +-------------------+
  |  refresh_tokens   +---<---+                       +--->--+    conversations  |
  +-------------------+       |                       |      +---------v---------+
  +-------------------+       |                       |                |
  |  user_addresses   +---<---+                       |      +---------v-------------+
  +-------------------+       |         users         |      | conversation_messages |
  +-------------------+       |                       |      +-----------------------+
  | admin_audit_logs  +---<---+                       |
  +-------------------+       |                       |      +-------------------+
  +-------------------+       |                       +--->--+ idempotency_keys  |
  |   notifications   +---<---+                       |      +-------------------+
  +---------+---------+       +-------v----v----+-----+
                              /       |    |     \
                             /        |    |      \
                            v         |    |       v
           +-----------------+        |    |       +------------------+
           | delivery_drivers+        |    |       |      vendors     +-->---+ vendor_documents
           +--------+--------+        |    |       +--------+---------+      +-------------------
                    |                 |    |                |                | vendor_bank_details
                    v                 |    |                |                +-------------------
             +------+-----+           |    |                v                | vendor_payouts
             | deliveries +-------<---+    +--->-------+ products +<---------+
             +------+-----+                            +----+-----+          +-------------------
                    |                                       |                | commission_tiers
                    v                                       v                +-------------------
      +-------------+------------+                   +------+---------+
      | delivery_tracking_events |                   |product_variants|
      +--------------------------+                   +----------------+
                                                            |
                                                            v
      +--------------------------+                   +------+---------+
      |      order_items         +----->-------------+ inventory_logs |
      +------------+-------------+                   +----------------+
                   |                                        ^
                   v                                        |
  +----------------+---------------+                 +------+---------+
  |            orders              |                 |   cart_items   |
  +----+-----+----+----+-----+-----+                 +----------------+
       |     |    |    |     |                              ^
       |     |    |    |     |                              |
       v     v    v    v     v                              |
+------+  +--+--+ | +--+--+ +++-----+                       |
|order_   |pay- | | |pay- | | coupon|                       |
|status_  |ments| | |ment_| | _uses |                       |
|history  +--+--+ | |re-  | +-------+                       |
+------+     |    | |funds|                                 |
             v    v +-----+                                 |
     +-------+----+--------+                                |
     |      reviews        +--->---+ review_moderation_logs |
     +---------------------+       +------------------------+
```

### 10.4 Redis Key Design
| Key Pattern | Value Type | TTL | Purpose |
|-------------|-----------|-----|----------|
| session:{userId} | JWT payload JSON | 7 days | User session |
| cart:{userId} | JSON array of items | 24 hours | Active cart |
| inventory:{productId}:{variantId} | Integer | No TTL (event-driven invalidation) | Real-time stock count |
| rate_limit:{ip}:{endpoint} | Integer counter | 1 min | IP rate limiting |
| rate_limit:user:{userId}:{endpoint} | Integer counter | 1 min | User rate limiting |
| otp:{phone} | 6-digit code | 10 min | Phone verification |
| otp:{email} | 6-digit code | 15 min | Email verification |
| price:{productId} | Float | 1 hour | Cached product price |
| product:{productId} | Full product JSON | 15 min | Product detail cache |
| search:autocomplete:{prefix} | JSON array | 5 min | Autocomplete cache |
| category:tree | JSON tree | 1 hour | Category hierarchy |
| vendor:dashboard:{vendorId} | JSON stats | 5 min | Vendor dashboard |
| fraud:velocity:{userId} | Integer count | 1 hour | Fraud velocity check |
| ws:room:{deliveryId} | Set of socket IDs | No TTL | WebSocket room |
| lock:order:{orderId} | 1 | 30 sec | Distributed lock |
| lock:inventory:{productId} | 1 | 10 sec | Inventory lock |
| blacklist:token:{jti} | 1 | token remaining TTL | Revoked JWT |

### 10.5 Elasticsearch Index Design
**Product Index Mapping:**
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "vendor_id": { "type": "keyword" },
      "name": { 
        "type": "text", 
        "analyzer": "standard", 
        "fields": { "keyword": { "type": "keyword" } } 
      },
      "description": { "type": "text", "analyzer": "english" },
      "sku": { "type": "keyword" },
      "base_price": { "type": "double" },
      "current_price": { "type": "double" },
      "categories": { "type": "keyword" },
      "attributes": { "type": "object", "dynamic": true },
      "rating_avg": { "type": "float" },
      "total_reviews": { "type": "integer" },
      "created_at": { "type": "date" }
    }
  }
}
```

### 10.6 Pinecone Index Design
- **Index Name:** `nexcommerce-products`
- **Dimensions:** `1536` (OpenAI `text-embedding-3-small`)
- **Metric:** `cosine`
- **Pod Type:** `s1`
- **Metadata Fields:** `product_id`, `vendor_id`, `category`, `price_tier`
- **Namespace Strategy:** Separate namespaces for `products`, `reviews`, and `user_interactions`

### 10.7 ClickHouse Tables
- **events:** `session_id`, `user_id`, `event_type` (view/click/add_to_cart), `page_url`, `product_id`, `timestamp`
- **order_analytics:** `order_id`, `user_id`, `vendor_id`, `total_amount`, `discount_amount`, `status`, `created_at`
- **vendor_analytics:** `vendor_id`, `daily_sales`, `daily_orders`, `unique_customers`, `date`

### 10.8 Migration Strategy
- **Workflow:** Prisma Migrate (`npx prisma migrate dev`, `deploy`)
- **Naming Convention:** `YYYYMMDDHHMMSS_descriptive_name`
- **Rollback:** Down migrations mapped where manual SQL is needed; otherwise, restore from PITR backups.
- **Seeding:** TypeScript seed scripts for categories, admin user, test vendors.
- **Zero-Downtime:** Adding columns allowed; dropping columns multi-step (deprecate -> remove reads -> drop).

## 11. UI/UX Requirements
### 11.1 Screen Inventory
**Customer Screens (25+):**
| Screen | Route | Key Components | Connected Endpoints |
|---|---|---|---|
| Home | `/` | Hero, Featured Categories, AI Recs | `GET /api/home` |
| Product Detail | `/product/:slug` | Image Gallery, Buy Box, Reviews | `GET /api/products/:slug` |
| Cart | `/cart` | Item List, Price Summary | `GET /api/cart` |
| Checkout | `/checkout` | Address Form, Payment Stripe | `POST /api/orders` |

**Vendor Screens (15+):**
| Screen | Route | Key Components | Connected Endpoints |
|---|---|---|---|
| Dashboard | `/vendor` | Sales Chart, Quick Stats | `GET /api/vendor/stats` |
| Product List | `/vendor/products` | Data Table, Bulk Actions | `GET /api/vendor/products` |

**Delivery Partner Screens (8+):**
| Screen | Route | Key Components | Connected Endpoints |
|---|---|---|---|
| Active Deliveries | `/delivery/active` | Map, Order Cards | `GET /api/delivery/active` |

**Admin Screens (12+):**
| Screen | Route | Key Components | Connected Endpoints |
|---|---|---|---|
| Dashboard | `/admin` | Platform Metrics | `GET /api/admin/metrics` |

### 11.2 Wireframe Descriptions
1. **Customer Home Page:** Search bar at top. Hero carousel. Horizontal scrollable list for 'Recommended for You' powered by AI.
2. **Product Detail Page:** Sticky 'Add to Cart' on mobile. Review section with AI summarized sentiment.
3. **Search Results Page:** Left sidebar for facets (price, brand). Grid of product cards.
4. **Checkout Flow:** Accordion steps: Address -> Shipping Method -> Payment.
5. **Real-time Delivery Tracking:** Full-screen Mapbox view with moving vehicle icon.
6. **AI Chatbot Interface:** Floating FAB bottom right. Opens to a chat UI.
7. **Vendor Dashboard:** Top KPI cards (Sales, Orders). Chart area for revenue over time.
8. **Vendor Product Editor:** Form with rich text editor. "Auto-generate description" button next to text area.
9. **Admin Dashboard:** High-level metrics. Recent alerts (fraud, support).
10. **Admin Vendor Approval:** Split view: Vendor details/docs on left, approve/reject controls on right.

### 11.3 Design System Requirements
- **Typography:** Inter (Sans-serif)
- **Palette:** Primary (#4F46E5), Success (#10B981), Warning (#F59E0B), Danger (#EF4444)
- **Spacing:** 4px baseline grid (4, 8, 12, 16, 24, 32...)
- **Components:** Radix UI primitives + Tailwind CSS
- **Responsive:** Mobile-first, `sm:` (640px), `md:` (768px), `lg:` (1024px)

## 12. Testing Strategy
### 12.1 Testing Pyramid
```
       / \
      /E2E\       <-- Cypress/Playwright (10%)
     /-----\
    / Inte- \     <-- Supertest/Jest + DB (30%)
   / gration \
  /-----------\
 /    Unit     \  <-- Jest (60%)
/---------------\
```

### 12.2 Unit Testing
- **Coverage:** 80%+
- **Framework:** Jest
- **Focus:** Services, pure business logic, validators.
- **Mocking:** `jest.mock` for Prisma, Stripe, AWS.

### 12.3 Integration Testing
- **Framework:** Jest + Supertest
- **Database:** Ephemeral Postgres in Testcontainers.
- **Focus:** API route handlers, authentication flows, Prisma query correctness.

### 12.4 E2E Testing
- **Framework:** Playwright
- **Critical Paths:** Registration, Add to Cart, Checkout, Delivery Tracking, Vendor Product Creation.

### 12.5 Performance Testing
- **Tool:** k6
- **Load Profiles:** Spike testing (flash sales), Soak testing (memory leaks).
- **Baseline:** p95 latency < 200ms for read endpoints.

### 12.6 Security Testing
- **Scans:** OWASP ZAP in CI/CD pipeline.
- **Dependencies:** `npm audit` and Snyk scanning.
- **Pen Testing:** Annual third-party audit.

### 12.7 AI Testing
- **Prompt Regression:** LLM judge to evaluate consistency.
- **Quality Metrics:** Track context relevance and hallucination rates.
- **A/B Testing:** Launch prompts to 10% of traffic, monitor conversion metrics.


---

## 13. Deployment & Infrastructure

### 13.1 Deployment Architecture

The platform follows a containerized deployment strategy leveraging AWS for cloud infrastructure. 

```text
               [User / Client Devices]
                        | (HTTPS)
                 [Amazon Route 53] (DNS)
                        |
               [AWS CloudFront] (CDN) ---> [S3: Static Assets]
                        |
            [AWS Application Load Balancer]
                        |
      +-----------------+-----------------+
      |                                   |
[ECS Node 1: NexCommerce]       [ECS Node 2: NexCommerce]
      |                                   |
      +-----------------+-----------------+
                        | (VPC Internal)
      +---------+-------+-------+---------+
      |         |               |         |
[Amazon RDS] [ElastiCache] [OpenSearch] [Pinecone] 
(PostgreSQL)   (Redis)      (Elastic)  (Vector DB)
```

**Docker Containerization Strategy**
- **Base Image**: `node:20-alpine` for minimal footprint.
- **Multi-stage Builds**: Separating build dependencies from production runtime to reduce image size and attack surface.
- **Docker Compose**: Provided for local development to spin up the Node.js API, PostgreSQL, Redis, and local mock services for Stripe/Elasticsearch.

**Production Deployment (AWS ECS)**
- Managed via AWS Elastic Container Service (ECS) with Fargate for serverless container compute.
- Auto-scaling policies based on CPU/Memory utilization (Target: 70%).

### 13.2 CI/CD Pipeline

```text
[Developer]
    │
    ▼
[Git Push] ────────► [GitHub Actions]
                          │
                          ├─► [Lint (ESLint/Prettier)]
                          │
                          ├─► [Test (Jest Unit & Integration)]
                          │
                          ├─► [Security Scan (Snyk/SonarQube)]
                          │
                          ▼
                     [Build Docker Image]
                          │
                          ▼
                     [Docker Push to ECR]
                          │
                          ▼
                 [Deploy to Staging (ECS)]
                          │
                          ▼
            [Automated Smoke/E2E Tests (Cypress)]
                          │
                          ▼
                 [Deploy to Production]
```

**Branch Strategy & Promotion**
- `main`: Production-ready code. Commits trigger production deployment.
- `develop`: Pre-production. Commits trigger staging deployment.
- `feature/*`: Active development. Requires PR to `develop`.
- `hotfix/*`: Urgent fixes bypassing standard flow straight to `main` and `develop`.

**Rollback Procedure**
- Blue/Green deployments via AWS CodeDeploy. If health checks fail post-deployment, traffic is automatically routed back to the previous stable container revision.

**Feature Flag Integration**
- LaunchDarkly or GrowthBook integrated at the middleware level to decouple deployment from release, allowing dark launches and targeted rollbacks.

### 13.3 Environment Strategy

| Environment | Purpose | Infrastructure | Data |
|-------------|---------|---------------|------|
| Local | Development | Docker Compose | Seed data |
| Staging | Pre-production testing | AWS (scaled down) | Anonymized production data |
| Production | Live | AWS (full scale) | Real data |

### 13.4 Monitoring & Observability

- **Metrics**: Prometheus + Grafana dashboards.
  - *Dashboards*: API Gateway Health, Node.js Event Loop, DB Performance, Queue (BullMQ) Backlog, AI Service Latency, Payment Success Rates.
- **Logging**: Winston logger streaming to AWS CloudWatch.
  - *Log levels*: ERROR, WARN, INFO, DEBUG.
  - *Format*: JSON lines structured logging with Trace IDs.
- **Tracing**: OpenTelemetry for distributed tracing across services (API → DB → AI → Redis).
- **Error tracking**: Sentry integration for real-time frontend and backend exception monitoring.
- **Uptime**: Datadog or Pingdom hitting `/health` (DB, Redis, API) every 1 minute.

**Alerting Rules (15 Critical Alerts)**
| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| API 5xx Spikes | 5xx errors > 1% in 5m | SEV1 | Page On-Call Engineer |
| High p95 Latency | API p95 > 2s for 10m | SEV2 | Slack Alert, Investigate |
| DB CPU High | RDS CPU > 85% for 10m | SEV2 | Check Auto-scaling |
| Redis Mem Limit | Redis memory > 90% | SEV1 | Page On-Call |
| Node Down | Container count < minimum | SEV1 | Trigger ECS Auto-recover |
| Auth Failure Spike| Failed logins > 50/min | SEV3 | Monitor for Brute Force |
| Stripe Webhook Fail| 3 consecutive failures | SEV2 | Check Stripe status/API |
| Queue Backlog | BullMQ pending > 5000 | SEV2 | Scale up worker nodes |
| ClickHouse Disk | Storage > 85% full | SEV3 | Extend storage |
| Pinecone Timeout| Vector search > 3s | SEV2 | Check AI service health |
| Sentry Error Spike| > 100 new errors/min | SEV2 | Slack Dev Team |
| SSL Cert Expiring | < 14 days to expiry | SEV3 | Renew via ACM |
| S3 Upload Failures| > 5% error rate in 5m | SEV2 | Check AWS status |
| Email Delivery Fail| SendGrid bounce > 5% | SEV3 | Review spam blocklists |
| Order Sync Failure| Saga transaction stuck | SEV1 | Page Backend On-Call |

### 13.5 Infrastructure as Code

- **Tool**: Terraform for provisioning AWS resources to ensure reproducible environments.
- **Key Resources**: VPC, Subnets, Security Groups, ALB, ECS Clusters/Services, RDS Instances, ElastiCache Clusters, S3 Buckets, IAM Roles, CloudFront Distributions.

---

## 14. Security & Compliance

### 14.1 Authentication Architecture

- **Tokens**: Short-lived JWT Access Tokens (15 min TTL) + Opaque Refresh Tokens (7 day TTL) stored securely.
- **Storage Strategy**: 
  - Access Token: Memory or short-lived variable (Frontend).
  - Refresh Token: `httpOnly`, `Secure`, `SameSite=Strict` cookies to prevent XSS and CSRF.
- **OAuth 2.0**: Integration for Google and Facebook login via Passport.js.
- **Concurrent Login**: Single active session per device type allowed. Oldest session invalidated if limit exceeded.

**Auth Flow Diagram**
```text
[Client]                      [Auth Service]                  [Database]
   |                               |                              |
   |---- 1. POST /login ---------->|                              |
   |     (email, pass)             |---- 2. Verify Creds -------->|
   |                               |<--- 3. User Data ------------|
   |                               |                              |
   |<--- 4. Set-Cookie (Refresh) --|                              |
   |     Return Access Token       |                              |
   |                               |                              |
   |---- 5. GET /api/data -------->|                              |
   |     (Bearer Access Token)     |                              |
```

### 14.2 Authorization (RBAC)

**Permissions Matrix**
| Resource | Action | Customer | Vendor | Delivery | Admin |
|----------|--------|----------|--------|----------|-------|
| users | create | ✓ | ✓ | ✓ | ✓ |
| users | read | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (all) |
| users | update | ✓ (own) | ✓ (own) | ✓ (own) | ✓ (all) |
| users | delete | ✓ (own) | ✗ | ✗ | ✓ (all) |
| vendors | create | ✗ | ✓ | ✗ | ✓ |
| vendors | read | ✓ | ✓ | ✗ | ✓ |
| vendors | update | ✗ | ✓ (own) | ✗ | ✓ |
| vendors | delete | ✗ | ✗ | ✗ | ✓ |
| products | create | ✗ | ✓ (own) | ✗ | ✓ |
| products | read | ✓ | ✓ | ✗ | ✓ |
| products | update | ✗ | ✓ (own) | ✗ | ✓ |
| products | delete | ✗ | ✓ (own) | ✗ | ✓ |
| orders | create | ✓ | ✗ | ✗ | ✗ |
| orders | read | ✓ (own) | ✓ (own) | ✓ (assigned)| ✓ (all) |
| orders | update | ✓ (cancel)| ✓ (status)| ✗ | ✓ |
| orders | delete | ✗ | ✗ | ✗ | ✗ |
| payments | create | ✓ | ✗ | ✗ | ✗ |
| payments | read | ✓ (own) | ✓ (own) | ✗ | ✓ (all) |
| payments | update | ✗ | ✗ | ✗ | ✓ |
| payments | delete | ✗ | ✗ | ✗ | ✗ |
| delivery | create | ✗ | ✗ | ✗ | ✓ |
| delivery | read | ✓ (own) | ✓ (own) | ✓ (assigned)| ✓ (all) |
| delivery | update | ✗ | ✗ | ✓ (status)| ✓ |
| delivery | delete | ✗ | ✗ | ✗ | ✓ |
| reviews | create | ✓ (buyers)| ✗ | ✗ | ✗ |
| reviews | read | ✓ | ✓ | ✓ | ✓ |
| reviews | update | ✓ (own) | ✗ | ✗ | ✓ |
| reviews | delete | ✓ (own) | ✗ | ✗ | ✓ |
| categories| create | ✗ | ✗ | ✗ | ✓ |
| categories| read | ✓ | ✓ | ✗ | ✓ |
| categories| update | ✗ | ✗ | ✗ | ✓ |
| categories| delete | ✗ | ✗ | ✗ | ✓ |
| analytics| create | ✗ | ✗ | ✗ | ✗ |
| analytics| read | ✗ | ✓ (own) | ✗ | ✓ (all) |
| analytics| update | ✗ | ✗ | ✗ | ✗ |
| analytics| delete | ✗ | ✗ | ✗ | ✗ |
| settings | create | ✗ | ✗ | ✗ | ✓ |
| settings | read | ✗ | ✗ | ✗ | ✓ |
| settings | update | ✗ | ✗ | ✗ | ✓ |
| settings | delete | ✗ | ✗ | ✗ | ✓ |

### 14.3 Data Protection

- **PII Handling**: Passwords hashed with bcrypt (salt rounds: 12). Credit cards handled entirely by Stripe (never touch our DB). Addresses encrypted at rest.
- **Encryption**: TLS 1.3 in transit. AES-256 for RDS volumes at rest.
- **Data Masking**: PII (emails, phone numbers, IP addresses) are masked in Winston logs.
- **GDPR**: Automated "Right to Erasure" endpoint that anonymizes user profiles. Data export available via JSON download in settings.
- **Retention**: Audit logs (1 yr), Transaction data (7 yrs for tax), Server logs (30 days).

### 14.4 Threat Model

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| SQL Injection | Complete DB compromise | Low (ORM used) | Use Prisma ORM, parameterized queries |
| XSS | Session hijacking | Med | React escapes HTML, strictly sanitize UGC |
| CSRF | Unwanted state changes | Low | `SameSite=Strict` cookies, API uses JSON |
| DDoS | Service unavailability | High | AWS WAF, CloudFront Rate Limiting |
| Brute Force | Account takeover | Med | Redis-backed rate limiting on `/login` |
| JWT Theft | Unauthorized access | Low | Short TTL (15m), `httpOnly` refresh tokens |
| IDOR | Accessing others' data | High | Middleware validating `resource.userId == req.user.id` |
| Param Tampering | Changing prices | High | Server-side validation of cart totals/prices |
| Data Leakage | PII exposure | Med | Masking logs, RBAC enforcement |
| SSRF | Internal network access | Low | Restrict outbound calls, validate URLs |
| Rate Limit Bypass | API abuse | Low | IP & Token-based sliding window rate limits |
| Privilege Escalation| Gaining admin rights | Low | Strict JWT role checking middleware |
| API Abuse (Bots) | Scraping/Spam | High | CAPTCHA for signup, WAF bot protection |
| Insecure Deserialization | RCE | Low | Reject XML, validate JSON schema (Zod) |
| Supply Chain Attack | Compromised NPM pkg | Med | Snyk scanning, dependabot, lockfiles |

### 14.5 Incident Response Plan

- **Severity Classification**:
  - SEV1: Critical system down / Data breach.
  - SEV2: Major functionality broken (Checkout, Search).
  - SEV3: Minor feature degraded.
  - SEV4: Cosmetic issue / small bug.
- **Response Timeline**: SEV1/2 (15 mins to acknowledge, continuous updates). SEV3 (24 hours).
- **Communication**: Automated Slack channel creation per incident (`#inc-date-issue`), statuspage.io updates.
- **Post-mortem**: Required for SEV1/SEV2 within 48 hours. Blameless culture focusing on process/automation improvements.

---

## 15. Project Plan & Timeline

### 15.1 Development Phases

**Phase 1: Foundation (Weeks 1-4)**
- Setup CI/CD, IaC, and Docker environments.
- Implement Auth and User modules.
- DB schema and seed generation.
- *Deliverables*: Working API foundation, Auth endpoints, User profiles.

**Phase 2: Core Commerce (Weeks 5-10)**
- Vendor onboarding and store setup.
- Product CRUD, inventory management.
- Basic search integration (Elasticsearch).
- Order orchestration (Saga) and Stripe checkout.
- *Deliverables*: End-to-end shopping cart and checkout flow.

**Phase 3: Logistics & Communication (Weeks 11-14)**
- Delivery tracking endpoints and WebSocket setup.
- Email/SMS notifications via BullMQ.
- Reviews and ratings system.
- *Deliverables*: Post-purchase experience and driver apps.

**Phase 4: AI & Intelligence (Weeks 15-18)**
- Pinecone setup for RAG Chatbot.
- OpenAI integration for dynamic pricing and text generation.
- Fraud detection scoring logic.
- *Deliverables*: Smart features deployed behind feature flags.

**Phase 5: Admin & Polish (Weeks 19-22)**
- Internal admin dashboard.
- Load testing (k6) and query optimization.
- Security audits.
- *Deliverables*: Stable release candidate.

**Phase 6: Launch Prep (Weeks 23-24)**
- UAT with beta users.
- Documentation finalization.
- Production environment tuning.
- *Deliverables*: Go-Live.

### 15.2 Gantt Chart

```text
Project Timeline (Weeks 1-24)
Phase 1: Foundation   [████████]
Phase 2: Commerce             [████████████]
Phase 3: Logistics                        [████████]
Phase 4: AI & Intel                               [████████]
Phase 5: Admin & Polish                                   [████████]
Phase 6: Launch Prep                                              [████]
Weeks                 1...4...7...10...13...16...19...22...24
```

### 15.3 Team Structure

| Role | Count | Responsibilities |
|------|-------|------------------|
| Tech Lead | 1 | Architecture, code review, technical decisions |
| Backend Engineers | 4 | Module development, API implementation, DB schema |
| Frontend Engineers | 2 | Customer, vendor, admin UIs |
| ML/AI Engineer | 1 | AI features, prompt engineering, model integration |
| DevOps Engineer | 1 | CI/CD, infrastructure, AWS, monitoring |
| QA Engineer | 1 | Testing strategy, Cypress E2E automation |
| Product Manager | 1 | Backlog, priorities, stakeholder comms, PRD |

### 15.4 Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Stripe Integration delays | Medium | High | Start payment POC in Week 2 | Backend Eng |
| AI hallucination in chatbot | High | Medium | Strict system prompts, guardrails | AI Engineer |
| Vector DB cost overruns | Medium | High | Optimize chunking, monitor usage | DevOps |
| Third-party API rate limits | High | Medium | Implement robust retry/backoff queues | Tech Lead |
| Elasticsearch sync lag | Medium | Medium | Event-driven CDC (Debezium/Kafka) | Backend Eng |
| Low Vendor Adoption | High | High | Simplified onboarding, early beta incentives | PM |
| Delivery GPS inaccuracy | Medium | Medium | Fallback to manual status updates | Frontend Eng |
| Scope Creep on Admin UI | High | Medium | Strictly MVP features for Admin | PM |
| Key personnel departure | Low | High | Enforce thorough documentation | Tech Lead |
| GDPR Compliance Gaps | Low | High | Legal review of DB schema early | PM |
| Performance issues at scale | Medium | High | k6 load testing in Phase 5 | QA/DevOps |
| Mobile Web UX issues | Medium | Medium | Mobile-first design approach | Frontend Eng |

---

## 16. Success Metrics & Analytics

### 16.1 North Star Metric
**Monthly Gross Merchandise Value (GMV)**: Total sales dollar volume transacted through the platform.

### 16.2 KPI Dashboard

| KPI | Definition | Target | Current | Tracking Method |
|-----|------------|--------|---------|-----------------|
| Business KPIs | | | | |
| GMV | Total transaction volume | $1M/mo | $0 | Order DB Aggregation |
| AOV | Average Order Value | >$50 | $0 | Analytics Engine |
| Conversion Rate | % Visitors who buy | >3% | 0% | PostHog/Google Analytics |
| CAC | Customer Acquisition Cost | <$15 | $0 | Marketing Spend/New Users |
| LTV | Customer Lifetime Value | >$150 | $0 | Historical DB Analysis |
| Product KPIs | | | | |
| MAU | Monthly Active Users | 50,000 | 0 | App Analytics |
| DAU | Daily Active Users | 10,000 | 0 | App Analytics |
| Session Duration| Average time on app | >4 mins| 0 | Analytics Engine |
| Bounce Rate | % leaving after 1 page| <40% | 0 | Web Analytics |
| Cart Abandon | % carts not checked out| <65% | 0 | Event Funnel Tracking |
| Technical KPIs | | | | |
| API Uptime | Platform availability | 99.99% | N/A | Datadog / Pingdom |
| p95 Latency | 95th percentile response| <200ms | N/A | APM (Datadog/NewRelic) |
| Error Rate (5xx)| % of failed requests | <0.1% | N/A | API Gateway Logs |
| Build Time | CI/CD pipeline duration | <10 mins| N/A | GitHub Actions |
| DB Query Time | Average slow query | <50ms | N/A | RDS Performance Insights |
| AI & Feature KPIs | | | | |
| Chatbot Res Rate| % resolved without human| >70% | 0 | Chatbot logs |
| Desc Gen Time | Ms to generate description| <2000ms| 0 | APM Tracing |
| Pricing Lift | Extra margin from AI price| +5% | 0 | A/B Test Results |
| Fraud Precision | True positives / All alerts| >95% | 0 | ML Evaluation pipeline |
| Rec Click-thru | Clicks on AI recommendations| >15% | 0 | Analytics Event tracking |
| Vendor/Logistics| | | | |
| On-Time Delivery| % delivered on ETA | >92% | 0 | Delivery Module |
| Vendor Churn | % vendors leaving / mo | <2% | 0 | DB Metrics |
| Dispute Rate | % orders disputed | <1% | 0 | Support DB |
| Defect Rate | % items returned/broken | <2% | 0 | Order Module |
| Fulfillment Time| Order placed to shipped | <24 hrs| 0 | Logistics Aggregation |

### 16.3 Analytics Events

| Event Name | Trigger | Properties | Used For |
|------------|---------|------------|----------|
| `user_signup` | Account creation | method (email/oauth) | Growth metrics |
| `user_login` | Session start | device, location | Activity tracking |
| `user_logout` | Session end | duration | Session metrics |
| `profile_update` | Setting saved | fields_changed | Profile completeness |
| `password_reset` | Reset requested | success | Security monitoring |
| `address_added` | New address saved | is_default | Funnel tracking |
| `product_view` | Item page loaded | product_id, vendor_id, price | Interest tracking |
| `category_view` | Category page hit| category_name | Navigation patterns |
| `search_query` | Search executed | term, result_count | Search health |
| `filter_applied` | Filter toggled | filter_type, value | UX optimization |
| `add_to_cart` | Item added | product_id, quantity | Conversion funnel |
| `remove_from_cart`| Item removed | product_id | Cart abandonment |
| `cart_view` | Cart page loaded | item_count, total_value | Conversion funnel |
| `checkout_start` | Checkout initiated| cart_id | Conversion funnel |
| `shipping_selected`| Method chosen | method, cost | Logistics preferences |
| `payment_added` | Card/Method saved| provider | Payment friction |
| `order_placed` | Successful payment| order_id, amount, tax | Revenue |
| `order_failed` | Payment declined | reason, gateway | Error monitoring |
| `order_shipped` | Status change | tracking_id | Fulfillment speed |
| `order_delivered` | Status change | delivery_time | SLA monitoring |
| `order_cancelled` | Status change | reason, actor (user/sys)| Churn tracking |
| `return_requested`| RM initiated | reason | Quality control |
| `vendor_signup` | Vendor reg start | business_type | B2B Growth |
| `product_created` | Vendor adds item | category | Catalog growth |
| `product_updated` | Vendor edits item| fields_changed | Catalog maintenance |
| `inventory_updated`| Stock changed | new_count | Supply health |
| `promo_created` | Discount made | % off, duration | Marketing effectiveness |
| `chatbot_opened` | Chat UI clicked | page_url | Feature adoption |
| `chatbot_query` | Message sent | prompt_length | AI engagement |
| `rec_clicked` | AI suggestion hit| algorithm_type | Recommendation ROI |

### 16.4 A/B Testing Plan

| Experiment | Hypothesis | Variant A | Variant B | Success Metric | Duration |
|------------|------------|-----------|-----------|----------------|----------|
| Checkout Flow | 1-page checkout reduces friction compared to multi-step | Multi-step wizard | Single-page accordion | Conversion Rate | 4 weeks |
| Search UI | Grid view performs better than list view for apparel | List View | Grid View | Add to Cart Rate | 2 weeks |
| AI Pricing | Aggressive dynamic pricing maximizes revenue vs conservative | Conservative bounds| Aggressive bounds | Total Revenue | 4 weeks |
| Chatbot Placement| FAB (Floating Action Button) gets more engagement than inline | Inline on product | Floating Chat Icon | Chatbot usage % | 2 weeks |
| Product Layout | Sticky cart button on scroll increases conversions | Standard layout | Sticky 'Buy' button | Conversion Rate | 3 weeks |
| Rec Algorithm | Collaborative filtering beats Content-based | Content-based | Collaborative | Rec Click-thru | 4 weeks |
| Delivery Estimate| Exact dates convert better than date ranges | "3-5 days" | "By Thursday" | Checkout Success | 2 weeks |
| Vendor Onboarding| Multi-step wizard reduces drop-off | Long form | Multi-step wizard | Vendor Completion %| 4 weeks |

---

## 17. Appendix

### 17.1 Glossary

1. **AOV**: Average Order Value.
2. **API**: Application Programming Interface.
3. **AWS**: Amazon Web Services.
4. **BullMQ**: Redis-based message queue for Node.js.
5. **CAC**: Customer Acquisition Cost.
6. **CDC**: Change Data Capture (database syncing).
7. **CI/CD**: Continuous Integration / Continuous Deployment.
8. **ClickHouse**: Columnar database for analytics.
9. **Conversion Rate**: Percentage of visitors who make a purchase.
10. **CSRF**: Cross-Site Request Forgery.
11. **DAU**: Daily Active Users.
12. **Docker**: Containerization platform.
13. **ECS**: Elastic Container Service (AWS).
14. **Elasticsearch**: Search and analytics engine.
15. **Event Loop**: Node.js architecture for async I/O.
16. **FCM**: Firebase Cloud Messaging (Push Notifications).
17. **Gantt Chart**: Project schedule visualization.
18. **GDPR**: General Data Protection Regulation.
19. **GMV**: Gross Merchandise Value.
20. **Grafana**: Observability dashboard tool.
21. **IDOR**: Insecure Direct Object Reference.
22. **Istio**: Service mesh for microservices.
23. **JWT**: JSON Web Token.
24. **Kafka**: Distributed event streaming platform.
25. **k6**: Open-source load testing tool.
26. **KYC**: Know Your Customer (Vendor verification).
27. **LaunchDarkly**: Feature flagging platform.
28. **LTV**: Customer Lifetime Value.
29. **MAU**: Monthly Active Users.
30. **Microservices**: Architectural style of loosely coupled services.
31. **Monolith**: Single-tiered software application.
32. **NPM**: Node Package Manager.
33. **OAuth**: Open Authorization standard.
34. **OpenTelemetry**: Observability framework.
35. **ORM**: Object-Relational Mapping (e.g., Prisma).
36. **PII**: Personally Identifiable Information.
37. **Pinecone**: Vector database for AI embeddings.
38. **PostgreSQL**: Relational database system.
39. **Prometheus**: Monitoring and alerting toolkit.
40. **Prisma**: Next-generation Node.js/TypeScript ORM.
41. **RAG**: Retrieval-Augmented Generation (AI).
42. **RBAC**: Role-Based Access Control.
43. **RDS**: Relational Database Service (AWS).
44. **Redis**: In-memory data structure store.
45. **Saga Pattern**: Pattern for managing distributed transactions.
46. **Sentry**: Error and performance tracking platform.
47. **SQS**: Simple Queue Service (AWS).
48. **Stripe Connect**: Payment routing for multi-vendor marketplaces.
49. **Winston**: Logging library for Node.js.
50. **XSS**: Cross-Site Scripting.

### 17.2 References
- [Architecture Guidelines](architecture.md)
- [Stripe Connect API Docs](https://stripe.com/docs/connect)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Internal Design System (Figma)](#)

### 17.3 Change Log
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Sep 4, 2026 | Platform Team | Initial PRD sections 1-18 |

### 17.4 Open Questions
1. Should vendor payouts be automatic (daily/weekly) or manual requests?
2. Do we require exact precise live GPS tracking for delivery drivers, or just ping intervals?
3. What is the acceptable maximum cost per query for the AI Chatbot?
4. How do we handle international shipping zones for Phase 2?
5. Are we covering payment gateway fees or passing them to the vendors?
6. Should vendors be allowed to bring their own courier integrations (FedEx/UPS) initially?
7. How strict should AI auto-moderation be on product reviews before human intervention?
8. Do we enforce a standardized return policy across all vendors?
9. Is multi-currency support required for MVP?
10. What is the process for offboarding a banned vendor and their pending orders?

---

## 18. Evolution & Scalability Roadmap

### Phase 1: Modular Monolith MVP (0-10K users)
- Single Node.js (Express) instance scaled vertically.
- Single PostgreSQL database + Redis for caching and sessions.
- BullMQ handles async background jobs within the same physical infrastructure.
- Monthly deployment cadence.

### Phase 2: Scale & Extract (10K-100K users)
- Extract Search Module → Standalone Elasticsearch cluster/service.
- Extract Notification Module → Independent worker service.
- Extract AI Module → Separate GPU-backed or isolated service.
- Introduce Apache Kafka to replace BullMQ for heavy inter-service event streaming.
- Setup Read Replicas for PostgreSQL (write to master, read from replica).
- Redis Cluster for distributed caching.
- Weekly deployment cadence.

### Phase 3: Full Microservices (100K+ users)
- Migrate from ECS to Kubernetes (AWS EKS) orchestration.
- Implement Istio Service Mesh for mTLS and advanced traffic routing.
- Deconstruct remaining monolith into independent modules (Auth, User, Vendor, Order, Payment).
- Database-per-service pattern applied (each service owns its data schema).
- Transition synchronous HTTP calls to gRPC for low latency inter-service communication.
- Daily deployment cadence.

### Phase 4: Global Scale (1M+ users)
- Multi-region active-active deployments.
- Edge caching and edge compute via AWS CloudFront/Lambda@Edge.
- Global database replication (Aurora Global DB / CockroachDB).
- Advanced chaos engineering (Gremlin/LitmusChaos) in production.
- Granular feature flagging for regional or cohort-based rollouts.

**Roadmap Diagram**
```text
Growth
  ^
  |                                                  [Phase 4: Global Scale]
  |                                                / - Multi-region, Edge caching
  |                                              /   - Global replication
  |                       [Phase 3: Microservices]   - Chaos engineering
  |                     / - Kubernetes (EKS) 
  |                   /   - gRPC & Service Mesh
  |                 /     - DB-per-service
  | [Phase 2: Scale]- Extract Search/AI/Notify
  | /               - Kafka events
  |/                - DB Read Replicas
  +------------------------------------------------------------> Time
    [Phase 1: MVP] 
    - Node Monolith
    - PostgreSQL + Redis
```
