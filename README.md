# Figranium Templates

The community-powered automation presets hub for [Figranium](https://figranium.dev) — browse, share, and download pre-built automation workflows.

🌐 **[templates.figranium.dev](https://templates.figranium.dev)**

## What is this?

Figranium Templates is an open marketplace where users can share and discover automation presets. Each preset is a ready-to-use configuration that can be imported directly into Figranium to automate tasks like web scraping, QA testing, lead generation, and more.

## Features

- **Browse Presets** — Search and filter community-submitted automation workflows by category
- **Download Configs** — Download or copy preset configurations as JSON, ready to import
- **Submit Presets** — Share your own automation workflows with the community
- **Creator Dashboard** — Manage your submitted presets and track downloads

## How It Works

Figranium Templates simplifies the sharing of automation configurations.

1. **Browse**: Users explore categories like "Lead Gen" or "QA Testing" to find relevant presets.
2. **Download**: Each preset includes a JSON configuration file. Clicking "Download" saves this file locally, or users can copy the JSON directly.
3. **Import**: The downloaded JSON file is imported into the **Figranium** desktop application, instantly configuring the tool with the selected workflow.

## Architecture & Tech Stack

The platform is built as a modern, full-stack web application designed for performance and simplicity.

### Core Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Key Libraries
- **Authentication**: Custom implementation using `bcrypt` for password hashing and `jose` for JWT handling.
- **Database Access**: `pg` (node-postgres) for direct SQL queries.
- **Validation**: `zod` for schema validation.
- **UI Components**: Custom components with `lucide-react` for icons.

## Under the Hood

### Database Schema
The application uses a relational database model centered around users and presets.
- **Users**: Stores account information, including email, hashed passwords, and verification status.
- **Presets**: The core entity, containing the automation configuration (JSON), metadata (title, description, author), and performance metrics (downloads).
- **Verification Tokens**: Handles secure email verification flows.

### Performance
- **Server-Side Rendering (SSR)**: Leveraging Next.js App Router for fast initial loads and SEO.
- **Optimized Queries**: Direct SQL execution ensures low-latency data retrieval for search and filtering.

## Categories

| Category | Description |
|---|---|
| 🧪 QA Testing | Automated test flows and site audits |
| 👥 Lead Gen | Contact scraping and outreach automation |
| 📱 Social Media | Social platform monitoring and posting |
| 🛒 Shopping | Price tracking and product monitoring |
| 📊 Monitoring | Uptime checks and change detection |

## Open Source & Self-Hosting

This repository contains the source code for **[templates.figranium.dev](https://templates.figranium.dev)**, the official community marketplace for Figranium automation presets.

### Why Open Source?
We believe in transparency. By open-sourcing the platform code, we allow the community to:
- **Audit the codebase** for security and privacy practices.
- **Verify how data is handled** (e.g., how templates are stored and retrieved).
- **Inspect the implementation** of the marketplace features.

The site is built using **Next.js**, **PostgreSQL**, and **Tailwind CSS**. It serves as a centralized hub for users to share and discover automation configurations.

### Self-Hosting Policy
The code is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE). You are legally free to:
- **Self-host** your own instance of the marketplace.
- **Modify** the code for your own needs.
- **Redistribute** modified versions (under the same AGPL license).

**However, please note:**
1. **This project is not designed for self-hosting.** We do not provide installation guides, Docker containers, or support for running your own instance.
2. **The value is in the network.** The official site connects thousands of Figranium users. A self-hosted instance will be isolated from the main community repository.
3. **No Support.** We cannot assist with setup, configuration, or debugging of self-hosted instances.

You are welcome to explore, learn from, and adapt this code, but we recommend using the official [templates.figranium.dev](https://templates.figranium.dev) for the best experience.

## Contributing

Submit presets directly through the platform at [templates.figranium.dev](https://templates.figranium.dev), or open a pull request.

## License

See [LICENSE](LICENSE) for details.
