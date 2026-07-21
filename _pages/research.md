---
layout: single
title: "Research"
permalink: /research/
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
More research results will be added here soon.
{% endif %}
