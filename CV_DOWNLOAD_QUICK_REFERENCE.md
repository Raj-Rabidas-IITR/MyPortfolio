# CV Download System - Quick Reference

## 🎯 What You Need to Do Now

### 1️⃣ Add Your CV File (Required)
```powershell
# Create directory
New-Item -Path "public\cv" -ItemType Directory -Force

# Add your CV file here:
# public/cv/Raj_Rabidas_CV.pdf
```

### 2️⃣ Configure Gmail (Required)

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate password for "Mail" → "Other (Portfolio)"
3. Copy the 16-digit password

**Add to .env.local:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### 3️⃣ Test the System
```powershell
npm run dev
```
Then:
1. Visit homepage
2. Click "DOWNLOAD CV"
3. Enter your email
4. Check inbox for OTP
5. Enter OTP code
6. CV downloads! ✅

---

## 📁 Files Created

### Backend
- `app/api/cv-download/request-otp/route.ts` - Send OTP email
- `app/api/cv-download/verify-otp/route.ts` - Verify code
- `app/api/cv-download/get-cv/route.ts` - Download file

### Database
- `lib/models/CVDownload.ts` - User tracking

### Frontend
- `components/CVDownloadModal.tsx` - Beautiful UI
- `components/Hero.tsx` - Updated button

### Documentation
- `CV_DOWNLOAD_SYSTEM_README.md` - Full docs
- `CV_DOWNLOAD_SETUP_CHECKLIST.md` - Setup guide
- `CV_DOWNLOAD_QUICK_REFERENCE.md` - This file

---

## 🔧 System Features

✅ **Email Verification** - Ensures real users  
✅ **OTP Security** - 6-digit code, 10-min expiry  
✅ **Smart Caching** - Verified users skip OTP  
✅ **Download Tracking** - Count per user  
✅ **Beautiful UI** - Professional modal  
✅ **HTML Emails** - Branded templates  

---

## 📊 What Happens When User Clicks "Download CV"?

```
1. Modal Opens
   ↓
2. User enters Name + Email
   ↓
3. System checks if email already verified
   ↓
   ├─ YES → Download CV immediately
   └─ NO → Continue to step 4
   ↓
4. Generate 6-digit OTP
   ↓
5. Send beautiful HTML email
   ↓
6. User enters OTP in modal
   ↓
7. Verify OTP (check expiry)
   ↓
8. Mark user as verified
   ↓
9. Download CV automatically
   ↓
10. Track download count
```

---

## 🎨 User Experience

### First-Time User
1. Clicks "DOWNLOAD CV"
2. Sees modal: "Quick verification required"
3. Enters name + email
4. Gets OTP email within seconds
5. Enters 6-digit code
6. CV downloads
7. Success message shown

### Returning User (Same Email)
1. Clicks "DOWNLOAD CV"
2. Enters email
3. CV downloads immediately (no OTP)

---

## 💾 Database Schema

```typescript
CVDownload {
  name: string              // User's name
  email: string (unique)    // Email address
  verified: boolean         // Verification status
  otp: string (hidden)      // Current OTP
  otpExpiry: Date (hidden)  // OTP expiration
  downloadCount: number     // Total downloads
  lastDownloadAt: Date      // Last download time
  createdAt: Date           // First request
  updatedAt: Date           // Last update
}
```

---

## 🔐 Security Features

- **Email Verification Required**
- **OTP Expires in 10 Minutes**
- **OTP Hidden from Database Queries**
- **Unique Email Constraint**
- **Download Tracking for Monitoring**

---

## 📧 Email Template Preview

```
┌─────────────────────────────────┐
│  [Gradient Header]              │
│  Verify Your Email              │
└─────────────────────────────────┘

Hi [Name],

Your verification code is:

┌─────────────┐
│   123456    │  ← OTP Code
└─────────────┘

This code expires in 10 minutes.

[Footer with branding]
```

---

## 🚨 Common Issues & Solutions

### OTP Not Received?
- Check spam/junk folder
- Verify EMAIL_USER and EMAIL_PASSWORD
- Must use App Password (not regular password)
- Ensure Gmail 2FA is enabled

### CV Not Downloading?
- File must exist: `public/cv/Raj_Rabidas_CV.pdf`
- Check browser console for errors
- Verify user is verified in database

### Modal Not Opening?
- Check browser console
- Clear cache and reload
- Verify import in Hero.tsx

---

## 📈 Future Enhancements

**Analytics Dashboard:**
- Total requests
- Verified vs unverified
- Download trends
- Popular times

**Admin Features:**
- View all requests
- Export email list
- Resend OTP manually
- Block suspicious users

**User Experience:**
- Social login (Google/LinkedIn)
- SMS OTP option
- Multiple CV versions
- PDF preview before download

---

## 🎯 Success Checklist

Before going live, verify:
- [ ] CV file exists at correct path
- [ ] Email credentials in .env.local
- [ ] Test OTP email received
- [ ] Test download works
- [ ] Test already-verified flow
- [ ] Check mobile responsiveness
- [ ] Monitor spam folder delivery

---

## 📞 Support

**Full Documentation:** `CV_DOWNLOAD_SYSTEM_README.md`  
**Setup Guide:** `CV_DOWNLOAD_SETUP_CHECKLIST.md`  

**System Status:** ✅ Ready (just add CV file + email config)  
**Code Quality:** ✅ All lint errors resolved  
**Security:** ✅ OTP verification active  

---

**Built with:** Next.js, MongoDB, Nodemailer, React, TypeScript  
**Last Updated:** January 2025
