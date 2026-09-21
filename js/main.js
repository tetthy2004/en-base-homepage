document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  toggle.addEventListener("click", function () {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
