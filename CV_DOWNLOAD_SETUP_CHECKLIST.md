# CV Download System - Setup Checklist

Complete these steps to activate the CV download verification system:

## ✅ Backend Setup (Already Complete)

- [x] CVDownload MongoDB model created
- [x] TypeScript types defined
- [x] API routes implemented:
  - [x] `/api/cv-download/request-otp` - Generate and send OTP
  - [x] `/api/cv-download/verify-otp` - Validate OTP
  - [x] `/api/cv-download/get-cv` - Download CV file
- [x] Email templates designed
- [x] Frontend modal component created
- [x] Hero component updated with modal integration

## 📋 Required Setup Steps

### 1. Add Your CV File

**Action Required:**
```powershell
# Create the cv directory
New-Item -Path "public\cv" -ItemType Directory -Force

# Add your CV PDF file
# File must be named: Raj_Rabidas_CV.pdf
```

**File Location:** `public/cv/Raj_Rabidas_CV.pdf`

**Status:** ⏳ PENDING - You need to add the file

---

### 2. Configure Email Service

**Gmail Setup Steps:**

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Navigate to "2-Step Verification"
   - Follow setup wizard

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" (enter "Portfolio")
   - Click "Generate"
   - Copy the 16-digit password

3. **Update .env.local**
   ```env
   # Add these lines to your .env.local file
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

**Status:** ⏳ PENDING - You need to configure

---

### 3. Test the System

**Testing Checklist:**

1. **Start Development Server**
   ```powershell
   npm run dev
   ```

2. **Test CV Download Flow**
   - [ ] Go to homepage
   - [ ] Click "DOWNLOAD CV" button
   - [ ] Modal opens
   - [ ] Enter name and email
   - [ ] Click "Continue"
   - [ ] Check email inbox for OTP
   - [ ] Enter 6-digit OTP
   - [ ] Click "Verify & Download"
   - [ ] CV downloads automatically

3. **Test Already-Verified User**
   - [ ] Click "DOWNLOAD CV" again
   - [ ] Enter same email
   - [ ] Should skip OTP step
   - [ ] CV downloads directly

4. **Test OTP Expiry**
   - [ ] Request new OTP
   - [ ] Wait 10+ minutes
   - [ ] Try to verify
   - [ ] Should show error message

**Status:** ⏳ PENDING - After adding CV file and configuring email

---

## 🔍 Verification Commands

### Check if CV file exists
```powershell
Test-Path "public\cv\Raj_Rabidas_CV.pdf"
```
**Expected:** `True`

### Check email configuration
```powershell
Get-Content .env.local | Select-String "EMAIL_"
```
**Expected:** Should show EMAIL_USER and EMAIL_PASSWORD

### Test MongoDB connection
The system will connect automatically when you start the dev server.

---

## 📊 System Status

| Component | Status | Notes |
|-----------|--------|-------|
| Database Model | ✅ Complete | CVDownload schema ready |
| API Routes | ✅ Complete | All 3 endpoints functional |
| Email Service | ⏳ Pending | Need EMAIL_USER & EMAIL_PASSWORD |
| CV File | ⏳ Pending | Add to public/cv/ |
| Frontend Modal | ✅ Complete | Full UI with 3 steps |
| Hero Integration | ✅ Complete | Button opens modal |
| Documentation | ✅ Complete | README created |

---

## 🐛 Troubleshooting

### Issue: "Email configuration missing"
**Solution:** Add EMAIL_USER and EMAIL_PASSWORD to .env.local

### Issue: "CV file not found"
**Solution:** Add Raj_Rabidas_CV.pdf to public/cv/ directory

### Issue: OTP email not received
**Checks:**
1. Check spam/junk folder
2. Verify App Password (not regular Gmail password)
3. Ensure 2FA is enabled on Gmail
4. Check console logs for errors

### Issue: Modal not opening
**Checks:**
1. Check browser console for errors
2. Verify CVDownloadModal import in Hero.tsx
3. Clear browser cache

---

## 🚀 Next Steps After Setup

1. **Test thoroughly** with different email addresses
2. **Monitor email deliverability** (check spam folder)
3. **Add admin dashboard** to view CV download requests
4. **Set up analytics** to track conversion rates
5. **Consider rate limiting** to prevent abuse

---

## 📧 Admin Panel Enhancement (Optional)

You can add an admin page to manage CV downloads:

**Suggested Admin Route:** `/admin/cv-downloads`

**Features to Add:**
- List all CV download requests
- See verification status
- View download counts
- Export email list for newsletter
- Track download trends over time

**Database Query Examples:**
```typescript
// Get all verified users
const verified = await CVDownload.find({ verified: true });

// Get download stats
const stats = await CVDownload.aggregate([
  { $group: { 
    _id: null, 
    totalUsers: { $sum: 1 },
    totalDownloads: { $sum: '$downloadCount' },
    verifiedUsers: { 
      $sum: { $cond: ['$verified', 1, 0] } 
    }
  }}
]);
```

---

## ✨ Success Criteria

System is ready when:
- ✅ All lint errors resolved
- ⏳ CV file exists at public/cv/Raj_Rabidas_CV.pdf
- ⏳ Email service configured in .env.local
- ⏳ Test flow completes successfully
- ⏳ OTP email received within 30 seconds
- ⏳ CV downloads automatically after verification

---

**Documentation:** See `CV_DOWNLOAD_SYSTEM_README.md` for detailed system architecture and API documentation.

**Last Updated:** January 2025
