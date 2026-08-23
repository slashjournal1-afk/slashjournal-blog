# Automatic Author Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep ordinary registration as `READER` while making the explicit author registration path create an `AUTHOR` account immediately.

**Architecture:** The registration page selects an account type and sends a narrow `accountType` value to the existing registration route. The route maps that value to the only permitted roles, creates the user, signs a token with the created role, and returns the role so the client can redirect to the matching dashboard.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Prisma, Node test runner, ESLint.

## Global Constraints

- Ordinary registration remains `READER`.
- Author registration is immediate and has no pending or email-approval state.
- The API must not accept arbitrary RBAC role values from the client.
- Do not add dependencies or change the database schema.

---

### Task 1: Add Registration Role Mapping Coverage

**Files:**
- Create: `src/app/api/auth/register/registration-role.test.ts`
- Modify: `src/app/api/auth/register/route.ts`

**Interfaces:**
- Produces `getRegistrationRole(accountType?: unknown): 'READER' | 'AUTHOR'` for route-level validation and test coverage.

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getRegistrationRole } from './route';

test('maps the author registration path to AUTHOR', () => {
  assert.equal(getRegistrationRole('author'), 'AUTHOR');
});

test('keeps ordinary and invalid registration paths as READER', () => {
  assert.equal(getRegistrationRole('reader'), 'READER');
  assert.equal(getRegistrationRole(undefined), 'READER');
  assert.equal(getRegistrationRole('ADMIN'), 'READER');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/app/api/auth/register/registration-role.test.ts`

Expected: FAIL because `getRegistrationRole` is not exported yet.

- [ ] **Step 3: Write minimal implementation**

Add this exported function to `route.ts` and use its result for both the Prisma `role` field and `generateToken` payload:

```ts
export function getRegistrationRole(accountType?: unknown): 'READER' | 'AUTHOR' {
  return accountType === 'author' ? 'AUTHOR' : 'READER';
}
```

Read `accountType` from the request body:

```ts
const { email, password, displayName, accountType } = await req.json();
const role = getRegistrationRole(accountType);
```

Use `role` in the created user and token instead of hardcoded `READER`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test src/app/api/auth/register/registration-role.test.ts`

Expected: PASS for both tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/auth/register/route.ts src/app/api/auth/register/registration-role.test.ts
git commit -m "feat: map author registration to author role"
```

### Task 2: Add Reader and Author Registration Choices

**Files:**
- Modify: `src/app/(auth)/register/page.tsx`

**Interfaces:**
- Consumes the registration API's `accountType` values `reader` and `author`.
- Produces dashboard navigation based on the returned `data.user.role`.

- [ ] **Step 1: Write the failing test**

No separate component test harness exists in this repository. Use the existing route mapping test as the regression guard, then verify the page source and browser behavior manually after the UI edit.

- [ ] **Step 2: Implement the account choice and request payload**

Add state near the existing form state:

```ts
const [accountType, setAccountType] = useState<'reader' | 'author'>('reader');
```

Add a labeled radio choice before the form fields:

```tsx
<fieldset className="space-y-2">
  <legend className="text-[11px] font-bold uppercase tracking-wider text-[#09090b] dark:text-white">
    Jenis Akun
  </legend>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {[
      { value: 'reader', label: 'Pembaca', description: 'Bookmark, komentar, dan diskusi.' },
      { value: 'author', label: 'Penulis', description: 'Akses langsung ke Studio Penulis.' },
    ].map((option) => (
      <label key={option.value} className="flex cursor-pointer gap-2 rounded-[14px] border border-[#ececee] dark:border-[#3f3f46] p-3">
        <input
          type="radio"
          name="accountType"
          value={option.value}
          checked={accountType === option.value}
          onChange={() => setAccountType(option.value as 'reader' | 'author')}
          className="mt-0.5 text-[var(--accent)] focus:ring-[var(--accent)]"
        />
        <span>
          <span className="block text-xs font-bold text-[#09090b] dark:text-white">{option.label}</span>
          <span className="block text-[11px] text-[#71717a] dark:text-[#a1a1aa]">{option.description}</span>
        </span>
      </label>
    ))}
  </div>
</fieldset>
```

Include `accountType` in the JSON body and change the success redirect:

```ts
body: JSON.stringify({ displayName, email, password, accountType }),
```

```ts
router.push(data.user?.role === 'AUTHOR' ? '/dashboard/creator' : '/dashboard/member');
```

Update the introductory copy to describe both account paths and replace the fixed success message with `Akun berhasil dibuat. Menyiapkan dashboard Anda...`.

- [ ] **Step 3: Run validation**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Run: `npm run lint`

Expected: exit code 0, with no new lint errors in the modified files.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(auth)/register/page.tsx"
git commit -m "feat: add author registration choice"
```

### Task 3: Update RBAC Documentation and Verify the Flow

**Files:**
- Modify: `docs/AUTH_AND_ROLES.md`

- [ ] **Step 1: Document the two registration paths**

Add a short section stating that ordinary registration creates `READER`, the explicit author path creates `AUTHOR` immediately, and there is no email approval or pending state.

- [ ] **Step 2: Run focused verification**

Run: `npx tsx --test src/app/api/auth/register/registration-role.test.ts`

Expected: PASS.

Run: `npx tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only the intended registration files and documentation are modified.
