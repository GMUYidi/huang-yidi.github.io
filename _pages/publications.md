---
layout: single
title: "Publications"
permalink: /publications/
author_profile: true
---

You can also find my articles on my
[Google Scholar profile](https://scholar.google.com/citations?user=YxVdWQoAAAAJ).

{% assign pubs = site.publications | sort: "date" | reverse %}

### Journal Articles
<hr>
{% for p in pubs %}
  {% if p.categories contains "manuscripts" %}
- **[{{ p.title }}]({{ p.url | relative_url }})**  
  *Published in {{ p.venue }}*  
  **Authors:** {{ p.authors }}  

  {%- if p.links -%}
  {%- for l in p.links -%}[{{ l.label }}]({{ l.url }}){%- if forloop.last == false -%} · {%- endif -%}{%- endfor -%}
  {%- endif -%}
  <br><br>
  {% endif %}
{% endfor %}

### Conference Papers
<hr>
{% for p in pubs %}
  {% if p.categories contains "conferences" %}
- **[{{ p.title }}]({{ p.url | relative_url }})**  
  *Published in {{ p.venue }}*  
  **Authors:** {{ p.authors }}  

  {%- if p.links -%}
  {%- for l in p.links -%}[{{ l.label }}]({{ l.url }}){%- if forloop.last == false -%} · {%- endif -%}{%- endfor -%}
  {%- endif -%}
  <br><br>
  {% endif %}
{% endfor %}
