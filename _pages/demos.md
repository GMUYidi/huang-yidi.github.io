---
layout: single
title: "Demos"
permalink: /demos/
author_profile: true
---

{% assign demos = site.demos | sort: "date" | reverse %}

{% if demos.size > 0 %}
<ul>
{% for demo in demos %}
  <li><strong><a href="{{ demo.url | relative_url }}">{{ demo.title }}</a></strong></li>
{% endfor %}
</ul>
{% else %}
More demo results will be added here soon.
{% endif %}
