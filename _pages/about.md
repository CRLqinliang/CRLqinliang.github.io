---
layout: robotics
permalink: /
title: "Liang Qin"
excerpt: "Research in robot learning and manipulation at the University of Osaka."
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

<div class="academic-home">
<section id="about-me" class="home-section home-intro" aria-labelledby="about-heading">
  <div class="hero-system-background" aria-hidden="true">
    <div class="ascii-scene">
      {% include ascii-handover.html %}
      <span class="ascii-scene-caption">Handover</span>
    </div>
    {% include ascii-playlist.html %}
  </div>
  <div class="hero-heading">
    <p class="home-eyebrow">Robot learning &amp; manipulation</p>
    <h1 id="about-heading">Liang Qin</h1>
    <p class="hero-role">Ph.D. candidate · {% include organization.html key="osaka" %}</p>
  </div>
  <div class="hero-copy">
    <p class="home-lead">High success rates in robotic manipulation depend on the integration of <strong>mechanical design, perception, and planning algorithms.</strong></p>
    <div class="hero-bio">
      <p>At <a href="https://www.roboticmanipulation.org/">Harada Lab</a>, I work with <a href="https://wanweiwei07.github.io/">Prof. Weiwei Wan</a> on grasp and regrasp planning, combining learning-based methods with practical robotic systems.</p>
      <p>Previously, I was a Ph.D. student in the Robot Learning Group at <a href="http://www.rlg.sys.es.osaka-u.ac.jp/">Nagai Lab</a>, supervised by Prof. Takayuki Nagai.</p>
      <p>I earned my master's degree at Huazhong University of Science and Technology (HUST), working with Prof. Wenyu Yang at the <a href="https://dmet.hust.edu.cn/index.htm">State Key Laboratory of Intelligent Manufacturing Equipment and Technology</a>, and my bachelor's degree at Xidian University in 2018.</p>
    </div>
  </div>
  <figure class="hero-portrait">
    <img src="{{ '/images/profile.jpg' | relative_url }}" alt="Liang Qin" width="751" height="796" decoding="async">
    <figcaption>Osaka, Japan</figcaption>
  </figure>
  <div id="manipulation-approach" class="hero-perspective">
    <p>My research throughout my bachelor's, master's, and doctoral studies has focused on robotic manipulation. Working across these disciplines helps me approach manipulation problems from multiple perspectives.</p>
    <p>Beyond publications, my priority is solving practical industrial problems. I am keen to work with companies that have real industrial challenges and a need for intelligent automation.</p>
  </div>
  <div class="home-actions">
    <a class="home-button" href="{{ '/#publications' | relative_url }}">Publications <span aria-hidden="true">↗</span></a>
    <a class="home-button home-button--secondary" href="{{ '/cv/' | relative_url }}">CV <span aria-hidden="true">↗</span></a>
    <a href="mailto:{{ site.author.email }}">Email</a>
    <a href="{{ site.author.orcid }}">ORCID</a>
    <a href="https://github.com/{{ site.author.github }}">GitHub</a>
    <button class="ascii-motion-toggle" type="button" aria-label="Pause ASCII background animation" hidden>Pause background</button>
  </div>
</section>

<section id="research" class="home-section" aria-labelledby="research-heading">
  <h2 id="research-heading">Research interests</h2>
  <div class="research-grid research-grid--projects">
    <article class="research-card research-card--gripper" aria-labelledby="gripper-heading">
      <div class="gripper-section-heading">
        <h3 id="gripper-heading">Gripper design</h3>
        <div class="gripper-navigation" hidden>
          <button type="button" class="gripper-previous" aria-label="Previous gripper project" aria-controls="gripper-projects">←</button>
          <span class="gripper-position" aria-live="polite" aria-atomic="true">1 / 4</span>
          <button type="button" class="gripper-next" aria-label="Next gripper project" aria-controls="gripper-projects">→</button>
        </div>
      </div>
      <div id="gripper-projects" class="gripper-projects" role="region" aria-label="Gripper design projects" tabindex="0">
        <section class="gripper-project gripper-project--tweezers" aria-labelledby="tweezers-heading">
          <div class="gripper-intro">
          <h4 id="tweezers-heading">Tweezers gripper</h4>
          <p>A motor-driven tweezers gripper with interchangeable, 3D-printed adapters for small-object manipulation.</p>
          </div>
          <figure class="gripper-demo">
            <video controls muted playsinline preload="none" poster="{{ '/images/research/tweezers-demo-poster.jpg' | relative_url }}" aria-label="Silent demonstration of the tweezers gripper manipulating a small metal part" width="568" height="320">
              <source src="{{ '/files/tweezers-gripper-demo.mp4' | relative_url }}" type="video/mp4">
              Your browser does not support embedded video. <a href="{{ '/files/tweezers-gripper-demo.mp4' | relative_url }}">Download the demonstration</a>.
            </video>
            <figcaption>Gripper demonstration · <a href="{{ '/files/tweezers-gripper-demo.mp4' | relative_url }}">Open video</a></figcaption>
          </figure>
          <div class="gripper-figures">
            <figure><a href="{{ '/images/research/tweezers-task-full.webp' | relative_url }}" aria-label="View full small-part measurement task diagram"><img src="{{ '/images/research/tweezers-task-full.webp' | relative_url }}" alt="Small metal switch parts and a robot reorientation setup for measurement from multiple views." loading="lazy" decoding="async" width="3740" height="1711"></a><figcaption>Small-part measurement task <span aria-hidden="true">↗</span></figcaption></figure>
            <figure><a href="{{ '/images/research/tweezers-design-full.webp' | relative_url }}" aria-label="View full tweezers gripper design diagram"><img src="{{ '/images/research/tweezers-design-full.webp' | relative_url }}" alt="Motor, drive gears, tweezers adapters and parallel pressing mechanism of the gripper." loading="lazy" decoding="async" width="3054" height="1526"></a><figcaption>Mechanism &amp; design <span aria-hidden="true">↗</span></figcaption></figure>
          </div>
        </section>
        <section class="gripper-project gripper-project--multi" aria-labelledby="multi-finger-heading">
          <div class="gripper-intro">
          <h4 id="multi-finger-heading">Multi-finger gripper</h4>
          <p>A gripper prototype and a sequence showing the fingers closing around a cylindrical object.</p>
          </div>
          <figure class="gripper-prototype">
            <a href="{{ '/images/research/multi-finger-prototype-enhanced.png' | relative_url }}" data-original-href="{{ '/images/research/multi-finger-prototype.png' | relative_url }}" aria-label="View full AI-enhanced multi-finger gripper prototype photo"><img src="{{ '/images/research/multi-finger-prototype-enhanced.png' | relative_url }}" alt="AI-enhanced gripper prototype with its motors, wiring and articulated fingers." width="1451" height="1084" loading="lazy" decoding="async"></a>
            <figcaption>Gripper prototype · AI-enhanced<br><a href="{{ '/images/research/multi-finger-prototype.png' | relative_url }}" target="_blank" rel="noopener">Original photo ↗</a></figcaption>
          </figure>
          <figure class="gripper-sequence">
            <a href="{{ '/images/research/multi-finger-grasp-sequence-enhanced.png' | relative_url }}" data-original-href="{{ '/images/research/multi-finger-grasp-sequence.jpg' | relative_url }}" aria-label="View full AI-enhanced multi-finger grasping sequence"><img src="{{ '/images/research/multi-finger-grasp-sequence-enhanced.png' | relative_url }}" alt="AI-enhanced sequence of five views of the articulated gripper closing around a cylindrical object." loading="lazy" decoding="async" width="2181" height="721"></a>
            <figcaption>Grasping sequence · AI-enhanced<br><a href="{{ '/images/research/multi-finger-grasp-sequence.jpg' | relative_url }}" target="_blank" rel="noopener">Original sequence ↗</a></figcaption>
          </figure>
        </section>
        <section id="teleoperation-master-arm" class="gripper-project gripper-project--master-arm" aria-labelledby="master-arm-heading">
          <div class="master-arm-description">
            <h4 id="master-arm-heading">3D-printed teleoperation master arm</h4>
            <p>A master arm for offset teleoperation, built with a fully 3D-printed, bearing-free mechanical structure.</p>
            <ul class="master-arm-features">
              <li><strong>Fabrication:</strong> fully 3D-printed mechanical structure, with no bearings.</li>
              <li><strong>Joint sensing:</strong> electromagnetic angle encoders.</li>
              <li><strong>Gravity compensation:</strong> constant-force springs.</li>
            </ul>
          </div>
          <figure class="gripper-demo master-arm-demo">
            <video controls muted playsinline preload="none" poster="{{ '/images/research/teleoperation-master-arm-poster.jpg' | relative_url }}" aria-label="Silent demonstration of a 3D-printed teleoperation master arm" width="720" height="1280">
              <source src="{{ '/files/teleoperation-master-arm-demo.mp4' | relative_url }}" type="video/mp4">
              Your browser does not support embedded video. <a href="{{ '/files/teleoperation-master-arm-demo.mp4' | relative_url }}">Download the demonstration</a>.
            </video>
            <figcaption>Master arm demonstration · <a href="{{ '/files/teleoperation-master-arm-demo.mp4' | relative_url }}">Open video</a></figcaption>
          </figure>
        </section>
        <section id="tube-cutting-fixture" class="gripper-project gripper-project--tube-fixture" aria-labelledby="tube-fixture-heading">
          <div class="gripper-intro">
            <h4 id="tube-fixture-heading">Thin-wall tube laser-cutting fixture</h4>
            <p>Fixture prototype for a compact laser-cutting machine for thin-walled tubes.</p>
          </div>
          <ul class="tube-fixture-features">
            <li><strong>Repeated feeding:</strong> process long tubes through multiple feed cycles to reduce the required guide-rail length.</li>
            <li><strong>Chuck design:</strong> combine an eight-roller support chuck with a compliant-contact drive chuck.</li>
            <li><strong>Stiffness distribution:</strong> optimize the support and drive arrangement to reduce circumferential runout at the laser-cutting location.</li>
          </ul>
          <div class="tube-fixture-media">
            <figure>
              <a href="{{ '/images/research/tube-fixture-prototype-enhanced.png' | relative_url }}" data-original-href="{{ '/images/research/tube-fixture-prototype.png' | relative_url }}" aria-label="View full tube-cutting fixture prototype (AI-enhanced)"><img src="{{ '/images/research/tube-fixture-prototype-enhanced.png' | relative_url }}" alt="AI-enhanced: Fixture prototype with support and drive chucks, auxiliary fingers, and a digital micrometer." width="1906" height="825" loading="lazy" decoding="async"></a>
              <figcaption>Fixture prototype · AI-enhanced<br><a href="{{ '/images/research/tube-fixture-prototype.png' | relative_url }}" target="_blank" rel="noopener">Original ↗</a></figcaption>
            </figure>
            <div class="tube-fixture-gallery">
              <figure><a href="{{ '/images/research/tube-fixture-cad-enhanced.png' | relative_url }}" data-original-href="{{ '/images/research/tube-fixture-cad.png' | relative_url }}" aria-label="View full tube fixture CAD model (AI-enhanced)"><img src="{{ '/images/research/tube-fixture-cad-enhanced.png' | relative_url }}" alt="AI-enhanced: CAD model of the support chuck, auxiliary support mechanism, and drive chuck." width="1855" height="848" loading="lazy" decoding="async"></a><figcaption>CAD assembly · AI-enhanced<br><a href="{{ '/images/research/tube-fixture-cad.png' | relative_url }}" target="_blank" rel="noopener">Original ↗</a></figcaption></figure>
              <figure><a href="{{ '/images/research/tube-fixture-drive-chuck-enhanced.png' | relative_url }}" data-original-href="{{ '/images/research/tube-fixture-drive-chuck.png' | relative_url }}" aria-label="View full tube fixture drive chuck (AI-enhanced)"><img src="{{ '/images/research/tube-fixture-drive-chuck-enhanced.png' | relative_url }}" alt="AI-enhanced: Drive chuck prototype showing the direct-drive motor, slip ring, force sensor, and screw-driven stepper mechanism." width="1629" height="966" loading="lazy" decoding="async"></a><figcaption>Drive chuck · AI-enhanced<br><a href="{{ '/images/research/tube-fixture-drive-chuck.png' | relative_url }}" target="_blank" rel="noopener">Original ↗</a></figcaption></figure>
              <figure><a href="{{ '/images/research/tube-laser-cutting-context-enhanced.png' | relative_url }}" data-original-href="{{ '/images/research/tube-laser-cutting-context.png' | relative_url }}" aria-label="View full tube laser-cutting illustration (AI-enhanced)"><img src="{{ '/images/research/tube-laser-cutting-context-enhanced.png' | relative_url }}" alt="AI-enhanced: Tube laser-cutting application and diagrams of laser melting and material removal." width="1965" height="800" loading="lazy" decoding="async"></a><figcaption>Cutting context · AI-enhanced<br><a href="{{ '/images/research/tube-laser-cutting-context.png' | relative_url }}" target="_blank" rel="noopener">Original ↗</a></figcaption></figure>
            </div>
          </div>
        </section>
      </div>
    </article>
    <article class="research-card research-card--topic"><div class="research-thumbnail"><img src="{{ '/images/research/motion-planning-screen.webp' | relative_url }}" alt="MoveIt RViz motion-planning interface with Panda robot poses." width="800" height="436" loading="lazy" decoding="async"></div><div class="research-topic-copy"><h3>Grasp &amp; motion planning</h3><p>Grasp pose generation and robot motion generation.</p><p class="research-credit">Screenshot: <a href="https://moveit.ai/">MoveIt</a></p></div></article>
    <article class="research-card research-card--topic"><div class="research-thumbnail"><img src="{{ '/images/research/robot-learning-demo.webp' | relative_url }}" alt="Real robot manipulating a mug in the Diffusion Policy demonstration." width="800" height="533" loading="lazy" decoding="async"></div><div class="research-topic-copy"><h3>Robot learning</h3><p>Learning-based approaches to robotic manipulation.</p><p class="research-credit">Demo: <a href="https://diffusion-policy.cs.columbia.edu/">Diffusion Policy</a></p></div></article>
  </div>
</section>

<section id="publications" class="home-section" aria-labelledby="publications-heading">
  <span id="recent-publications" class="home-anchor" aria-hidden="true"></span>
  <h2 id="publications-heading">Publications</h2>
  {% include featured-publications.html %}
</section>

<section id="education" class="home-section" aria-labelledby="education-heading">
  <h2 id="education-heading">Education</h2>
  <ul class="home-timeline">
    <li><p class="timeline-date">2026 (expected)</p><div><h3>Ph.D. in Innovation Systems of Science and Engineering</h3><p>{% include organization.html key="osaka" %}</p></div></li>
    <li><p class="timeline-date">2021</p><div><h3>M.S. in Mechanical Science &amp; Engineering</h3><p>{% include organization.html key="hust" %}</p></div></li>
    <li><p class="timeline-date">2018</p><div><h3>B.S. in Mechano-Electronic Engineering</h3><p>{% include organization.html key="xidian" %}</p></div></li>
  </ul>
</section>

<section id="experience" class="home-section" aria-labelledby="experience-heading">
  <span id="research-experience" class="home-anchor" aria-hidden="true"></span>
  <h2 id="experience-heading">Research experience</h2>
  <ul class="home-timeline">
    <li><p class="timeline-date">Aug. 2024 — present</p><div><h3>Research Assistant · Harada Lab</h3><p>Supervised by Prof. Weiwei Wan</p></div></li>
    <li><p class="timeline-date">Jan. 2023 — Mar. 2024</p><div><h3>Research Assistant · Nagai Lab</h3><p>Supervised by Prof. Takayuki Nagai</p></div></li>
  </ul>
</section>

<section id="work-experience" class="home-section" aria-labelledby="work-heading">
  <h2 id="work-heading">Industry experience</h2>
  <ul class="home-timeline">
    <li><p class="timeline-date">Jul. 2021 — Jul. 2022</p><div><h3>R&amp;D Engineer · {% include organization.html key="huawei" %}</h3><p>2012 Labs · Shanghai</p><p>Mechanical design of high-precision and test equipment, motion control algorithms for production equipment, and process parameter optimization.</p></div></li>
    <li><p class="timeline-date">Jun. 2019 — Sep. 2019</p><div><h3>Intern · {% include organization.html key="cobot" %}</h3><p>Wuhan</p><p>Active impedance control, passive adaptive gripper design for peg-in-hole tasks, and inverse kinematic modeling of UR5 and MH5F robots.</p></div></li>
  </ul>
</section>
</div>
