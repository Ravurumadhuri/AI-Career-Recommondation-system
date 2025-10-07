document.getElementById("recommendBtn").addEventListener("click", async () => {
  const skills = document.getElementById("skills").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!skills) {
    alert("⚠️ Please enter your skills!");
    return;
  }

  resultsDiv.innerHTML = `
    <div class="loading">
      Analyzing your skills
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;

  try {
    const response = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }),
    });

    const data = await response.json();
    if (data.error) {
      resultsDiv.innerHTML = `<p class="error">${data.error}</p>`;
      return;
    }

    resultsDiv.innerHTML = "<h2>✨ Recommended Careers for You</h2>";
data.forEach(job => {
  resultsDiv.innerHTML += `
    <div class="card">
      <h3>${job.role}</h3>
      <p><strong>Key Skills:</strong> ${job.skills}</p>
      <p><strong>Upskilling:</strong> ${job.upskilling}</p>
    </div>`;
});

  } catch (err) {
    resultsDiv.innerHTML = `<p class="error">❌ Server not running! Start backend first.</p>`;
  }
});
