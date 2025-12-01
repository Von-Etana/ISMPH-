# Quick Reference: Find/Replace Commands

## For Each File (Except feedback.tsx)

Use these Find/Replace commands in order:

### 1. Change the Selector
**Find:**
```
const { user } = useSelector((state: RootState) => state.auth);
```

**Replace with:**
```
const { profile } = useSelector((state: RootState) => state.auth);
```

### 2. Replace Properties

Run these Find/Replace commands (Ctrl+H or Cmd+H):

| Find | Replace | Notes |
|------|---------|-------|
| `user?.full_name` | `profile?.full_name` | User's full name |
| `user?.state` | `profile?.state` | User's state |
| `user?.role` | `profile?.role` | User's role |
| `user?.email` | `profile?.email` | User's email |
| `user?.id` | `profile?.id` | User's ID |

**Important**: Make sure "Match whole word" is OFF in your Find/Replace dialog!

---

## File-Specific Notes

### chat.tsx
- Most complex - restore structure first
- Then apply Find/Replace for `user?.id` → `profile?.id`

### reports.tsx
- Also remove line 215: `reporterEmail: user?.email,`

### feedback.tsx
- Look for duplicate object properties at lines 599, 601
- Remove one of the duplicates

### admin/users.tsx
- Change import: `User` → `Profile`
- Change role check: `'admin'` → `'super_admin'`
- Add type assertion: `as UserRole`
- Add null check at line 123

---

## Keyboard Shortcuts

### VS Code / Most Editors
- **Find/Replace**: `Ctrl+H` (Windows) or `Cmd+H` (Mac)
- **Go to Line**: `Ctrl+G` (Windows) or `Cmd+G` (Mac)
- **Save**: `Ctrl+S` (Windows) or `Cmd+S` (Mac)
- **Replace All**: `Ctrl+Alt+Enter` (Windows) or `Cmd+Option+Enter` (Mac)

---

## Verification Command

After each file:
```bash
npm run typecheck
```

Watch the error count decrease! 🎯
