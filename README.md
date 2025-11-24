# Best Menu - Digital Menu Management System

A comprehensive digital menu management system built with Next.js 15, TypeScript, MongoDB, and Mongoose. This application allows restaurant owners and business operators to create, manage, and showcase their digital menus with a beautiful, responsive interface.

## Features

### Core Features

- 🏪 **Business Management**: Create and manage multiple restaurants/businesses
- 📋 **Menu Management**: Organize menu items with categories and detailed information
- 🎨 **Customizable Design**: Personalize menu appearance with colors and themes
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌙 **Dark/Light Mode**: Built-in theme switching
- 🔒 **Authentication**: Secure user authentication and authorization
- 📊 **Analytics**: Track menu performance and customer engagement

### Business Features

- Multiple business support per user
- Working hours management
- Contact information and social media links
- Branch locations and addresses
- Cuisine types and price ranges
- Business features and amenities

### Menu Features

- Category-based organization
- Rich item descriptions with images
- Pricing with original price support (for discounts)
- Nutritional information and calories
- Allergen information and dietary restrictions
- Ingredient lists
- Item variants and add-ons
- Availability scheduling
- Featured and popular item marking

### Technical Features

- Server-side rendering with Next.js 15
- TypeScript for type safety
- MongoDB with Mongoose ODM
- Radix UI components with shadcn/ui
- Tailwind CSS for styling
- JWT authentication
- RESTful API design
- Image upload support (ready for Cloudinary)
- Email notifications (ready for SMTP)

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, React 19
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Icons**: Lucide React
- **Theme**: next-themes
- **Form Handling**: Native React with controlled components
- **State Management**: React hooks and context

## Installation

### Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/best-menu.git
cd best-menu
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/best-menu

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextJS
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (Optional - for Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App Configuration
APP_URL=http://localhost:3000
APP_NAME=BestMenu
NODE_ENV=development
```

### Database Setup

Make sure your MongoDB instance is running. The application will automatically create the necessary collections and indexes.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
menutap/
├── src/
│   ├── app/
│   │   ├── (private)/
│   │   │   └── customer-panel/        # Protected customer dashboard
│   │   │       ├── businesses/        # Business management
│   │   │       ├── categories/        # Category management
│   │   │       ├── menu-items/       # Menu item management
│   │   │       └── _components/      # Private components
│   │   ├── (public)/
│   │   │   ├── (menu)/              # Public menu display
│   │   │   └── (web-site)/          # Marketing website
│   │   ├── api/                     # API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── businesses/         # Business CRUD operations
│   │   │   ├── categories/         # Category CRUD operations
│   │   │   └── menu-items/         # Menu item CRUD operations
│   │   ├── globals.css             # Global styles
│   │   └── layout.tsx              # Root layout
│   ├── components/
│   │   └── ui/                     # Reusable UI components
│   ├── lib/
│   │   ├── db/
│   │   │   └── connection.ts       # MongoDB connection
│   │   └── models/                 # Mongoose models
│   │       ├── User.ts
│   │       ├── Business.ts
│   │       ├── Category.ts
│   │       └── MenuItem.ts
│   ├── providers/                  # React context providers
│   ├── hooks/                      # Custom React hooks
│   └── utility/                    # Utility functions
├── public/                         # Static assets
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "09123456789"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Business Management

#### Create Business

```http
POST /api/businesses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Restaurant",
  "nameEn": "My Restaurant",
  "description": "Best food in town",
  "slug": "my-restaurant",
  "phone": "09123456789",
  "email": "info@restaurant.com",
  "address": {
    "street": "123 Main St",
    "city": "Tehran",
    "state": "Tehran",
    "postalCode": "1234567890"
  },
  "cuisine": ["Iranian", "Fast Food"],
  "priceRange": "moderate",
  "features": ["Parking", "Wi-Fi"],
  "workingHours": [
    {
      "day": "monday",
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "22:00"
    }
  ]
}
```

#### Get Businesses

```http
GET /api/businesses?owner=me&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Business

```http
GET /api/businesses/:id
Authorization: Bearer <token>
```

#### Update Business

```http
PUT /api/businesses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Restaurant Name",
  "description": "Updated description"
}
```

#### Delete Business

```http
DELETE /api/businesses/:id
Authorization: Bearer <token>
```

### Category Management

#### Create Category

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "business": "business_id_here",
  "name": "Appetizers",
  "nameEn": "Appetizers",
  "description": "Delicious starters",
  "slug": "appetizers",
  "order": 1,
  "isActive": true,
  "isVisible": true
}
```

#### Get Categories

```http
GET /api/categories?businessId=business_id&page=1&limit=20
Authorization: Bearer <token>
```

### Menu Items Management

#### Create Menu Item

```http
POST /api/menu-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "business": "business_id_here",
  "category": "category_id_here",
  "name": "Grilled Chicken",
  "nameEn": "Grilled Chicken",
  "description": "Tender grilled chicken with herbs",
  "price": 150000,
  "originalPrice": 180000,
  "currency": "IRR",
  "calories": 350,
  "preparationTime": 25,
  "ingredients": [
    {
      "name": "Chicken breast",
      "allergen": false
    }
  ],
  "allergens": ["dairy"],
  "dietaryInfo": ["halal"],
  "isVegetarian": false,
  "isVegan": false,
  "isGlutenFree": true,
  "isFeatured": true,
  "isActive": true,
  "isAvailable": true
}
```

#### Get Menu Items

```http
GET /api/menu-items?businessId=business_id&categoryId=category_id&page=1&limit=20
Authorization: Bearer <token>
```

## Database Schema

### User Model

- Email and password authentication
- Profile information (firstName, lastName, phone)
- Role-based access (customer, admin)
- Email verification system
- Password reset functionality

### Business Model

- Complete business information
- Owner relationship
- Address with coordinates support
- Working hours configuration
- Social media links
- SEO optimization fields
- Custom settings and theme colors

### Category Model

- Hierarchical menu organization
- Multi-language support (Persian/English)
- Visibility and availability controls
- Custom ordering
- SEO optimization

### MenuItem Model

- Comprehensive product information
- Pricing with discount support
- Nutritional information
- Allergen and dietary restrictions
- Multi-variant support
- Add-ons and customizations
- Analytics tracking
- Availability scheduling

## Features Overview

### Customer Panel

- **Dashboard**: Overview of all businesses and quick stats
- **Business Management**: Create, edit, and manage restaurant information
- **Menu Builder**: Visual menu creation with drag-and-drop ordering
- **Category Manager**: Organize menu items into categories
- **Item Editor**: Rich menu item editor with images and details
- **Settings**: Customize appearance, colors, and behavior
- **Analytics**: Track menu performance and customer engagement
- **Preview**: Real-time menu preview

### Public Menu Display

- **Mobile-First Design**: Optimized for mobile devices
- **Fast Loading**: Server-side rendering for optimal performance
- **Search & Filter**: Easy item discovery
- **Category Navigation**: Smooth category switching
- **Item Details**: Rich product information display
- **Responsive Images**: Optimized image loading
- **Social Sharing**: Easy menu sharing capabilities

## Customization

### Theme Colors

The application supports custom color schemes through CSS variables:

```css
:root {
  --rose-gold: #d4a574;
  --rose-gold-light: #f4e4c1;
  --rose-gold-dark: #c19660;
  --rose-gold-accent: #e8b4a0;
  --rose-gold-muted: #f9f2e8;
}
```

### Adding Custom Components

1. Create component in `src/components/ui/`
2. Export from component file
3. Import and use in your pages

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the existing color scheme
- Maintain responsive design principles
- Use shadcn/ui components when possible

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages

### Database Guidelines

- Use Mongoose schema validation
- Add appropriate indexes for performance
- Include error handling in all queries
- Use transactions for complex operations

### API Guidelines

- Follow RESTful conventions
- Include proper error handling
- Validate all inputs
- Use appropriate HTTP status codes
- Include authentication checks

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_URL=https://yourdomain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@bestmenu.ir or join our Discord server.

## Roadmap

- [ ] Image upload and management system
- [ ] QR code generation for menus
- [ ] Online ordering system
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email marketing integration
- [ ] Mobile app (React Native)
- [ ] Print-ready menu generation
- [ ] Inventory management
- [ ] Staff management system
- [ ] Customer feedback system

## Credits

- Built with [Next.js](https://nextjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [MongoDB](https://www.mongodb.com/)
