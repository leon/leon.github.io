---
title: Create test data with spring data mongo
layout: post
tags: [spring, mongodb]
github: https://github.com/leon/demo-spring-data-mongodb-mock-data
---

### When developing applications you often need some data when you start out, and it's always a problem getting it into the application, should you use the domain model to programatically create all the records, should you dump the data directly into the database?

The following demo does it by using `Jackson2RepositoryPopulatorFactoryBean`

## How?
place `.json` files in `src/main/resources/mock-data`, they don't have to be named anything special.
Just make sure that the get loaded in the correct order, so that the entities that you are trying to link to with
`@DbRef` exists.

### References?
Only the root objects need to have the special `_class` key, so that jackson knows where to start.

So if you have a embedded object include it as usual

```json
[
  {
    "_class": "se.radley.demo.user.User",
    "id": "leon",
    "email": "leon@radley.se",
    "firstName": "Leon",
    "lastName": "Radley",
    "address": {
      "street": "my street",
      "city": "my city"
    }
  }
]
```

If you need to link to another document via `@DbRef` the other document needs to have a constructor or factory method
to be able to create the document

```java
/**
 * Factory constructor for creating DbRefs
 * @param id
 */
private User(String id) {
    this.id = id;
}

public static User ref(String id) {
    return new User(id);
}
```

That way you can easily create references to objects without having to get the from the db with

```java
User leon = User.ref("leon");
```
