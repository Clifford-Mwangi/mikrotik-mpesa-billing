const BACKEND_URL = "http://thelinkinternet.local:5000";

async function loadPlans() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/plans`);
    const plans = await res.json();

    const plansDiv = document.getElementById("plans");
    plansDiv.innerHTML = "";

    plans.forEach((plan) => {
      const div = document.createElement("div");
      div.className = "plan";

      div.innerHTML = `
        <h3>${plan.name}</h3>
        <p>Speed: ${plan.speed}</p>
        <p>Price: KES ${plan.price}</p>
        <p>Duration: ${plan.duration} Days</p>
        <input type="tel" placeholder="Enter phone number" id="phone-${plan._id}" />
        <button onclick="buyPlan('${plan._id}', '${plan.name}', ${plan.price})">
          Buy Now
        </button>
      `;

      plansDiv.appendChild(div);
    });
  } catch (err) {
    alert("Failed to load plans");
    console.error(err);
  }
}

async function buyPlan(planId, planName, amount) {
  const phone = document.getElementById(`phone-${planId}`).value;

  if (!phone) {
    alert("Enter phone number");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/payments/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount, planName, planId }),
    });

    const data = await res.json();
    alert(data.message || "STK Push sent. Check your phone.");
  } catch (err) {
    alert("Payment failed");
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadPlans);
