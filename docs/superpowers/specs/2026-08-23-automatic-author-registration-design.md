# Automatic Author Registration

Status: Approved

## Goal

Keep ordinary registration as `READER` while allowing users who explicitly choose the author registration path to become `AUTHOR` immediately, without email approval or a pending state.

## Design

- The registration page offers two account paths: reader and author.
- The client sends `accountType: "reader"` or `accountType: "author"` to `POST /api/auth/register`.
- The API maps only those two values to `READER` and `AUTHOR`; it never accepts an arbitrary RBAC role from the client.
- The session token uses the created user's actual role.
- Readers redirect to `/dashboard/member`; authors redirect to `/dashboard/creator`.
- UI copy does not mention waiting for approval or email approval.

## Verification

- Test the registration role mapping for both account types.
- Run TypeScript validation and lint.
- Confirm existing registration behavior remains `READER` when no author path is selected.
