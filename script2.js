// Жүктелген кезде үнсіз келісіммен конфеттер мен Қазақстан көрсетіледі
window.onload = function () {
  showCategory('confet');
  showCountry('kz');
};

// Өнім түрлерін (Конфеттер, Печенье...) көрсету
function showCategory(categoryId) {
  const allCategories = document.querySelectorAll('.product-type');
  allCategories.forEach(section => section.classList.add('hidden'));

  const selectedCategory = document.getElementById(categoryId);
  if (selectedCategory) {
    selectedCategory.classList.remove('hidden');
  }

  // Егер конфеттер болса, онда ел таңдауын басқару
  if (categoryId === 'confet') {
    showCountry('kz'); // үнсіз келісім – Қазақстан
  }
}

// Ел бойынша ішкі конфеттерді көрсету
function showCountry(code) {
  const allCountries = document.querySelectorAll('.country-section');
  allCountries.forEach(section => section.classList.add('hidden'));

  const selectedCountry = document.getElementById(code);
  if (selectedCountry) {
    selectedCountry.classList.remove('hidden');
  }
}

const productList = [
  "Алтын құм",
  "Рахат",
  "Красный мак",
  "Матис",
  "Albeni",
  "Merosa",
  "Achachi egg",
  "Aysuda Love",
  "Fine Gold",
  "Забегай на чай",
  "С новым годом"
];

const container = document.getElementById('product-selections');
const question = document.getElementById('add-more-question');
const finalPart = document.getElementById('final-part');
let selectionCount = 0;

function addProductSelection() {
  const div = document.createElement('div');
  div.classList.add('flex', 'gap-4', 'items-center');

  const select = document.createElement('select');
  select.name = `product_${selectionCount}`;
  select.required = true;
  select.className = 'w-1/2 border p-2 rounded';

  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "Қалаған тәтті түрін таңдаңыз";
  select.appendChild(defaultOption);

  productList.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const qty = document.createElement('input');
  qty.type = 'number';
  qty.name = `quantity_${selectionCount}`;
  qty.min = 1;
  qty.placeholder = 'кг/дана';
  qty.required = true;
  qty.className = 'w-1/2 border p-2 rounded';

  div.appendChild(select);
  div.appendChild(qty);
  container.appendChild(div);

  question.classList.remove('hidden');
  finalPart.classList.add('hidden');

  selectionCount++;
}

addProductSelection(); // алғашқысы автоматты түрде көрсетіледі

// Қайта қосу сұрағына жауап
document.querySelectorAll("input[name='more']").forEach(radio => {
  radio.addEventListener('change', e => {
    if (e.target.value === 'yes') {
      addProductSelection();
      e.target.checked = false;
    } else {
      finalPart.classList.remove('hidden');
      question.classList.add('hidden');
    }
  });
});
document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault(); // бетті жаңартуды болдырмау

  // Негізгі өрістер
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const note = document.getElementById('note').value;

  // Барлық өнім тізімі
  const allSelections = document.querySelectorAll('[name^="product_"]');
  const orderList = [];

  allSelections.forEach((select, i) => {
    const selectedProduct = select.value;
    const qtyInput = document.querySelector(`[name="quantity_${i}"]`);
    const quantity = qtyInput ? qtyInput.value : 0;

    if (selectedProduct && quantity > 0) {
      orderList.push(`${selectedProduct} — ${quantity} кг/дана`);
    }
  });

  // EmailJS арқылы жіберу
  emailjs.send("your_service_id", "your_template_id", {
    user_name: name,
    user_phone: phone,
    order_list: orderList.join('\n'),
    note: note
  })
  .then(function(response) {
    alert("Тапсырысыңыз сәтті жіберілді!");
    document.getElementById('order-form').reset();
  }, function(error) {
    alert("Қате шықты! Қайтадан көріңіз.");
    console.error("EmailJS Error:", error);
  });
});
document.getElementById("order-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const note = document.getElementById("note").value;

  // Тауар тізімін жинау
  let orderList = "";
  const selects = document.querySelectorAll("select[name^='product_']");
  const quantities = document.querySelectorAll("input[name^='quantity_']");

  for (let i = 0; i < selects.length; i++) {
    const product = selects[i].value;
    const qty = quantities[i].value;

    if (product && qty) {
      orderList += `${product} – ${qty} кг/дана\n`;
    }
  }

  const templateParams = {
    user_name: name,
    user_phone: phone,
    note: note,
    order_list: orderList
  };

  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
    .then(function(response) {
       alert("Тапсырысыңыз сәтті жіберілді!");
    }, function(error) {
       alert("Қате орын алды: " + JSON.stringify(error));
    });
});

