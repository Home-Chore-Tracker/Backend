## REST API JSON Responses for `GET` Requests

This document outlines the expected JSON object response for the `GET` requests
for each of the API resource types (i.e. `User`, `Family`, `Child`, and `Chore`).

> **Note:** all API requests expect an `Authorization` header containing the JWT
> token for the currently logged-in user (as defined by `/api/auth/me`).

```js
/**
 * GET /api/auth/me
 * 
 * @returns {<User>}
 */
{
  id
  name
  email
  family_id
}

/**
 * GET /api/families
 * 
 * @returns {Array.<Family>}
 */
[
  {
    id
    name
    children: [
      { id, name, family_id },
      { id, name, family_id }
    ]
  },
  {
    id
    name
    children: [
      { id, name, family_id },
      { id, name, family_id }
    ]
  }
]

/**
 * GET /api/families/:id
 * 
 * @returns {<Family>}
 */
{
  id
  name
  children: [
    { id, name, family_id },
    { id, name, family_id }
  ]
}

/**
 * GET /api/children
 * 
 * @returns {Array.<Child>}
 */
[
  {
    id,
    name,
    family_id,
    chores: [
      {
        id,
        title,
        description,
        duedate,
        completed,
        child_id
      }
    ]
  },
  {
    id,
    name,
    family_id,
    chores: [
      {
        id,
        title,
        description,
        duedate,
        completed,
        child_id
      }
    ]
  }
]

/**
 * GET /api/children/:id
 * 
 * @returns {<Child>}
 */
{
  id,
  name,
  family_id,
  chores: [
    {
      id,
      title,
      description,
      duedate,
      completed,
      child_id
    }
  ]
}

/**
 * GET /api/chores
 * 
 * @returns {Array.<Chore>}
 */
[
  {
    id,
    name,
    description,
    duedate,
    completed,
    child_id
  },
  {
    id,
    name,
    description,
    duedate,
    completed,
    child_id
  }
]

/**
 * GET /api/chores/:id
 * 
 * @returns {<Chore>}
 */
{
  id,
  name,
  description,
  duedate,
  completed,
  child_id,
}
```
