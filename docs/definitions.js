/**
 * References:
 *  - https://swagger.io/docs/specification/2-0/describing-responses/
 *  - https://swagger.io/docs/specification/using-ref/
 *  - https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/
 * 
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The user ID.
 *      name:
 *        type: string
 *        description: The name of the user.
 *      email:
 *        type: string
 *        description: The email associated with this user. Used for logging in.
 *      password:
 *        type: string
 *        description: The hashed password associated with this user.
 *      jwt:
 *        type: string
 *        description: The current valid JSON Web Token (JWT) to be used in
 *                     the `Authorization` header when making other requests.
 * 
 *  UserExpanded:
 *    allOf:
 *      - $ref: '#/definitions/User'
 *      - type: object
 *        properties:
 *          families:
 *            type: array
 *            description: The families that this user is a member of.
 *            items:
 *              $ref: '#/definitions/Family'
 * 
 * 
 *  Family:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The family ID.
 *      user_id:
 *        type: integer
 *        description: The user ID that this family belongs to.
 *      surname:
 *        type: string
 *        description: The surname/nickname of the family.
 * 
 *  FamilyExpanded:
 *    allOf:
 *      - $ref: '#/definitions/Family'
 *      - type: object
 *        properties:
 *          children:
 *            type: array
 *            description: The children belonging to this particular family.
 *            items:
 *              $ref: '#/definitions/Child'
 * 
 * 
 *  Child:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The child ID.
 *      family_id:
 *        type: integer
 *        description: The family ID that this child belongs to.
 *      name:
 *        type: string
 *        description: The name of the child.
 * 
 *  ChildExpanded:
 *    allOf:
 *      - $ref: '#/definitions/Child'
 *      - type: object
 *        properties:
 *          chores:
 *            type: array
 *            description: The chores belonging to this particular child.
 *            items:
 *              $ref: '#/definitions/Chore'
 * 
 * 
 *  Chore:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The chore ID.
 *      child_id:
 *        type: integer
 *        description: The child ID that this chore belongs to.
 *      user_id:
 *        type: integer
 *        description: The user ID that this chore ultimately belongs to.
 *      title:
 *        type: string
 *        description: The title of the chore.
 *      duedate:
 *        type: string
 *        format: date
 *        description: The date this chore is due by.
 *      completed:
 *        type: boolean
 *        description: Whether or not this chore has been completed.
 *        default: false
 */
