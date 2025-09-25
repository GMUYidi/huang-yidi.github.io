---
layout: single
title: "Publications"
permalink: /publications/
author_profile: true
---

You can also find my articles on my
[Google Scholar profile](https://scholar.google.com/citations?user=YxVdWQoAAAAJ).

{% assign pubs = site.publications | sort: "date" | reverse %}

{% comment %} ---- Journal Articles ---- {% endcomment %}
{% assign journals = pubs | where_exp: "p", "p.categories contains 'manuscripts'" %}
{% if journals.size > 0 %}
### Journal Articles
<hr>
{% for p in journals %}
- **[{{ p.title }}]({{ p.url | relative_url }})**  
  *Published in {{ p.venue }}*  
  **Authors:** {{ p.authors }}.  
  {% if p.links %}
  {% for l in p.links %}
  [{{ l.label }}]({{ l.url }}){% if forloop.last == false %} · {% endif %}
  {% endfor %}
  {% endif %}
  <br><br>
{% endfor %}
{% endif %}

{% comment %} ---- Conference Papers ---- {% endcomment %}
{% assign confs = pubs | where_exp: "p", "p.categories contains 'conferences'" %}
{% if confs.size > 0 %}
### Conference Papers
<hr>
{% for p in confs %}
- **[{{ p.title }}]({{ p.url | relative_url }})**  
  *Published in {{ p.venue }}*  
  **Authors:** {{ p.authors }}.  
  {% if p.links %}
  {% for l in p.links %}
  [{{ l.label }}]({{ l.url }}){% if forloop.last == false %} · {% endif %}
  {% endfor %}
  {% endif %}
  <br><br>
{% endfor %}
{% endif %}
