---
title: Spring Boot Message Source Urls
categories: [spring]
tags: [spring]
---

#### Handling multiple environments, Locales and urls can be tricky. Here I'll show you a trick on how to get things organized.

Spring boot comes with a predefined `MessageSource` that you can inject into any component.

For this example we are going to start by changing the default config to also include a urls resource bundle.

open `application.yml` and adding
```yml
spring.messages.basename=messages,urls
```
This will load messages both from
* messages.properties
* urls.properties

### Production Profile
We now create a `application-prod.yml` file which will hold all our configurations for the `prod` profile.

We override `basename` so that it points at `urls-prod`.
application-prod.yml:
```yml
spring.messages.basename=messages,urls-prod
```

### Url properties file layout

urls.properties:
```properties
site.url = http://www.myapp.dev
site.disclaimer = http://www.myapp.dev/disclaimer

portal.url = http://portal.myapp.dev
portal.account = http://portal.myapp.dev/account

```

urls_sv.properties:
```properties
portal.account = http://portal.myapp.dev/konto
```

And for the `prod` profile we change to the production urls

urls-prod.properties:
```properties
site.url = https://www.myapp.com
site.disclaimer = https://www.myapp.com/disclaimer

portal.url = https://portal.myapp.com
portal.account = https://portal.myapp.com/account
```
urls-prod_sv.properties:
```properties
portal.account = https://portal.myapp.com/konto
```

### Typesafe access to the urls
Now that we have a extensible way of adding more urls and more languages we need a way to access the urls in a typesafe way.
Since `@ConfigurationProperties` don't support multiple languages The best way I've found is to create a custom service that uses the `@Autowired MessageSource`

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UrlProperties {

	private final MessageSource messageSource;

	private final SiteUrls site;
	private final PortalUrls portal;

	@Autowired
	public UrlProperties(MessageSource messageSource) {
		this.messageSource = messageSource;

		this.site = new SiteUrls();
		this.portal = new PortalUrls();
	}
	
  public SiteUrls getSite() {
    return site;
  }

	public PortalUrls getPortal() {
		return portal;
	}

  /**
   * Helper to get correct message from messageSource
   * There could of course be more advanced getters with parameters that pass them on to the getMessage
   * There could also be a version where you pass in the locale
   */
	private String get(String key) {
		return messageSource.getMessage(key, null, LocaleContextHolder.getLocaleContext().getLocale());
	}
	
	public class SiteUrls {
    public String getUrl() {
      return get("site.url");
    }

    public String getAdmin() {
      return get("site.disclaimer");
    }
  }

	public class PortalUrls {
		public String getUrl() {
			return get("portal.url");
		}

		public String getSignup() {
			return get("portal.account");
		}
	}

}
```

I hoped you liked the tutorial and that it gave you a good starting point for combining profiles and resource bundles.
