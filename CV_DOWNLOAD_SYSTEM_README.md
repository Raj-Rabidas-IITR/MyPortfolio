# CV Download Verification System

A secure CV download system with email-based OTP verification to ensure legitimate access and track user interest.

## Features

- **Email Verification**: Users must verify their email before downloading
- **OTP System**: 6-digit one-time password sent via email
- **Smart Caching**: Already-verified users skip OTP step
- **Download Tracking**: Counts downloads per user with timestamps
- **Beautiful UI**: Professional modal with multi-step form
- **Email Template**: Branded HTML email with OTP code

## System Flow

1. **User clicks "Download CV"** button on homepage
2. **Modal opens** requesting name and email
3. **OTP sent** to user's email (10-minute expiry)
4. **User enters OTP** in modal
5. **Verification succeeds** → CV downloads automatically
6. **Future downloads** from same email skip OTP

## Files Created

### Backend (API Routes)
- `app/api/cv-download/request-otp/route.ts` - Generate and send OTP
- `app/api/cv-download/verify-otp/route.ts` - Validate OTP code
- `app/api/cv-download/get-cv/route.ts` - Serve CV file to verified users

### Database
- `lib/models/CVDownload.ts` - MongoDB schema for user verification tracking

### Types
- `types/cvdownload.ts` - TypeScript interfaces for type safety

### Frontend
- `components/CVDownloadModal.tsx` - Multi-step modal component
- `components/Hero.tsx` - Updated with CV modal integration

## Setup Instructions

### 1. Add Your CV File

Create a `public/cv/` directory and add your CV:

```bash
# Create directory
mkdir public\cv

# Add your CV file named exactly as:
public/cv/Raj_Rabidas_CV.pdf
```

**Important:** The filename must be `Raj_Rabidas_CV.pdf` or update the filename in `app/api/cv-download/get-cv/route.ts`

### 2. Configure Email Service

The system uses Gmail SMTP. You need:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate new password for "Mail" on "Other device"

3. **Add to .env.local**:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

### 3. Test the System

1. Click "Download CV" button on homepage
2. Enter your name and a test email
3. Check email inbox for OTP code
4. Enter OTP in modal
5. CV should download automatically

## API Endpoints

### POST `/api/cv-download/request-otp`
Generate OTP and send verification email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "alreadyVerified": false
}
```

### POST `/api/cv-download/verify-otp`
Verify OTP code and mark user as verified.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### GET `/api/cv-download/get-cv?email=user@example.com`
Download CV file (requires verified email).

**Response:** PDF file with download headers

## Database Schema

### CVDownload Collection

```typescript
{
  name: String,           // User's full name
  email: String,          // Unique email address
  verified: Boolean,      // Email verification status
  otp: String,            // Current OTP (select: false)
  otpExpiry: Date,        // OTP expiration time (select: false)
  downloadCount: Number,  // Number of downloads
  lastDownloadAt: Date,   // Last download timestamp
  createdAt: Date,        // First request timestamp
  updatedAt: Date         // Last update timestamp
}
```

**Indexes:**
- `email` - Unique index for fast lookups

**Security:**
- OTP fields excluded from default queries (`select: false`)
- OTP expires in 10 minutes
- Already-verified users skip re-verification

## Email Template

The OTP email includes:
- Gradient header with branding
- Clear 6-digit OTP display
- Expiry warning (10 minutes)
- Professional styling

## Component Usage

### CVDownloadModal

```tsx
import CVDownloadModal from '@/components/CVDownloadModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Download CV
      </button>
      
      <CVDownloadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

**Props:**
- `isOpen` (boolean) - Controls modal visibility
- `onClose` (function) - Callback when modal closes

**Features:**
- Three-step flow (form → OTP → success)
- Loading states during API calls
- Toast notifications for feedback
- Resend OTP functionality
- Change email option
- Auto-download on success

## Security Features

1. **Email Verification** - Ensures real users
2. **OTP Expiry** - 10-minute time limit
3. **Unique Constraint** - One record per email
4. **Hidden OTP** - Not exposed in queries
5. **Download Tracking** - Monitor access patterns

## Troubleshooting

### OTP not received
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_PASSWORD in .env.local
- Ensure Gmail App Password (not regular password)
- Check email service logs

### CV not downloading
- Verify file exists: `public/cv/Raj_Rabidas_CV.pdf`
- Check browser console for errors
- Ensure user is verified in database

### Modal not opening
- Check browser console for errors
- Verify CVDownloadModal import in Hero component
- Check state management (isOpen)

## Admin Panel Integration

Consider adding an admin page to:
- View all CV download requests
- See verification status
- Track download statistics
- Export user list for follow-ups

**Example Admin View:**
```
Total Requests: 150
Verified Users: 120
Total Downloads: 340
```

## Future Enhancements

- **Analytics Dashboard** - Track download trends
- **Custom Email Templates** - Different messages per user type
- **Rate Limiting** - Prevent spam requests
- **Multiple CV Versions** - Allow different files (resume, portfolio, etc.)
- **Social Login** - OAuth verification option
- **SMS OTP** - Alternative to email verification

## Support

If you encounter issues:
1. Check this README
2. Verify .env.local configuration
3. Test email service manually
4. Check MongoDB connection
5. Review browser console errors

---

**System Status:** ✅ Fully functional and ready for production
**Last Updated:** January 2025
