# 📋 Step-by-Step Manual Fix Instructions

## Overview

You need to fix 7 files total. Each file follows the same pattern:
1. Change the Redux selector
2. Replace all `user?.` with `profile?.`

**Estimated time**: 20 minutes total (3 minutes per file)

---

## File 1: app/(tabs)/chat.tsx (PRIORITY 1 - Most Complex)

### Current Status
File is corrupted and has syntax errors.

### Fix Instructions

**Step 1**: Open `app/(tabs)/chat.tsx` in your editor

**Step 2**: Find the corrupted section around lines 45-100. Look for malformed code that mixes constants with function calls.

**Step 3**: Replace the entire corrupted section (approximately lines 40-100) with this:

```typescript
// Constants for magic numbers
const CHAT_CONSTANTS = {
  MAX_MESSAGE_HEIGHT: 80,
  SEND_BUTTON_SIZE: 44,
  SEND_BUTTON_RADIUS: 22,
  MESSAGE_BUBBLE_MAX_WIDTH: '80%',
  AVATAR_SIZE: 64,
  ZONE_AVATAR_SIZE: 100,
  ACTION_BUTTON_HEIGHT: 44,
  MODAL_PADDING_TOP: SPACING.xl + 20,
} as const;

export default function ChatScreen() {
  const { profile } = useSelector((state: RootState) => state.auth);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [realtimeUnsubscribe, setRealtimeUnsubscribe] = useState<(() => void) | null>(null);
  const chatService = ChatService.getInstance();

  // Only staff users can access this feature
  const isStaff = profile?.role === 'staff';
  const userZone = profile?.state || 'Lagos';

  const handleError = useCallback((error: Error) => {
    console.error('Chat component error:', error);
    Toast.show({
      type: 'error',
      text1: 'Chat Error',
      text2: 'Something went wrong with the chat. Please refresh and try again.',
    });
  }, []);

  useEffect(() => {
    if (selectedZone) {
      loadChatHistory(selectedZone);
      // Subscribe to real-time updates
      const unsubscribe = chatService.subscribeToZoneMessages(selectedZone, (newMessage) => {
        setChatHistory(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      });
      setRealtimeUnsubscribe(() => unsubscribe);
    }

    // Cleanup subscription when zone changes or component unmounts
    return () => {
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
        setRealtimeUnsubscribe(null);
      }
    };
  }, [selectedZone, chatService]);

  const loadChatHistory = useCallback(async (zone: string) => {
```

**Step 4**: Use Find/Replace (Ctrl+H or Cmd+H) for the entire file:
- Find: `user?.id`
- Replace: `profile?.id`
- Click "Replace All"

**Step 5**: Save the file

**Step 6**: Verify by running:
```bash
npm run typecheck
```

---

## File 2: app/(tabs)/profile.tsx

### Current Errors
- Line 16: `user` should be `profile`
- Line 100: `user.full_name` should be `profile.full_name`
- Line 104: `user.state` should be `profile.state` (2 instances)

### Fix Instructions

**Step 1**: Open `app/(tabs)/profile.tsx`

**Step 2**: Find this line (around line 16):
```typescript
const { user } = useSelector((state: RootState) => state.auth);
```

**Step 3**: Replace with:
```typescript
const { profile } = useSelector((state: RootState) => state.auth);
```

**Step 4**: Use Find/Replace for the entire file:
- Find: `user?.full_name`
- Replace: `profile?.full_name`
- Click "Replace All"

**Step 5**: Use Find/Replace again:
- Find: `user?.state`
- Replace: `profile?.state`
- Click "Replace All"

**Step 6**: Use Find/Replace again:
- Find: `user?.email`
- Replace: `profile?.email`
- Click "Replace All"

**Step 7**: Save the file

---

## File 3: app/(tabs)/reports.tsx

### Current Errors
- Line 104: `user` should be `profile`
- Line 114: `user.state` should be `profile.state`
- Line 116: `user.full_name` should be `profile.full_name`
- Line 215: Remove `reporterEmail` property (not in type)
- Line 230: `user.state` should be `profile.state`
- Line 232: `user.full_name` should be `profile.full_name`
- Line 376: `user.full_name` should be `profile.full_name`

### Fix Instructions

**Step 1**: Open `app/(tabs)/reports.tsx`

**Step 2**: Find this line (around line 104):
```typescript
const { user } = useSelector((state: RootState) => state.auth);
```

**Step 3**: Replace with:
```typescript
const { profile } = useSelector((state: RootState) => state.auth);
```

**Step 4**: Use Find/Replace for the entire file:
- Find: `user?.state`
- Replace: `profile?.state`
- Click "Replace All"

**Step 5**: Use Find/Replace again:
- Find: `user?.full_name`
- Replace: `profile?.full_name`
- Click "Replace All"

**Step 6**: Use Find/Replace again:
- Find: `user?.id`
- Replace: `profile?.id`
- Click "Replace All"

**Step 7**: Find line 215 (look for `reporterEmail`):
```typescript
reporterEmail: user?.email,  // ← Remove this line
```

**Step 8**: Delete that entire line

**Step 9**: Save the file

---

## File 4: app/(tabs)/feedback.tsx

### Current Errors
- Lines 599, 601: Duplicate property names in object literal

### Fix Instructions

**Step 1**: Open `app/(tabs)/feedback.tsx`

**Step 2**: Go to line 599 (use Ctrl+G or Cmd+G)

**Step 3**: Look for an object literal with duplicate keys. It will look something like:
```typescript
{
  someProperty: value1,
  someProperty: value2,  // ← Duplicate!
}
```

**Step 4**: Remove one of the duplicate properties (keep the one with the correct value)

**Step 5**: Repeat for line 601 if there's another duplicate

**Step 6**: Save the file

---

## File 5: app/admin/index.tsx

### Current Errors
- Line 114: `user.full_name` should be `profile.full_name`

### Fix Instructions

**Step 1**: Open `app/admin/index.tsx`

**Step 2**: Find the selector (look for `useSelector`):
```typescript
const { user } = useSelector((state: RootState) => state.auth);
```

**Step 3**: Replace with:
```typescript
const { profile } = useSelector((state: RootState) => state.auth);
```

**Step 4**: Use Find/Replace:
- Find: `user?.full_name`
- Replace: `profile?.full_name`
- Click "Replace All"

**Step 5**: Save the file

---

## File 6: app/admin/users.tsx

### Current Errors
- Line 13: Importing wrong type
- Line 39: Type mismatch
- Line 49: `user.state` should be `profile.state`
- Line 88: Wrong role comparison
- Line 123: Null check needed

### Fix Instructions

**Step 1**: Open `app/admin/users.tsx`

**Step 2**: Find line 13 (the import statement):
```typescript
import { User } from '@/src/store/slices/adminSlice';
```

**Step 3**: Replace with:
```typescript
import { Profile } from '@/src/types';
```

**Step 4**: Find line 39 (look for role assignment):
```typescript
const role = someValue;  // This is a string
```

**Step 5**: Add type assertion:
```typescript
const role = someValue as UserRole;
```

**Step 6**: Find line 49:
```typescript
user.state
```

**Step 7**: Replace with:
```typescript
profile.state
```

**Step 8**: Find line 88 (look for role comparison with 'admin'):
```typescript
if (role === 'admin')
```

**Step 9**: Replace with:
```typescript
if (role === 'super_admin')
```

**Step 10**: Find line 123 (look for a string being passed that could be null):
```typescript
someFunction(stringValue)
```

**Step 11**: Add null check:
```typescript
someFunction(stringValue || '')
```
or
```typescript
if (stringValue) {
  someFunction(stringValue);
}
```

**Step 12**: Save the file

---

## File 7: app/settings/index.tsx

### Current Errors
- Line 85: `user.full_name` should be `profile.full_name`

### Fix Instructions

**Step 1**: Open `app/settings/index.tsx`

**Step 2**: Find the selector:
```typescript
const { user } = useSelector((state: RootState) => state.auth);
```

**Step 3**: Replace with:
```typescript
const { profile } = useSelector((state: RootState) => state.auth);
```

**Step 4**: Use Find/Replace:
- Find: `user?.full_name`
- Replace: `profile?.full_name`
- Click "Replace All"

**Step 5**: Use Find/Replace again:
- Find: `user?.email`
- Replace: `profile?.email`
- Click "Replace All"

**Step 6**: Save the file

---

## ✅ Verification Checklist

After fixing each file, check it off:

- [ ] File 1: app/(tabs)/chat.tsx
- [ ] File 2: app/(tabs)/profile.tsx
- [ ] File 3: app/(tabs)/reports.tsx
- [ ] File 4: app/(tabs)/feedback.tsx
- [ ] File 5: app/admin/index.tsx
- [ ] File 6: app/admin/users.tsx
- [ ] File 7: app/settings/index.tsx

---

## 🧪 Final Verification

After fixing ALL files:

**Step 1**: Run type check
```bash
npm run typecheck
```

**Expected result**: ✅ No errors

**Step 2**: If you see errors, note which file and line number, then go back to that file and fix.

**Step 3**: Once typecheck passes, start the dev server:
```bash
npm run dev
```

**Step 4**: Test the app:
- [ ] Sign in
- [ ] Navigate to each tab
- [ ] Submit a report
- [ ] Check chat (if you're a staff user)
- [ ] View profile
- [ ] Check settings

---

## 🚀 After All Fixes Are Complete

Once everything works:

```bash
# Build for production
eas build --platform android --profile production

# Or build APK for testing
eas build --platform android --profile preview
```

---

## 💡 Tips

1. **Work on one file at a time** - Fix, save, verify
2. **Use Find/Replace carefully** - Make sure "Match whole word" is OFF
3. **Save frequently** - Ctrl+S or Cmd+S after each change
4. **Run typecheck often** - Catch errors early
5. **Don't rush** - Take your time, the pattern is simple

---

## 🆘 If You Get Stuck

If typecheck still shows errors after fixing a file:

1. **Read the error message carefully** - It tells you the exact line and what's wrong
2. **Check the line number** - Go to that line in the file
3. **Look for the pattern** - Is it still `user?.` instead of `profile?.`?
4. **Check spelling** - Make sure you typed `profile` correctly
5. **Check the selector** - Make sure you changed `const { user }` to `const { profile }`

---

## 📊 Progress Tracking

As you complete each file, you can run:
```bash
npm run typecheck 2>&1 | Select-String "error TS" | Measure-Object -Line
```

This shows how many errors remain. Watch the number go down! 🎯

---

**You've got this!** Each file takes about 3 minutes. In 20 minutes, you'll have a fully working, production-ready app! 💪
