# Humaling

A modern Next.js website with DecapCMS for seamless content management, optimized for Netlify deployment.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **DecapCMS** for content management
- **Tailwind CSS** for styling
- **Static Site Generation** for optimal performance
- **Netlify Integration** for seamless deployment
- **Responsive Design** that works on all devices

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **CMS**: DecapCMS
- **Deployment**: Netlify
- **Content**: Markdown files stored in Git

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git repository
- Netlify account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd humaling
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Content Management

1. **Access the admin panel**
   Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

2. **Configure DecapCMS**
   - Set up your Git backend (GitHub, GitLab, etc.)
   - Configure authentication (Netlify Identity recommended)
   - Customize content collections in `public/admin/config.yml`

3. **Start creating content**
   - Create blog posts
   - Update page content
   - Manage site settings

## 🚀 Deployment

### Netlify Deployment

1. **Connect your repository**
   - Push your code to GitHub/GitLab
   - Connect your repository to Netlify

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

3. **Set up environment variables**
   - Configure any required environment variables in Netlify dashboard

4. **Enable Netlify Identity** (for CMS authentication)
   - Go to Site Settings > Identity
   - Enable Identity service
   - Configure registration and login options

### Manual Deployment

```bash
# Build the project
npm run build

# The static files will be generated in the `out` directory
# Upload the contents of `out` to your hosting provider
```

## 📁 Project Structure

```
humaling/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   └── blog/              # Blog pages
├── content/               # CMS content
│   ├── blog/              # Blog posts
│   ├── pages/             # Page content
│   └── settings/          # Site settings
├── public/                # Static assets
│   ├── admin/             # DecapCMS admin
│   └── images/            # Images and uploads
├── netlify.toml           # Netlify configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### DecapCMS Configuration

The CMS is configured in `public/admin/config.yml`. You can customize:

- Content collections (blog posts, pages, etc.)
- Field types and validation
- Media upload settings
- Authentication providers

### Next.js Configuration

- Static export enabled for Netlify deployment
- Image optimization disabled for static export
- Trailing slashes enabled for better compatibility

### Tailwind CSS

- Custom color scheme and typography
- Responsive design utilities
- Component-based styling approach

## 📝 Content Management

### Creating Blog Posts

1. Navigate to `/admin`
2. Click on "Blog" collection
3. Click "New Blog"
4. Fill in the required fields:
   - Title
   - Publish date
   - Description
   - Content (Markdown)
   - Tags
   - Featured image

### Managing Pages

1. Navigate to `/admin`
2. Click on "Pages" collection
3. Edit existing pages or create new ones
4. Update content using the visual editor

### Site Settings

1. Navigate to `/admin`
2. Click on "Settings" collection
3. Update general site information:
   - Site title and description
   - Contact information
   - Social media links

## 🎨 Customization

### Styling

- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Create new components in the `app` directory

### Content Structure

- Edit `public/admin/config.yml` to modify CMS structure
- Add new content collections as needed
- Customize field types and validation rules

### Pages and Routing

- Add new pages in the `app` directory
- Follow Next.js App Router conventions
- Update navigation in layout components

## 🔒 Security

- Netlify Identity for CMS authentication
- Git-based content versioning
- Secure headers configured in `netlify.toml`
- Environment variable protection

## 📈 Performance

- Static site generation for fast loading
- Optimized images and assets
- Minimal JavaScript bundle
- CDN distribution via Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [DecapCMS documentation](https://decapcms.org/docs/)
- Visit [Netlify documentation](https://docs.netlify.com/)

---

Built with ❤️ using Next.js, DecapCMS, and Netlify

