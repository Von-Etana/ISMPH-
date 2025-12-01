# Quick Fix Guide for Remaining TypeScript Errors

## Current Status: 22 errors → Down from 25!

## Pattern to Fix

All errors follow the same pattern:
```typescript
// ❌ WRONG (old way)
const { user } = useSelector((state: RootState) => state.auth);
<Text>{user?.full_name}</Text>
<Text>{user?.state}</Text>

// ✅ CORRECT (new way)
const { profile } = useSelector((state: RootState) => state.auth);
<Text>{profile?.full_name}</Text>
<Text>{profile?.state}</Text>
```

## Files to Fix (in order of priority)

### 1. app/(tabs)/_layout.tsx (3 errors)
- Line 153: `user.full_name` → `profile.full_name`
- Line 157: `user.state` → `profile.state` (2 instances)
- Change selector from `user` to `profile`

### 2. app/(tabs)/profile.tsx (3 errors)
- Line 100: `user.full_name` → `profile.full_name`
- Line 104: `user.state` → `profile.state` (2 instances)
- Change selector from `user` to `profile`

### 3. app/(tabs)/reports.tsx (5 errors)
- Lines 114, 116, 230, 232, 376: Change `user.` to `profile.`
- Line 215: Remove `reporterEmail` property (not in SubmitReportParams)
- Change selector from `user` to `profile`

### 4. app/(tabs)/chat.tsx (1 error)
- Line 66: `user.state` → `profile.state`
- Change selector from `user` to `profile`

### 5. app/(tabs)/feedback.tsx (2 errors)
- Lines 599, 601: Duplicate property names
- Find and remove duplicate keys in object literal

### 6. app/admin/index.tsx (1 error)
- Line 114: `user.full_name` → `profile.full_name`
- Change selector from `user` to `profile`

### 7. app/admin/users.tsx (5 errors)
- Line 13: Change `import { User }` to `import { Profile }`
- Line 39: Cast string to UserRole type
- Line 49: `user.state` → `profile.state`
- Line 88: Change `'admin'` to `'super_admin'` or `'state_admin'`
- Line 123: Add null check before passing string

### 8. app/settings/index.tsx (1 error)
- Line 85: `user.full_name` → `profile.full_name`
- Change selector from `user` to `profile`

## Quick Decision

Given the repetitive nature of these fixes, you have 2 options:

### Option A: I fix all automatically (Recommended)
- Takes ~15 minutes
- All errors fixed systematically
- Ready to test immediately

### Option B: Test with type errors (Not recommended)
- App will run but not type-safe
- May have runtime errors
- Not production-ready

## My Recommendation

Let me fix all 22 errors automatically. They're all straightforward find-and-replace operations following the same pattern. Once done, we can:

1. Run typecheck (should pass ✅)
2. Run dev server
3. Test the app
4. Build for production

**Would you like me to proceed with fixing all 22 errors?**

Just say "yes, fix all" and I'll complete all fixes in the next few minutes.
