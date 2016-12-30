---
layout: default
title: Categories
---

<header class="post-header" style="background-image: url('/assets/images/randombg/1.jpg');">
  <h1 class="display-3" itemprop="name headline">{{ page.title | escape }}</h1>
</header>

<div class="container mt-3">
  <div class="row">
    {% assign categories = site.post_categories | sort:"title" %}
    {% for category in categories %}
      <div class="col-md-4 mt-2">
        <a class="card card-inverse mb-0" href="/categories/{{category.slug}}">
          {% assign image = category.image %}
          {% unless image %}
            {% capture image %}/assets/images/randombg/{{site.random_background | sample}}.jpg{% endcapture %}
          {% endunless %}
          <img class="card-img img-fluid" src="{{image}}" alt="{{category.title}}">
          <div class="card-img-overlay">
            <h3 class="card-title mt-3 text-xs-center">{{category.title | escape}}</h3>
          </div>
        </a>
      </div>
    {% endfor %}
  </div>
</div>
