# REST API JSON Documentation

## Current

This backend server now has API documentation generated thanks to Swagger. Go
to https://home-chore-tracker.unubo.app/api-docs to view the docs.

## Legacy

This document outlines the expected JSON object response for the `GET` requests
for each of the API resource types (i.e. `User`, `Family`, `Child`, and `Chore`).

> **Note:** all API requests expect an `Authorization` header containing the JWT
> token for the currently logged-in user (as defined by `GET /api/users/me`).

```js
/**
 * GET /api/users/me
 * 
 * @returns {<User>}
 */
{
  id
  name
  email
  families: [
    {
      id,
      surname,
      user_id
    },
    {
      id,
      surname,
      user_id
    }
  ]
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
      { id, name, family_id, user_id },
      { id, name, family_id, user_id }
    ]
  },
  {
    id
    name
    children: [
      { id, name, family_id, user_id },
      { id, name, family_id, user_id }
    ]
  }
]

/**
 * GET /api/families/:id
 * 
 * @returns {<Family>}
 */
{
  id,
  name,
  user_id,
  children: [
    { id, name, family_id, user_id },
    { id, name, family_id, user_id }
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
    user_id,
    chores: [
      {
        id,
        title,
        description,
        duedate,
        completed,
        child_id,
        user_id
      }
    ]
  },
  {
    id,
    name,
    family_id,
    user_id
    chores: [
      {
        id,
        title,
        description,
        duedate,
        completed,
        child_id,
        user_id
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
  user_id
  chores: [
    {
      id,
      title,
      description,
      duedate,
      completed,
      child_id,
      user_id
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
    title,
    description,
    duedate,
    completed,
    child_id,
    user_id
  },
  {
    id,
    title,
    description,
    duedate,
    completed,
    child_id,
    user_id
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
  user_id
}
```
