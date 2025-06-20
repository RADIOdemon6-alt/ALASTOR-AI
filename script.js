// بيانات الأطباق
const dishes = [
  { name: "شاورما دجاج",   price: 25, rating: 4.5, img: "shawarma.jpg" },
  { name: "كفتة مشوية",    price: 45, rating: 4.8, img: "kofta.jpg" },
  { name: "برجر لحم",      price: 60, rating: 4.2, img: "burger.jpg" },
  { name: "بيتزا مارجريتا",price: 75, rating: 4.0, img: "pizza.jpg" },
  { name: "عصير مانجو",    price: 20, rating: 4.7, img: "mango.jpg" },
  { name: "فتة شاورما",    price: 65, rating: 4.6, img: "fatta.jpg" },
];

// عناصر DOM
const menuContainer = document.getElementById("menu");
const searchInput   = document.getElementById("search");
const priceFilter   = document.getElementById("price");

// توليد بطاقة طبق
function createDishCard({ name, price, rating, img }) {
  const item = document.createElement("article");
  item.className = "menu-item";
  item.innerHTML = `
    <div class="image-wrapper">
      <img src="${img}" alt="${name}">
    </div>
    <div class="dish-info">
      <h2>${name}</h2>
      <div class="price">${price} ج</div>
      <div class="rating">${"★".repeat(Math.round(rating))}</div>
    </div>
  `;
  return item;
}

// عرض القائمة
function renderMenu(list) {
  menuContainer.innerHTML = "";
  list.forEach(dish => menuContainer.appendChild(createDishCard(dish)));
  attachObservers();           // إعادة تفعيل الـ IntersectionObserver بعد إعادة الرسم
}

// فلترة حسب البحث والسعر
function filterMenu() {
  const term      = searchInput.value.trim().toLowerCase();
  const priceCat  = priceFilter.value;

  const filtered = dishes.filter(d => {
    const matchText  = d.name.toLowerCase().includes(term);
    let matchPrice   = true;

    if (priceCat === "cheap")       matchPrice = d.price <= 30;
    else if (priceCat === "medium") matchPrice = d.price > 30 && d.price <= 60;
    else if (priceCat === "expensive") matchPrice = d.price > 60;

    return matchText && matchPrice;
  });

  renderMenu(filtered);
}

// مستمعو الأحداث
searchInput.addEventListener("input",  filterMenu);
priceFilter.addEventListener("change", filterMenu);

// مراقبة الظهور والاختفاء
let observer;
function attachObservers() {
  const options = { threshold: 0.25 }; // ظهور 25٪ من العنصر
  if (observer) observer.disconnect(); // تنظيف مراقبات قديمة

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  }, options);

  document.querySelectorAll(".menu-item").forEach(item => observer.observe(item));
}

// عرض جميع الأطباق عند التحميل
renderMenu(dishes);
