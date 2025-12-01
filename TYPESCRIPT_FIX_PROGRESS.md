# TypeScript Fixes Applied

## Fixed So Far

1. ✅ **app/(tabs)/index.tsx** - Changed `user` to `profile` in selector and display
2. ✅ **app/auth/index.tsx** - Added missing `role: 'public'` parameter to signUp

## Remaining Fixes Needed

Due to the large number of similar fixes needed, I recommend we:

1. Run typecheck again to see current status
2. Fix remaining files in batches
3. Test after each batch

The remaining files all have the same pattern:
- Change `user.full_name` → `profile.full_name`
- Change `user.state` → `profile.state`  
- Update selectors to get `profile` instead of `user`

## Files Still Needing Fixes

- app/(tabs)/_layout.tsx (3 errors)
- app/(tabs)/chat.tsx (1 error)
- app/(tabs)/feedback.tsx (2 duplicate property errors)
- app/(tabs)/profile.tsx (3 errors)
- app/(tabs)/reports.tsx (7 errors)
- app/admin/index.tsx (1 error)
- app/admin/users.tsx (5 errors)
- app/settings/index.tsx (1 error)

Total: ~23 errors remaining

Let's run typecheck to confirm current status.
