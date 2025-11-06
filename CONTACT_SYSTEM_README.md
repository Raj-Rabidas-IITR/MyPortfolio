# Contact Management System - Setup Guide

## ✅ Features Implemented

### Frontend (Public)
- ✅ Contact form with validation
- ✅ Toast notifications for success/error
- ✅ Form data saved to MongoDB

### Admin Panel
- ✅ Contacts page in admin sidebar
- ✅ DataTable with search, filter, and pagination
- ✅ Status management (pending/resolved)
- ✅ View contact details in modal
- ✅ Send email replies via Gmail
- ✅ Delete contacts
- ✅ Real-time statistics (total, pending, resolved)

## 📧 Email Configuration (Gmail Setup)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", click on "2-Step Verification"
4. Follow the steps to enable it

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google Account
3. In the "Select app" dropdown, choose "Mail"
4. In the "Select device" dropdown, choose "Other (custom name)"
5. Enter a name like "Portfolio Contact System"
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Create a `.env.local` file in your project root and add:

```env
# Email Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Important:** 
- Use the App Password, NOT your regular Gmail password
- Remove spaces from the app password
- Keep this file secure and never commit it to Git

## 🚀 Usage

### For Users (Public)
1. Visit the Contact section on your portfolio
2. Fill in name, email, subject, and message
3. Click "Send" - message will be saved with "pending" status

### For Admin
1. Login to admin panel
2. Click "Contacts" in sidebar
3. View all contact submissions
4. Use search to find specific contacts
5. Filter by status (All/Pending/Resolved)

### Responding to Contacts
1. Click the eye icon (👁️) to view details
2. Click "Send Email" button
3. Type your reply message
4. Click "Send Email & Mark Resolved"
5. Email will be sent and status updated automatically

### Managing Contacts
- **View**: Click eye icon to see full details
- **Email**: Click mail icon to send reply
- **Delete**: Click trash icon to remove contact
- **Status**: Update manually via view modal if needed

## 📊 Features

### Search & Filter
- Search by name, email, or message content
- Filter by status (pending/resolved)
- Real-time filtering without page reload

### Pagination
- 10 contacts per page
- Navigate with Previous/Next buttons
- Shows current page and total pages

### Statistics Dashboard
- Total contacts count
- Pending contacts (yellow)
- Resolved contacts (green)

### Email Template
Emails include:
- Professional greeting
- Your custom reply
- Original message from user
- Professional signature

## 🔒 Security Notes

1. **Never commit .env files** to Git
2. Use App Passwords, not regular passwords
3. Keep EMAIL_PASSWORD secure
4. Admin routes require authentication
5. Public API (/api/contacts POST) is rate-limited

## 📝 API Endpoints

### Public
- `POST /api/contacts` - Submit contact form

### Admin Only
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/[id]` - Get single contact
- `PATCH /api/contacts/[id]` - Update contact status
- `DELETE /api/contacts/[id]` - Delete contact
- `POST /api/contacts/send-email` - Send email reply

## 🐛 Troubleshooting

### Email Not Sending
1. Check EMAIL_USER is correct Gmail address
2. Verify EMAIL_PASSWORD is the 16-char App Password
3. Ensure 2FA is enabled on Gmail
4. Check spam folder for test emails
5. Review server logs for error messages

### App Password Not Working
1. Regenerate new App Password
2. Remove all spaces from password
3. Update .env.local file
4. Restart development server

### Contacts Not Saving
1. Verify MongoDB connection (MONGODB_URI in .env)
2. Check database is running
3. Review browser console for errors
4. Check API route logs

## 🎯 Next Steps

Optional enhancements you can add:
- Email templates with HTML styling
- Attachments support
- Bulk actions (delete multiple, mark multiple as resolved)
- Export contacts to CSV
- Email scheduling
- Auto-responses
- Category/tags for contacts
- Response templates

## 📚 Technologies Used

- **Next.js 15** - Framework
- **MongoDB** - Database
- **Nodemailer** - Email sending
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications
- **Lucide React** - Icons

---

**Need Help?** Check the error logs or contact support.
