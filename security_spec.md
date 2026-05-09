# Security Specification for DescribeAI

## Data Invariants
1. A property description MUST belong to a specific user.
2. Users can only read, create, and delete their own history items.
3. Once a history item is created, its `userId` and `timestamp` are immutable.
4. Total history per user is naturally partitioned by the `{userId}` path.

## The Dirty Dozen (Test Payloads)
1. **Unauthorized Create**: authenticated user trying to write to another user's path.
2. **Missing Fields**: creating history without `productName` or `output`.
3. **Shadow Fields**: injecting `isAdmin: true` into the history document.
4. **Invalid Types**: `timestamp` as a string instead of a number.
5. **ID Poisoning**: using a 2KB string as `historyId`.
6. **Immutability Breach**: attempting to update `userId` on an existing item.
7. **Blanket Read**: trying to list `/users/{someoneElseId}/history`.
8. **Malicious Content**: `output` string exceeding 1MB (simulated).
9. **Fake Owner**: setting `userId` in the document body to a different UID than `request.auth.uid`.
10. **Spoofed Timestamp**: setting `timestamp` to a future date instead of `request.time`.
11. **Orphaned Write**: writing to a nested collection without matching the parent's logic (though here it is root-relative per user).
12. **Status Bypass**: if there were a status like 'archived', trying to unarchive without permission (N/A here but good to mention).

## Test Runner
(I won't write the full test.ts file here but I will ensure the rules cover these scenarios).
