---
layout: robotics
title: "Curriculum vitae"
permalink: /cv/
author_profile: false
redirect_from:
  - /resume
---

## Education

- **Ph.D. in Innovation Systems of Science and Engineering**, {% include organization.html key="osaka" %}, 2026 (expected)
- **M.S. in Mechanical Science & Engineering**, {% include organization.html key="hust" %}, 2021
- **B.S. in Mechano-Electronic Engineering**, {% include organization.html key="xidian" %}, 2018

## Research interests

Robot manipulation, robot gripper design, grasp pose and motion generation, and robot learning.

## Research experience

**Research Assistant, Harada Lab** · Aug. 2024 – present<br>
Supervised by Prof. Weiwei Wan.

**Research Assistant, Nagai Lab** · Jan. 2023 – Mar. 2024<br>
Supervised by Prof. Takayuki Nagai.

## Industry experience

**R&D Engineer** · {% include organization.html key="huawei" label="Huawei Technology Co., Ltd., Shanghai" %} · Jul. 2021 – Jul. 2022<br>
2012 Labs. Mechanical design of high-precision and test equipment, motion control algorithms for production equipment, and process parameter optimization.

**Intern** · {% include organization.html key="cobot" label="Cobot Technology Co., Ltd., Wuhan" %} · Jun. 2019 – Sep. 2019<br>
Active impedance control, passive adaptive gripper design for peg-in-hole tasks, and inverse kinematic modeling of UR5 and MH5F robots.

## Publications

{% for publication in site.data.publications %}
{% if publication.paper_url %}**[{{ publication.title }}]({{ publication.paper_url | relative_url }})**{% else %}**{{ publication.title }}**{% endif %}<br>
{{ publication.authors }}<br>
*{{ publication.venue }}.*<br>
{% if publication.pdf_url %}[PDF]({{ publication.pdf_url | relative_url }}){% elsif publication.paper_url %}[{{ publication.paper_label }}]({{ publication.paper_url | relative_url }}){% endif %}{% if publication.preprint_url %} · [Author preprint]({{ publication.preprint_url }}){% endif %}{% if publication.video_url %} · [Video]({{ publication.video_url }}){% endif %}{% if publication.poster_url %} · [{{ publication.poster_label }}]({{ publication.poster_url | relative_url }}){% endif %}
{% for video in publication.videos %}{% if forloop.first %}{% if publication.paper_url or publication.pdf_url or publication.preprint_url or publication.video_url or publication.poster_url %} · {% endif %}{% else %} · {% endif %}[{{ video.label }}]({{ video.url | relative_url }}){% endfor %}

{% endfor %}
## Contact

[Email](mailto:{{ site.author.email }}) · [ORCID]({{ site.author.orcid }}) · [GitHub](https://github.com/{{ site.author.github }})
